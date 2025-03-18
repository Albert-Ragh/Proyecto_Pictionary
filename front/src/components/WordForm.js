import React, { useState } from 'react';
import "../styles/Game.css";

function WordForm({ socket, answerCorrect }) {
  const [word, setWord] = useState('');

  function handleFormSubmit(e) {
    e.preventDefault();
    if (word.trim() !== "") {
      setWord('')
      socket.emit("try_word_attempt", {
        word: word,
      });
    }
  }

  function handleChange(e) {
    setWord(e.target.value);
  }

  if (answerCorrect) {
    return (
      <></>
    )
  } else {
    return (
      <div>
        <form className="WordForm" onSubmit={handleFormSubmit}>
          <input className='WordForm__input' type="text" value={word} onChange={handleChange} placeholder="Enter a word" />
          <button className='WordForm__button' type="submit">Check</button>
        </form>
      </div>
    );
  }

}

export default WordForm;
