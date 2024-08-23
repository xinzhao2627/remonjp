const express = require('express')
const cors = require('cors')
const wanakana = require('wanakana')
const kuromoji = require('kuromoji')
// const db = require('better-sqlite3')('./rdict.db')
const PORT = process.env.PORT || 4000
const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('rdict.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) return console.error(err.message);
})


const app = express()
// MIDDLE WARES
app.use(cors({
    origin:'*',
}))




app.use(express.json())
const posMapping = {
    '名詞': 'noun',
    '動詞': 'verb',
    '形容詞': 'adjective',
    '副詞': 'adverb',
    '助詞': 'particle',
    '助動詞': 'auxiliary',
    '連体詞': 'adjectival',
    '接続詞': 'conjunction',
    '感動詞': 'interjection',
    '記号': 'symbol',
    'その他': 'other'
}
async function executeQuery(query, p = []) {
    return new Promise((resolve, reject) => {
        db.all(query, p, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);   

            }
        });
    });
}

let tokenizer;
async function initializeTokenizer() {
    if (!tokenizer){
        tokenizer = await new Promise ((resolve, reject) => {
            kuromoji.builder({ dicPath: "node_modules/kuromoji/dict/" }).build(function (err, tokenizer) {
                if (err){
                    reject(err)
                } else {
                    resolve(tokenizer)
                }
            })
        })
    }
    return tokenizer
}

async function tokenizeSentence (sentence){
    try {
        const tz = await initializeTokenizer()
        return tz.tokenize(sentence)
    } catch (err) {
        console.error("TOKENIZATION ERROR: ",err)
    }
}
async function lookupKanji(s){
    q = `
        SELECT 
            k.*, GROUP_CONCAT(d.meaning) AS meanings
        FROM
            kanji k
        JOIN
            desc  d
            ON d.m_element = k.k_element
        WHERE 
            ? 
            LIKE CONCAT('%', k_element, '%') 
    `
    return await executeQuery(q+" GROUP BY k_element", [s['jp_sentence']])
}
async function getQuiz (lv, limit, freq){
    let arr = []
    let toConcat = []
    q1 = 'SELECT * FROM sentences WHERE '
    for (let i = 5; i > 0; i--){
        arr.push((i === lv) ? freq : 0)
        toConcat.push((!freq && i === lv)? `n${i} >= ? ` : `n${i} = ? `)
    }
    let q2 = toConcat.map((x, i) => {
        let s = (i !== 0) ? " AND ":""
        s+= x
        return s
    })
    arr.push(limit)
    return await executeQuery(q1+(q2.join('')) + "ORDER BY random() LIMIT ? ", arr)
}
async function structurize (sentences){
    
    for (const s of sentences) {
        s['structure'] = []
        // console.time("kanji")
        s['kanji']= await lookupKanji(s)
        // console.timeEnd("kanji")

        // console.time("tokenizeSentence")
        let tokens = await tokenizeSentence(s['jp_sentence'])
        // console.timeEnd("tokenizeSentence")

        let co = 1
        let wq =`
            WITH filtered_data AS (
        `
        let addUn = false
        // console.time("token 1 loop")
        for (let t of tokens) {
            
            const pass = posMapping[t['pos']] !== 'auxillary' 
                    && posMapping[t['pos']] !== 'particle' 
                    && posMapping[t['pos']] !== 'symbol' 
                    && posMapping[t['pos']] !== 'other'
                    && posMapping[t['pos']] !== 'auxiliary'  
                    && (t['surface_form'].length !== 1 || wanakana.isKanji(t['surface_form'])) 
                    && !wanakana.isKatakana(t['surface_form'])
            

            if(pass){
                wq += (addUn) ? " UNION ALL " : ""
                addUn = true
                wq += `
                    SELECT 
                    gloss_list.gloss, ${co} as co
                    FROM jmdict_r_ele AS reading 
                    JOIN jmdict_sense AS sense ON sense.seq = reading.seq
                    JOIN jmdict_gloss_list AS gloss_list ON gloss_list.senseID = sense.senseID
                    JOIN jmdict_k_ele AS kanji ON kanji.seq = reading.seq
                    WHERE (kanji.keb = '${t['surface_form']}' OR reading.reb = '${t['surface_form']}' ) AND sense.pos LIKE '%${posMapping[t['pos']]}%'
                `
                t['co'] = co++
                t['accepted'] = true
            } else {
                t['accepted'] = false
            }
            // console.log("surface form: ", t['surface_form'], " ", t['accepted'], " " , t['co'])

        }
        // console.timeEnd("token 1 loop")
        wq += `
        )
        SELECT GROUP_CONCAT(DISTINCT(gloss)) AS gloss, co
        FROM filtered_data
        GROUP BY co
        `
        // console.log("done")
        
        // console.time("parts")
        let parts = await executeQuery(wq)
        // console.timeEnd("parts")

        let pid = 0
        // console.time("token 2 loop")

        for (const t of tokens) {
            let g = ''
            if (t['co']){
                const tempGloss = parts.find((p) => p['co'] == t['co'])
                g = (tempGloss) ? tempGloss['gloss'] : g  
            }
            s['structure'].push({
                "word":t['surface_form'],
                "reading_katakana":t['reading'],
                "reading_hiragana":wanakana.toHiragana(t['reading']),
                "romaji":wanakana.toRomaji(t['reading']),
                "pos" : posMapping[t['pos']],
                "gloss": g
            })
        }
        // console.timeEnd("token 2 loop")

    }
    return sentences
}
app.get('/api/quiz/:field/:freq?/:limit?', async (req, res) => {
    try{
        const levels = {'n5':5, 'n4':4, 'n3':3, 'n2':2, 'n1': 1}
        const field = req.params.field.toLowerCase()
        const limit = req.params.limit || 1
        const freq = req.params.freq || 0
        // console.log(field," " ,limit," " ,freq)
        if (field in levels && parseInt(limit) > 0 && parseInt(freq) >= 0){

            const sentencesUnstructured = await getQuiz(levels[field], limit, freq)
            const sentencesStructured = await structurize(sentencesUnstructured)
            return res.json(sentencesStructured)
        } else {
            throw 'INVALID FIELD ENTRY'
        }

    }catch (err){
        console.error(err)
        res.status(500).json({ error: `Database error`})
    }
})

app.post('/api/custom', async (req, res) => {
    try {
        const tokenizer = await initializeTokenizer() 
        const jlpt_levels = req.body.jlpt_levels
        const limit = req.body.limit || 1

        if (!jlpt_levels && limit > 20) throw 'INVALID POST REQUEST'
        let q1 = "SELECT * FROM sentences "
        let toConcat = []
        const arr = []
        for (const [k, v] of Object.entries(jlpt_levels)){
            if (v['isActive'] && Number.isInteger(parseInt(v['value']))){
                toConcat.push(k + " = ? ")
                arr.push(v['value'])
            } else  if (!v['isActive']){
                toConcat.push(k + " = ? ")
                arr.push(0)
            }
        }
        q1 += (arr.length > 0 ) ? "WHERE ":''

        let q2 = toConcat.map((x, i) => {
            let s = (i !== 0) ? " AND ":""
            s+= x
            return s
        })

        q = q1+(q2.join('')) + "ORDER BY random() LIMIT ? "
        arr.push(limit)
        const sentencesUnstructured = await executeQuery(q, arr)
        const sentencesStructured = await structurize(sentencesUnstructured, tokenizer)
        res.json(sentencesStructured)

   } catch (err) {
        res.status(500).json({error: `DATABASE ERROR ${err}`})
   }

})
app.post('/api/custominput', async (req, res) => {
    try {
        // console.time("MAIN tokenizer")
        const tokenizer = await initializeTokenizer()
        // console.timeEnd("MAIN tokenizer")

        const input = req.body.texts || ''
        if (!input) throw "INVALID INPUT"
        const sentences = [{'jp_sentence': input}]
        // console.time("MAIN sntenc")
        const sentencesStructured = await structurize(sentences, tokenizer)
        // console.timeEnd("MAIN sntenc")
        // console.log(sentencesStructured[0]['structure'])
        res.json(sentencesStructured)
    } catch (err){
        res.status(500).json({error: `DATABASE ERROR ${err}`})
    }
})
app.get('/api/random:limit?', async (req, res) => {
    try {
        console.time(`OVERALL`)
        // console.time("INITIALIZE TOKEN")
        const tokenizer = await initializeTokenizer() 
        // console.timeEnd("INITIALIZE TOKEN")


        let q = 'SELECT * FROM sentences ORDER BY random() LIMIT ?'
        let l = parseInt(req.params.limit)
        l =  l || 1 

        // console.time("Get sentence")
        const sentencesUnstructured = await executeQuery(q, [l])
        // console.timeEnd("Get sentence")

        // console.time("struct sentence")
        const sentencesStructured = await structurize(sentencesUnstructured, tokenizer)
        // console.timeEnd("struct sentence")
        console.timeEnd(`OVERALL`)
        console.log('==========\n')
        res.json(sentencesStructured)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: `Database error`})
    }
})

app.get('/', (req, res) => {
    res.send("remonjp api on vercel, see: \n /api/random \n /api/quiz and other post requests!")
})

app.use((req, res, next) => {
    res.status(404).json({
        error: "Not Found",
        message: "The requested resource could not be found."
    });
});
app.listen(PORT, () => {
    initializeTokenizer()
})

process.on('exit', () => {db.close()})


module.exports = app