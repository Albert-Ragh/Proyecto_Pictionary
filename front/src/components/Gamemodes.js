import { useState, useEffect } from "react";
import "../styles/LobbyCreation.css";

function Gamemodes({ socket, start }) {
  const [gamemode, setGamemode] = useState("normal");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setGamemode(e.target.value);
  };

  useEffect(() => {
    if (start) {
      setError("");
      socket.emit("save_gamemode", {
        gamemode: gamemode,
      });
    }
  }, [start]);

  return (
    <div>
      {error !== "" && <h1 className="error">{error}</h1>}
      <form className="form__setting">
        <div className="form__setting__radio">
          <div className="radio">
            <input type="radio" name="radio" id="radio1" value="normal" className="check" onChange={handleChange} />
            <label htmlFor="radio1">Normal mode</label>
          </div>
          <br />
          <div className="radio">
            <input type="radio"
              value="fast" name="radio" id="radio2" onChange={handleChange} />
            <label htmlFor="radio2">Fast mode</label>
          </div>
        </div>
        <br />
        {/* <label>{"Cooperative mode"} <input type="radio" value="coop" onChange={handleChange} checked={gamemode == "coop"} /></label><br /> */}
      </form>
    </div>
  );
}

export default Gamemodes;
