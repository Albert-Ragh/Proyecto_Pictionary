// import "../normalize.css";
import { useState, useEffect } from "react";
import pincell from "../img/brush.cur";

function ConnectedUsersInGame({ socket, pintor }) {
  const colors = [
    "#c75e22",
    "#22a0c7",
    "#27a064",
    "#26630a",
    "#a6b423",
    "#b42347",
    "#b8187b",
    "#b617ae",
    "#9900ff",
    "#604a9b",
    "#133594",
    "#136094",
    "#138b94",
    "#139462",
    "#589413",
    "#915005",
    "#910505",
    "#dd3400",
  ];

  const [userList, setUserList] = useState([]);
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    if (firstTime) {
      socket.emit("lobby_data");
      setFirstTime(false);
    }
    socket.on("lobby_user_list", (data) => {
      setUserList(data);
      data.list.sort((a, b) => b.points - a.points);
    });
  }, []);

  return (
    <div className="connectedUsersInGame">
      <div className="connectedUsersInGame__title">
        <h1 className='game__connectedUsersInGameTitle'><span className='connectedUsersInGame__span'>U</span><span className='connectedUsersInGame__span'>S</span><span className='connectedUsersInGame__span'>E</span><span className='connectedUsersInGame__span'>R</span>  <span className='connectedUsersInGame__span'>L</span><span className='connectedUsersInGame__span'>I</span><span className='connectedUsersInGame__span'>S</span><span className='connectedUsersInGame__span'>T</span></h1>
      </div>
      <div className="game__connectedUsersInGame" id="style-8" >
        <ul id="userList" className="connectedUsersInGame__userList userList">
          {Array.isArray(userList.list)
            ? userList.list.map((user, index) => {
              return (
                <li
                  style={{ color: colors[index] }}
                  id="bgColor"
                  className={`game_item ${user.lastAnswerCorrect
                      ? "userListInGame__item--correct"
                      : "userListInGame__item "
                    }`}
                  key={index}
                >
                  <div className="GameItem__name">
                  <img src={user.avatar} width="60px"></img>
                    <p>
                      {user.painting ? (
                        <>
                          {user.name}{" "}
                          <img
                            className="game__painter"
                            alt="(Painter)"
                            src={pincell}
                          ></img>{" "}
                        </>
                      ) : (
                        <>
                       
                          {user.name}{" "}
                          {pintor && user.lastAnswer != ""
                            ? `: ${user.lastAnswer}`
                            : ""}
                        </>
                      )}
                    </p>
                    <p>{user.points}</p>
                  </div>
                </li>
              );
            })
            : null}
        </ul>
      </div>
    </div>

  );
}

export default ConnectedUsersInGame;
