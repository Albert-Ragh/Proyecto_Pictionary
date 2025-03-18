import { NavLink } from 'react-router-dom';
import Ranking from '../components/Ranking';
import { useState, useEffect } from "react";
import "../styles/Ranking.css";
import { useNavigate } from "react-router-dom";




function EndGame({ socket }) {
  const [owner, setOwner] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const navigate = useNavigate();

  function onClick() {
    socket.emit("use_same_seed");
    socket.emit("get_categories");
    navigate("/createlobby");
  }
  useEffect(() => {

    if (firstTime) {
      socket.emit("get_owner");
      setFirstTime(false);
    }
    socket.on('is_owner', (data) => {
      setOwner(true);
    });
    socket.on('GO_BACK_TO_LOBBY', () => {
      if (!owner) {
        navigate("/joinlobby");
      }
    });

    return () => {
      socket.off('is_owner');
      socket.off('GO_BACK_TO_LOBBY');
    };

  }, []);
  return (
    <div>
      <div>
        {owner && (
          <button onClick={onClick}>Go to lobby</button>
        )}
        <NavLink to='/'><button>Go to main page</button></NavLink>
      </div>

      <Ranking socket={socket}></Ranking>
    </div>

  );
}

export default EndGame;
