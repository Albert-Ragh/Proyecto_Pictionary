import logo from "../logo.svg";
import "../App.css";
import "../styles/Game.css";
import { useState, useEffect } from "react";
import Board from "../components/Board";
import WordForm from "../components/WordForm";
import React from "react";
import ConnectedUsersInGame from "../components/ConnectedUsersInGame";
import WordGuess from "../components/WordGuess";
import Description from "../components/Description";
import WordLength from "../components/WordLength";
import CountDownTimer from "../components/CountdownTimer";
import { useNavigate } from "react-router-dom";

function Game({ socket }) {
  const navigateToEndGame = useNavigate();
  const [starting, setStarting] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [result, setResult] = useState(null);
  const [pintor, setPintor] = useState(false);
  const [messageWin, setMessageWin] = useState(false);
  const [spectator, setSpectator] = useState(false);
  const [showDrawer, setShowDrawer] = useState(true);
  const [nextDrawerName, setNextDrawerName] = useState();
  const [drawerName, setDrawerName] = useState();
  const [roundEnded, setRoundEnded] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [wordToCheck, setWordToCheck] = useState("");
  const [gamemode, setGamemode] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);

  const messageResponses = {
    wordAttemptError: "You failed the attempt!",
    wordAttemptSuccess: "Well done! You're the best!",
  };

  useEffect(() => {
    socket.on("answer_result", (data) => {
      setResult(data.resultsMatch);
      setMessageWin(true);
      const intervalId = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(intervalId);
        setCountdown(3);
        setMessageWin(false);
      }, 3000);
    });

    socket.on("pintor", (data) => {
      setPintor(data.pintor);
      setResult(null);
    });

    socket.on("drawer_name", (data) => {
      setDrawerName(data.name);
      setNextDrawerName(data.next);
    });

    socket.on("round_ended", (data) => {
      setRoundEnded(true);
      setGamemode(data.gamemode);
      if (data.motivo == "time") {
        setTimeUp(true);
      } else {
        setTimeUp(false);
      }

      const intervalId = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(intervalId);
        setRoundEnded(false);
        setWordIndex((wordIndex) => wordIndex + 1);
        setCountdown(3);
        socket.emit("round_end");
      }, 3000);
    });

    socket.on("spectator", (data) => {
      setSpectator(data.spectator);
    });

    socket.on("game_data", (data) => {
      setWords(data.words);
      setWordToCheck(data.words[wordIndex].name);
    });

    socket.on("started", () => {
      setStarting(false);
      const intervalId = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(intervalId);
        setStarting(false);
        setShowDrawer(false);
        setCountdown(3);
        socket.emit("countdown_ended");
      }, 3000);
    });

    socket.on("game_ended", () => {
      setGameEnded(false);
      setRoundEnded(true);
      const intervalId = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(intervalId);
        navigateToEndGame("/endGame");
        setCountdown(3);
        setGameEnded(true);
        setRoundEnded(false);
        socket.emit("countdown_ended");
      }, 3000);
    });

    return () => {
      socket.off("answer_result");
      socket.off("pintor");
      socket.off("drawer_name");
      socket.off("started");
      socket.off("game_data");
      socket.off("spectator");
      socket.off("game_ended");
      socket.off("round_ended");
    };
  }, []);

  useEffect(() => {
    if (words != undefined && words.length > 0) {
      setWordToCheck(words[wordIndex].name);
    }
  }, [wordIndex, words]);

  return (
    <>
      {starting && <div className="Game__modal__loading">Loading</div>}
      {!starting && (
        <>
          {roundEnded && !result && !pintor && !gameEnded && (
            <div className="Game__modal">
              <p>
                Last word was: {wordToCheck}
                <br></br>
                <br></br>
                {nextDrawerName != null && (
                  <>Next round drawer: {nextDrawerName}</>
                )}
              </p>
            </div>
          )}

          {roundEnded && !result && pintor && !timeUp && !gameEnded && (
            <div className="Game__modal">
              <p>
                {gamemode == "fast" ? (
                  <p>Congratulations! Your drawing was wonderful!</p>
                ) : (
                  <p>Congratulations! Everyone got the word!</p>
                )}
              </p>
            </div>
          )}

          {roundEnded && !result && pintor && timeUp && !gameEnded && (
            <div className="Game__modal">
              <p>Sorry! Time's Up!</p>
            </div>
          )}

          {roundEnded && result && !gameEnded && (
            <div className="Game__modal">
              <p>You did it!</p> <br />
              {nextDrawerName != null && (
                <p>Next round drawer: {nextDrawerName}</p>
              )}
            </div>
          )}

          {showDrawer && (
            <div className="Game__modal">
              <p>
                {countdown}
                <br></br>
                <br></br>
                Drawer: {drawerName}
              </p>
            </div>
          )}

          {!showDrawer && (
            <div className="game">
              <div className="game__left">
                <ConnectedUsersInGame socket={socket} pintor={pintor} />
              </div>
              <div className="game__right">
                {spectator ? (
                  <div className="Spectator">
                    <CountDownTimer socket={socket} />
                    <h1 className="Game__title">
                      <WordLength socket={socket}></WordLength>
                    </h1>
                    <Board socket={socket} pintor={pintor} />
                  </div>
                ) : (
                  <>
                    {pintor ? (
                      <div>
                        <WordGuess className="game__word" socket={socket} />
                        <Description
                          className="game__description"
                          socket={socket}
                        />
                        <Board socket={socket} pintor={pintor} />
                      </div>
                    ) : (
                      <>
                        <CountDownTimer socket={socket} />
                        <h1 className="Game__title">
                          <WordLength socket={socket}></WordLength>
                        </h1>
                        <Board socket={socket} pintor={pintor} />
                        <WordForm socket={socket} answerCorrect={result} />
                        <br />
                        {result != null && messageWin && (
                          <>
                            {result && !roundEnded && (
                              <div className="Game__modal">
                                <p>{messageResponses.wordAttemptSuccess}</p>
                              </div>
                            )}
                            {!result && (
                              <p>{messageResponses.wordAttemptError}</p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Game;
