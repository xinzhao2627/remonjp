# Remon - Morphological Analyzer / Sentence Generator 

Remon is a full-stack Japanese morphological analyzer designed to provide a collection of contextual Japanese sentences. 

In summary, it utilizes the following: 
- kuromoji a natural language processing library
- database integration with built-in api
- web scraping for data processing and analyzing JLPT levels.

## Project Overview

- **Backend**: Node.js, Express, PostgreSQL (hosted on Neon)
- **Frontend**: React.js
- **Data Processing**: Python, Selenium, Pandas
- **Deployment**: Vercel (API and frontend)

### Features

- Tokenizes and analyzes Japanese sentences, identifying kanji and converting to Hiragana, Katakana, and Romaji.
- Retrieves kanji meanings, JLPT levels (N5 to N1), and parts of speech (noun, verb, adjective, etc.).
- Generates quizzes based on JLPT level for language practice.
- Hosts a large dataset with over 1.6 million rows, including kanji levels, dictionaries, and example sentences.

### Usage

## remon-API
