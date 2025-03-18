// import "../normalize.css";
import "../styles/ConnectedUsers.css"
import { useState, useEffect } from "react";

function ConnectedUsers({ socket }) {
    const [userList, setUserList] = useState([]);
    const [firstTime, setFirstTime] = useState(true);

    function changeColor(e) {
        let colors = ["#129228", "#581292", "#b3a402", "#b34302", "#b30202", "#026fb3", "#b30255", "#40b302", "#b37b02", "#45037e", "#f30202", "#3db72f", "#f80088", "#5ba3a8", "#6b1846", "#efa105", "#107a49", "#7b7b32", "#643c87", "#324f7b", "#52403d", "#7d9415", "#045b04", "#088076", "#2c0880", "#ae53ca", "#ca5369", "#f25e01", "#b73838", "#009376"];
        let color = colors[Math.floor(Math.random() * 31)];
        e.target.style.color = color;
    }


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
        <div className="lobby__connectedUsers">
            <h2 className="connectedUsers_title">Connected users</h2>
            <ul id="userList" className="connectedUsers__userList userList">

                {userList.map((user, index) => {
                    return (
                        <li onMouseOver={changeColor} className="userList__item item" key={index}>
                            <img src={user.avatar} width="120px" ></img>
                            <div className="item__name">
                                <h3 id="list">{user.name}</h3>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div >

    );
}

export default ConnectedUsers;
