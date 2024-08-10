import React, { useState} from 'react'
// import bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'

function App() {
  const [structuredSentences, setStructuredSentences] = useState([])
  const [structuredKanji, setStructuredKanji] = useState([])
  const [sentenceRaw, setSentenceRaw] = useState('')
  const formatData = async (d) => {
    for (const sentence of d){
      const formatted_sentence = (
        <ul key={sentence.jp_id} className='sentence'>
          {sentence.structure.map((struct, i) => {
            const word = struct.word;
            const hasParts = word !== struct.reading_katakana && word !== struct.reading_hiragana;
            return (
              <React.Fragment key={word + i}>
                {hasParts 
                  ? <li className="segment mb-2" key={`li-${word}-${i}`}>
                    <span className="segment-container" key={`span-container-${word}-${i}`}>
                      <span className="readings" key={`readings-${word}-${i}`}>{struct.reading_hiragana}</span>
                      <span
                        className="word"
                        style={{
                          borderBottom:'1px solid blue',
                          cursor:'pointer',
                        }}
                        key={`word-${word}-${i}`}
                      >
                        {word}
                      </span>
                    </span>
                  </li>
                  : word
                }

              </React.Fragment>
            )
          })}
        </ul>
      )
      const formatted_kanji = sentence.kanji.map((k, i) => {
        const element = k.k_element
        const jlpt = k.new_jlpt
        const meanings_string = k.meanings 
        return <React.Fragment key={'fragment ' + i}>
          <li key={`li-${k}`} className='p-1'>
            <div key = {`div-${k}`} className='section p-2  '>
              <span key={`sp-ele-${k}`} className='text'>{element}</span>
              <span key={`sp-jlpt-${k}`} className={`jlpt-${jlpt || 'unkown'} jlpt px-2`}>{(jlpt) ? `N${jlpt}` : 'unknown'}</span>
              <section className='row container'>
                {meanings_string.split(/,(?![^()]*\))/).map((m,j) => {
                  return <span key={`sp-m-${j}`} className='col-auto mm mt-2'>{m.trim()}</span>
                })}
              </section>
            </div>
          </li>
        </React.Fragment>
      })
      setStructuredKanji(formatted_kanji)
      setStructuredSentences(formatted_sentence)
      setSentenceRaw(sentence.en_sentence)
    }
  }
  const fetchRandom = async(n) => {
    const res  = await fetch(`http://localhost:4000/api/random${n}`)
    const d = await res.json()
    await formatData(d)

  }
  const [toCloseSide, setToCloseSide] = useState(false)
  const showSide = () => {
    setToCloseSide(false)
  }
  const closeSide = () => {
    setToCloseSide(true)
  }
  const sidebar = <>
    <nav className={`sidebar ${toCloseSide && 'close'}`}>
    <header>
      <div className="image-text">
        <div className="text">
          <span className="name">Kanji</span>
          <span className="profession">Structure</span>
        </div>
      </div>
      <i className='bx bx-chevron-right toggle'></i>
    </header>
    {(!toCloseSide)
      ? <div className="menu-bar">
          <div className="menu">
            <ul style={{color:'black'}} className='p-2 ' key={'parent-ul'}>
              {structuredKanji}
            </ul>
          </div>
          <div className="bottom-content">
            <li className="">
              <a href="#">
                <i className='bx bx-log-out icon'></i>
                <span className="text nav-text">Logout</span>
              </a>
            </li>
            <li className="mode">
              <div className="sun-moon">
                <i className='bx bx-moon icon moon'></i>
                <i className='bx bx-sun icon sun'></i>
              </div>
              <span className="mode-text text">Dark mode</span>
              <div className="toggle-switch">
                <span className="switch"></span>
              </div>
            </li>
          </div>
        </div>
        : null
    }

  </nav>
  </>


  return (
    <div className="App">
      
      <div className='box'>
      
        <div className='main-content'>
          {"Sentence: " + sentenceRaw}
          <div className='mt-4'>
            {(typeof structuredSentences === "undefined") 
              ? <p>loading...</p> 
              : structuredSentences
            }
          </div>
          <button onClick={fetchRandom} className='initB'>generate</button>
          <button onClick={showSide} className='initB'>show side</button>
          <button onClick= {closeSide} className='initB'>hide side</button>

        </div>
        {sidebar}
      </div>
    </div>
  );
}

export default App
