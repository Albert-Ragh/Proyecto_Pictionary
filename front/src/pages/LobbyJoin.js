import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LobbyCreation.css";
import ConnectedUsers from "../components/ConnectedUsers";


function LobbyJoin({ socket }) {
  const [lobbyId, setLobbyId] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [insideLobby, setInsideLobby] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  //const [registeredUsername, setRegisteredUsername] = useState(false);
  const navigate = useNavigate();

  function handleChangeLobbyId(e) {
    setLobbyId(e.target.value);
  }

  function handleChangeUsername(e) {
    setUsername(e.target.value);
  }

  // function handleEnableUsername(e) {
  //   setRegisteredUsername(false);
  // }

  function handleSubmit(e) {
    e.preventDefault();
    if (lobbyId !== "" && username !== "") {
      socket.emit("join_room", {
        lobbyIdentifier: lobbyId,
        username: username,
      });
    } else {
      setError("You need to fill both input fields.");
    }
  }

  function handleLeave(e) {
    e.preventDefault();
    //
    socket.emit("leave_lobby", {
      lobbyIdentifier: lobbyId,
    });
  }

  function changeColor() {
    document
      .getElementById("copyId")
      .addEventListener("mouseover", function () {
        let colors = [
          "#70a1da",
          "#70da92",
          "#cada70",
          "#858cb7",
          "#f6a39e",
          "#ab605c",
          "#70ab5c",
          "#ed96f1",
          "#e05b8c",
          "#e0ce5b",
          "#997490",
          "#9dff4e",
          "#ffd64e",
          "#e24eff",
          "#4ebeff",
          "#b2b5dc",
          "#20bf55",
          "#bf97ff",
          "#ff9797",
          "#97e5ff",
        ];
        let color = colors[Math.floor(Math.random() * 21)];
        document.getElementById("copyId").style.color = color;
      });

    document.getElementById("copyId").addEventListener("mouseout", function () {
      document.getElementById("copyId").style.color = "#5c5b5b";
    });
  }

  function copyId() {
    navigator.clipboard.writeText(lobbyId);
  }

  function setAvatar() {
    let avatar = Math.floor(Math.random() * 25);

    const avatarurl = `https://api.dicebear.com/6.x/bottts/svg?seed=${avatar}`;
    socket.emit('set_avatar', { avatar: avatarurl });
  }

  useEffect(() => {
    if (firstTime) {
      socket.emit("get_username");
      setFirstTime(false);
    }

    socket.on("username_saved", (data) => {
      setUsername(data.name);
      //setRegisteredUsername(true);
    });

    socket.on("lobby_info", (data) => {
      setInsideLobby(true);
      setLobbyId(data.lobbyIdentifier);
      setError("");
      setAvatar();
      let avatar = Math.floor(Math.random() * 25);

      const avatarurl = `https://api.dicebear.com/6.x/bottts/svg?seed=${avatar}`;
      socket.emit('set_avatar', { avatar: avatarurl });
    });

    socket.on("lobby_deleted", (data) => {
      socket.emit("leave_lobby", {
        lobbyIdentifier: lobbyId,
        wasDeleted: true,
      });

      setInsideLobby(false);
      setError(data.message);
      setLobbyId("");
    });

    socket.on("game_started", () => {
      navigate("/game");
    });

    socket.on("YOU_LEFT_LOBBY", () => {
      setInsideLobby(false);
    });

    socket.on("USER_ALR_CHOSEN_ERROR", () => {
      setError("The chosen username is already on use");
    });

    socket.on("USR_NAME_TOO_LONG", () => {
      setError("The chosen username is too long");
    });

    return () => {
      socket.off("username_saved");
      socket.off("lobby_info");
      socket.off("lobby_deleted");
      socket.off("YOU_LEFT_LOBBY");
      socket.off("USER_ALR_CHOSEN_ERROR");
    };
  }, [navigate, socket]);

  if (!insideLobby) {
    return (
      <div>
        <Link to="/">
          <button className="createGame__leaveButton">Go back</button>
        </Link>
        <div className="JoinLobby">
          {error !== "" && <h1 className="error">{error}</h1>}
          <form className="JoinLobby__form--grid" onSubmit={handleSubmit}>
            <label className="JoinLobby__nickname--grid">
              <div className="form__inputGroup">
                <input
                  id="nickname"
                  value={username}
                  className="form__input"
                  onChange={handleChangeUsername}
                  placeholder=" "
                  type="text"
                  required
                ></input>
                <span className="form__inputBar"></span>
                <label className="form__inputlabel">
                  Introduce your nickname
                </label>
              </div>
            </label>
            <label className="JoinLobby__id--grid">
              <div className="form__inputGroup">
                <input
                  className="form__input"
                  value={lobbyId}
                  onChange={handleChangeLobbyId}
                  placeholder=" "
                  type="text"
                  required
                ></input>
                <span className="form__inputBar"></span>
                <label className="form__inputlabel">Introduce lobby ID</label>
              </div>
            </label>
            <div className="JoinLobby__button--grid">
              <button className="JoinLobby__button" type="submit">
                Join lobby
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <button className="createGame__leaveButton" onClick={handleLeave}>
          Leave lobby
        </button>
        {error !== "" && <h1 className="error">{error}</h1>}
        <h1 className="identifier">
          <span className="span">I</span>
          <span className="span">D</span>
          <span className="span">E</span>
          <span className="span">N</span>
          <span className="span">T</span>
          <span className="span">I</span>
          <span className="span">F</span>
          <span className="span">I</span>
          <span className="span">E</span>
          <span className="span">R</span>:{" "}
          <span
            className="span"
            id="copyId"
            onClick={copyId}
            onMouseOver={changeColor}
          >
            <p>CLICK TO COPY THE ID</p>
            {lobbyId}
          </span>
        </h1>
        <ConnectedUsers socket={socket}></ConnectedUsers>
        <button className="createGame__leaveButton" onClick={setAvatar}>Change avatar</button>
      </div>
    );
  }
}

export default LobbyJoin;
