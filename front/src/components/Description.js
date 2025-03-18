import "../App.css";
import { useState, useEffect } from "react";
import React from "react";

function Description({ socket }) {
  const [description, setDescription] = useState("");

  useEffect(() => {

    socket.once('game_data', (data) => {
      if (data.words !== undefined) {
        setDescription(data.words[0].description);
      }
    });

    socket.on("current_word", (data) => {
      if (data.word.description != null) {
        setDescription(data.word.description);
      }
    });

    return () => {
      socket.off("word_to_check");
    };
  }, [socket]);

  return (
    <div className="Description">
      <p className="Description__text">{description}</p>  
    </div>
  );
}

export default Description;
