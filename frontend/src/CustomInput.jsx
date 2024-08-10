/* eslint-disable no-unused-vars */


import { Spinner,Tooltip,VStack, Text,Button, HStack, Input, Tab, TabList, TabPanel, TabPanels, Tabs, Textarea, useColorMode, Heading, Box } from '@chakra-ui/react';
import JPMenu from './JPMenu';
import DrawerKanji from './DrawerKanji';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'


const japDummy = `切政ルラご史際ぴふ事種の法結そす社芸ぜやまよ内参真ヤヨタミ辞戸ウタレ権好テ意返ソモ低岐62経うす方空テケ募劣嘆寧皿すずご。入にぞもせ知共ドろ衆当ニケミ日激ぞほフと似銭かふ裕立こゃ正能ぱに作低残んリ必日クヌヘ観季セホサ問14政医乗でぎーす。務み中同ニホワ利目ツ弘社ケヨコリ全千レ刑13載比べ伸40振ょろ真安ど得志ヒツヤネ慈廃道をじまへ高格ヤモコレ元版孤ヱシムハ面写融達つ。

時撃ツソ作景ユヲツ了惑メソヨ反立ッスぶリ倣留ユ米8案得に極変ケ無局席位米天タレワ者嗅尽措ゃぱ。段おね代物へめあみ体料フへ盟映ト形座質リぎ目催ヨウニ特1皇ルぴび竹社ね機抗がんれ政真文ソヱヤニ現像英てう。詐ヒマアノ再児れろイ味6品ヤナネ名増アヌ保61代尊9比カ実臣ぽけスふ特能ぜげば能所ヒニハシ記白クろざ興祭ヒエ不間べ縄聴遊御裕ト。

舫ハシ堪落よラひ月合風ごさ賞陥スのげ芦型い難対ぞりふぎ上高た安62毎請ラろけて念議8義型働けぞ。売リカムイ権上ごぜい止公セニ協業ラ福併ヘ付検ドで行球わ成前県ヌニツ今訪とフ丈芸ク険載ハクツル陸62報集ろよね支凶圭寂た。秋ぞよ閣1各フ館用ワヤシハ光億クモ掲引ハ理決ニエレ寄投図イ連止通ケツアヲ間近詳いン奇輸シムテ一介れく滞連カ庁興結もづる府婦項互イえぼッ。

9界イノヲラ葉社へづ歳報努み集書ナイノ信歓実へほ更円むどざゆ真感オ掲惑焉げッ壇裁材造指こドよ。7岡だーッま事写チメ近説シメユハ入健ち応生芸金ス確誘ワ使計ラじ意攻ツケ目好職タヱ録抜爆じの。情サヨユノ跳者ねべふる広俊将おなる今教リ面9固ぽかッレ交贅ろルトば京70航ヘモ枠天ラヌオク熊回コ能表ヱキヤ来山もる毎研ワモユソ揮徴レスじへ煙交歯ル加作ぱン込速スイム写侍勃んン。

6香ソスタウ一軽の駒宰ょな全月じルご及96中な年仏さ蔵安ウリスケ身考ル当囲ハラムヌ転柴ほこ村徳弁戦ワツコ業娯スリイ離演ト聖続面ル赤聴てふぽ。回お被歳ち任94権ざおみ富山流カミリ形秀ウ初審勲ワ支変場ニヱレ担瀬こかく中度うだしル高嗅61盤ぐドリこ軽37法ヨキ月織ねつぼ定人ヲリモナ市労ごそ。

堂ゅ実就ンょぽぴ受空ふぎ通厚しあゆ脅催ヱサヨ権向ヨ門界法トきぼス鮮朝ケロ文額35信`

function CustomInput() {
    // 
    const [input, setinput] = useState('切政ルラご史際ぴふ事種の')
    const { colorMode, toggleColorMode } = useColorMode()
    const [isStructurized, setIsStructurized] = useState(false)
    const [tabIndex, setTabIndex] = useState(0)
    const [structId, setStructId] = useState([])
    // GENERAL: MAIN SCREEN CONTENT INFO AFTER GENERATION
    const [fpart, setFpart] = useState()
    const [kanji, setKanji] = useState()
    // GENERAL: LOADING PROCS 
    const [startLoading, setStartLoading] = useState(false)
    // TTTT
    const [userAnswer, setUserAnswer] = useState('')
    const [userSubmitted, setUserSubmitted] = useState(false)


    const formatData = async (d) => {
        let fp;
        let kj;
        for (const sentence of d) {
            const id = sentence.jp_id
            if (structId.includes(id)) continue

            const jp = sentence.jp_sentence
            const en = sentence.en_sentence
            const structs = sentence.structure
            const kanji = sentence.kanji
            let rm_sentence = ''

            fp=<ul key={sentence.jp_id} className='sentence' style={{paddingLeft:'0'}}> 
            {structs.map((sct,i) => {
                // 1st layer CONTENT
                const word = sct.word
                const hiragana = sct.reading_hiragana
                const hasParts = word !== sct.reading_katakana && word !== hiragana

                // 2nd layer TOOLTIP
                const romaji = sct.romaji
                const pos = sct.pos
                rm_sentence += " "+romaji
                

                const glosses = sct.gloss.split(/,(?![^()]*\))/)
                const renderGloss = <section className='row container'>
                    {glosses.map((g,z) => {
                    return <span key={`sp-m-${z}`} className='col-auto mm mt-1 mb-2'>{g.trim()}</span>
                    })}
                </section>

                return <React.Fragment key={`sFrag ${i}`}>
                    <Tooltip hasArrow label={
                        <VStack>
                            <Text as={'b'} fontSize={'xl'}>{romaji}</Text>
                            <Text as={'i'}  fontSize={'md'}>{pos}</Text>
                            {renderGloss || ''}
                        </VStack>
                    } bg='white' color='black' closeDelay={300} openDelay={300}>
                        {hasParts ?
                            <li className="segment mb-2" key={`li-${word}-${i}`} >
                                <span className="segment-container" key={`span-container-${word}-${i}`}>
                                    <span  className="readings mt-2" key={`readings-${word}-${i}`}
                                        style={{color: '#b0b0b0', fontSize:'initial'}}
                                    >
                                        {hiragana}
                                    </span>
                                    <span
                                        className="word"
                                        style={{
                                        borderBottom:'2px solid #37B7C3',
                                        cursor:'pointer',
                                        }}
                                        key={`word-${word}-${i}`}
                                    >
                                        {word}
                                    </span>
                                </span>
                            </li>
                            : <li className="segment mb-2 comma" key={`li-${word}-${i+i}`} style={{cursor:'pointer'}}>
                                {word === "、" ? ',' : word === "。" ? '.' : word}
                            </li>
                        }
                    </Tooltip>
                </React.Fragment>
            })}
        </ul> 
            setFpart(
                fp
            )
            kj = <Box>
            {
                sentence.kanji.map((k, i) => {
                    const element = k.k_element
                    const jlpt = k.new_jlpt
                    const meanings_string = k.meanings
                    return <React.Fragment key={'kFragment ' + i}>
                    <Box key={`li-${k}`} className='p-1'>
                        <div key = {`div-${k}`} className='section p-2'>
                            <Heading key={`sp-ele-${k}`} className='text' style={{display:'block', textAlign:'left'}}>{element}</Heading>
                            <span key={`sp-jlpt-${k}`} className={`jlpt-${jlpt || 'unknown'} jlpt px-2`} style={{display:'block'}}>{(jlpt) ? `N${jlpt}` : 'unknown'}</span>
                            <section className='row container'>
                                {meanings_string.split(/,(?![^()]*\))/).map((m,j) => {
                                    return <span key={`sp-m-${j}`} className='col-auto mm mt-2'>{m.trim()}</span>
                                })}
                            </section>
                        </div>
                    </Box>
                    </React.Fragment>
                })
            }
        </Box>
            setKanji(kj)
        }
        return fp
    }

    const fetchRandom = async() => {
        setFpart('')
        setKanji('')
        let res = undefined
        setStartLoading(true)
        setUserSubmitted(false)
        setUserAnswer('')

        const options = {
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({"texts": input})
        }
        res  = await fetch(`http://localhost:4000/api/custominput`, options)
        if (res){
            const d = await res.json()
            console.log('d: ', d)
            if (d || !d['error']){
                const flag = await formatData(d)
                // console.log("flag: ", flag)
                if (!flag){
                    alert('There was a problem on fetching data')
                }
            } else {
                alert(
                    `Error retrieving data, The data could be empty or invalid, 
                    please try again. If generating on custom or quiz, please try different inputs to solve the problem.`
                )
            }
        } else {
            alert(
                `Invalid link or sentence generation`
            )
        }
        setStartLoading(false)
        setTabIndex(1)
    }


    return <Tabs onChange={e=> setTabIndex(e)} defaultIndex={0} index={tabIndex}>
        <TabList>
            <Tab>Your input</Tab>
            <Tab>Structured Outcome</Tab>
        </TabList>
        <TabPanels className='py-2'>
            <TabPanel>        
                <Textarea
                    value={input}
                    onChange={e => setinput(e.target.value)}
                    className='py-1 px-2 mb-5 jent'
                    fontSize={'4xl'}
                    fontWeight={'300'}
                    letterSpacing={'2px'}
                    resize={'vertical'}
                    border={'2px solid black'}
                    size={'xl'}
                />
                <HStack width={'100%'} justifyContent={'center'}>
                    <Button onClick={toggleColorMode} className='m-1'>
                        {colorMode === 'light' ? 'Dark' : 'Light'} mode
                    </Button>
                    <Button colorScheme='blue' onClick={fetchRandom} isLoading={startLoading}>
                        Structurize
                    </Button>
                    <JPMenu />
                </HStack>
            </TabPanel>
            <TabPanel>
                <Box>
                    {(!fpart && !startLoading) ? <Heading>Add an input</Heading> : startLoading ? <Spinner/> : fpart}
                </Box>
                {(!startLoading) ? <DrawerKanji kanji_data = {kanji}/> : null}
            </TabPanel>
        </TabPanels>
    </Tabs>;
}

export default CustomInput;