// import "../normalize.css";
import { useState, useEffect } from "react";
import '../styles/ConnectedUsers.css'

function ConnectedUsersOwner({ socket }) {
    const [userList, setUserList] = useState([]);
    const [firstTime, setFirstTime] = useState(true);
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


    useEffect(() => {
        if (firstTime) {
            socket.emit("lobby_data_pls");
            setFirstTime(false)
        }
        socket.on("lobby_user_list", (data) => {
            setUserList(data.list);
        });
    }, [firstTime, socket])


    return (
        <div className="connectedUsersInGameO">
            <div className="game__connectedUsersInGameOwner" id="style-Owner">
                <div className="connectedUsersInGame__title">
                    <h1 className='game__connectedUsersInGameTitle'><span className='connectedUsersInGame__span'>U</span><span className='connectedUsersInGame__span'>S</span><span className='connectedUsersInGame__span'>E</span><span className='connectedUsersInGame__span'>R</span>  <span className='connectedUsersInGame__span'>L</span><span className='connectedUsersInGame__span'>I</span><span className='connectedUsersInGame__span'>S</span><span className='connectedUsersInGame__span'>T</span></h1>
                </div>
                <ul id="userList" className="connectedUsersInGame__userList userList">
                    {userList.map((user, index) => {
                        return (
                            <li style={{ color: colors[index] }}
                                id="bgColor" className="game_item item">
                                <div className="GameItem__name">
                                    <div className="player__data">
                                        <img src={user.avatar} width="50px" />
                                        <p className="user__name">{user.name}</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div >
        </div >
    );
}

export default ConnectedUsersOwner;
