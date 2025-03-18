import "../App.css";
import "../styles/Game.css"
import { useState, useEffect } from "react";
import React from 'react';

function WordGuess({ socket }) {
    const [wordToCheck, setWordToCheck] = useState("");

    useEffect(() => {
        socket.emit('get_game_data');
        
        socket.once('game_data', (data) => {
            if (data.words != undefined) {
                setWordToCheck(data.words[0].name);
            }
        });
        
        socket.on('current_word', (data) => {
            if (data != undefined) {
                setWordToCheck(data.word.name);
            }
        });

        return () => {
            socket.off('current_word');
        };
    }, []);


    return (
        <>
            <p className="WordGuess">{wordToCheck}</p>
        </>
    )

}

export default WordGuess;
