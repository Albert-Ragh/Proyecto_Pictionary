import { useState, useEffect } from "react";
import "../styles/LobbyCreation.css";
import Gamemodes from "./Gamemodes";

function Settings({ socket, start }) {
  const [roundDuration, setRoundDuration] = useState(0);
  const [ownerPlay, setOwnerPlay] = useState(false);
  const [nickname, setNickname] = useState("");
  const [turns, setTurns] = useState(0);
  const [error, setError] = useState("");
  const [firstTime, setFirstTime] = useState(true);

  function handleChangeOwnerPlay() {
    setOwnerPlay(!ownerPlay);
  }

  function handleChangeNickname(e) {
    setNickname(e.target.value);
  }

  function handleChangeRoundDuration(e) {
    setRoundDuration(e.target.value);
  }

  function handleChangeTurns(e) {
    setTurns(e.target.value);
  }

  useEffect(() => {
    if (firstTime) {
      socket.emit("get_username");
      setFirstTime(false);
    }

    socket.on("lobby_settings", (data) => {
      setRoundDuration(data.roundDuration);
      setTurns(data.amountOfTurns);
    });

    socket.on("username_saved", (data) => {
      setNickname(data.name);
    });

    socket.on("ROUND_TIME_UNDER_MIN", (data) => {
      setError(`Selected round duration was too low -> Minimum: ${data.min}`);
    });

    socket.on("ROUND_TIME_ABOVE_MAX", (data) => {
      setError(`Selected round duration was too high -> Maximum: ${data.max}`);
    });

    socket.on("TURNS_AMT_UNDER_MIN", (data) => {
      setError(`Selected amount of turns was too low -> Minimum: ${data.min}`);
    });

    socket.on("TURNS_AMT_ABOVE_MAX", (data) => {
      setError(`Selected amount of turns was too high -> Maximum: ${data.max}`);
    });

    socket.on("INVALID_SETTINGS", () => {
      setError(`Can't start the game with invalid settings`);
    });

    socket.on("USER_ALR_CHOSEN_ERROR", () => {
      setError("The chosen username is already on use");
    });

    socket.on("NO_USR_DEFINED", () => {
      setError("You need to choose a nickname in order to play!");
    });
  }, []);

  useEffect(() => {
    if (start) {
      setError("");
      socket.emit("save_settings", {
        roundDuration: roundDuration,
        amountOfTurns: turns,
        ownerPlay: ownerPlay,
        nickname: nickname,
      });
    }
  }, [start]);

  return (
    <div className="setting-container">
      <div className="gamemodes">
        <h2>Game Modes</h2>
        <Gamemodes socket={socket} start={start} />
      </div>
      <div className="settings__zone">
        <h2>SETTINGS </h2>
        {error != "" && <h1 className="error">{error}</h1>}
        <form className="App" autoComplete="off">
          <span className="addCategory__formSpanTA">
            <p className="settings__zone__title">Round duration (seconds)</p>
            <input type="number" value={roundDuration} onChange={handleChangeRoundDuration} />
          </span>
          <span className="addCategory__formSpanTA">
            <p className="settings__zone__title">Amount of turns per player:</p>
            <input type="number" value={turns} onChange={handleChangeTurns} />
          </span>

          <div className="list__container__text settingCreator__checkbox">
            <input
              id='hola'
              className="check"
              type="checkbox"
              value={ownerPlay}
              onChange={handleChangeOwnerPlay}
            />
            <label
              htmlFor='hola'
              className="list__container__text__label settingCreator__label"
            >
              <svg width="300" height="50" viewBox="0 0 500 100">
                <rect
                  x="0"
                  y="15"
                  width="50"
                  height="50"
                  stroke="black"
                  fill="none"
                  className="list__container__checkbox"
                />
                <g transform="translate(-10,-962.36218)">
                  <path
                    d="m 13,983 c 33,6 40,26 55,48 "
                    stroke="black"
                    stroke-width="3"
                    className="path1"
                    fill="none"
                  />
                  <path
                    d="M 75,970 C 51,981 34,1014 25,1031 "
                    stroke="black"
                    stroke-width="3"
                    className="path1"
                    fill="none"
                  />
                </g>
              </svg>
              <span
                htmlFor='hola'
                className="settings__zone__title"
              >Will the lobby creator play?</span>
            </label>
          </div>
          <br />
          {ownerPlay ? (
            <span className="addCategory__formSpanTA">
              <p className="settings__zone__title">Enter your nickname:</p>
              <input type="text" value={nickname} onChange={handleChangeNickname} />
            </span>
          ) : (
            <></>
          )}
        </form>

      </div>
    </div>
  );
}

export default Settings;
