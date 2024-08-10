import React, { useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Button from "@mui/material/Button";
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App() {
    const [structSentence, setStructSentence] = useState()
    const [index, setIndex] = useState(0);

    
    return <Button variant='contained'>Hello</Button>
}