import { useEffect, useState } from "react";
import ConnectedUsersOwner from "../components/ConnectedUsersOwner";
import Tabs from "../components/Tabs";
import { useNavigate } from "react-router-dom";
import "../styles/LobbyCreation.css";

function LobbyCreation({ socket }) {
  const [categoriesDataLoaded, setCategoriesDataLoaded] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [lobbyId, setLobbyId] = useState("");
  const [firstTime, setFirstTime] = useState(true);
  const [starting, setStarting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLeave(e) {
    e.preventDefault();
    socket.emit("leave_lobby", {
      delete: true,
    });
    navigate("/");
  }

  function copyId() {
    navigator.clipboard.writeText(lobbyId);
  }

  function handleStartGame(e) {
    e.preventDefault();
    setStarting(true);
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

  useEffect(() => {
    if (firstTime) {
      socket.emit("new_lobby");
      setFirstTime(false);
    }

    socket.on("lobby_info", (data) => {
      setLobbyId(data.lobbyIdentifier);
      socket.emit("get_lobby_settings");
    });

    socket.on("starting_errors", (data) => {
      if (data.valid) {
        if (!sent) {
          socket.emit("start_game");
        }
        setSent(true);
      } else {
        setStarting(false);
      }
    });

    socket.on("categories", (data) => {
      setCategoriesData(data)
      setCategoriesDataLoaded(true);
      if (firstTime) {
        socket.emit("new_lobby");
        setFirstTime(false);
      }
    });

    socket.on("game_started", () => {
      setError("");
      navigate("/game");
    });

    socket.on("NOT_ENOUGH_PLAYERS", () => {
      setError("Not enough players to start game");
      setStarting(false);
    });

    socket.on("YOU_LEFT_LOBBY", () => {
      navigate("/");
    });
  }, [navigate, socket, firstTime]);

  return (
    <>
      {categoriesDataLoaded ? (
        <div className="createGame">
          <button className="createGame__leaveButton" onClick={handleLeave}>
            Leave and delete lobby{" "}
          </button>
          <div className="container">
            <div>
              <ConnectedUsersOwner socket={socket}></ConnectedUsersOwner>
            </div>
            <div className="i7">
              <div className="Identi">
                {lobbyId && (
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
                )}
              </div>

              <div className="Setting">
                <section id="main">
                  <div>
                    <Tabs socket={socket} start={starting} categoriesData={categoriesData}></Tabs>
                  </div>  
                </section>
                <div className="createGame__startButtonDiv">
                  <button
                    className="createGame__startButton"
                    onClick={handleStartGame}
                  >
                    Start game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "5rem",
          }}
        >
          Creating lobby...
        </div>
      )}
      {error != "" && <h1>{error}</h1>}
    </>
  );
}

export default LobbyCreation;
