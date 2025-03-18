import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom"; //Rutas
import routes from "../index";
import "../styles/Register.css";


function Register({ socket }) {
    const [registro, setRegistro] = useState(0);

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        passwordValidation: "",
    });
    
    const [color, setColor] = useState({
        username: "red",
        email: "red",
        password: "red",
        passwordValidation: "red",
    });

    const cookies = new Cookies();
    const navigate = useNavigate();

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setRegistro(registro + 1);
        }
    };

    useEffect(() => {
        if (userData.username.length >= 3 && userData.username.length <= 20) {
            setColor({ ...color, username: "green" })
        } else {
            setColor({ ...color, username: "red" })
        }
    }, [userData.username]);

    useEffect(() => {
        if (userData.email.length <= 255 && userData.email.includes("@") && userData.email.includes(".")) {
            setColor({ ...color, email: "green" })
        } else {
            setColor({ ...color, email: "red" })
        }
    }, [userData.email]);

    useEffect(() => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&.])[a-zA-Z0-9@$!%*#?&.]{6,255}$/;
        if (regex.test(userData.password)) {
            setColor({ ...color, password: "green" })
        } else {
            setColor({ ...color, password: "red" })
        }
    }, [userData.password]);

    useEffect(() => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&.])[a-zA-Z0-9@$!%*#?&.]{6,255}$/;
        if (userData.passwordValidation === userData.password && regex.test(userData.passwordValidation)) {
            setColor({ ...color, passwordValidation: "green" })
        } else {
            setColor({ ...color, passwordValidation: "red" })
        }
    }, [userData.passwordValidation]);

    useEffect(() => {
        if (registro != 0) {
            const user = new FormData()
            user.append("name", userData.username);
            user.append("email", userData.email);
            user.append("password", userData.password);
            user.append("password_confirmation", userData.passwordValidation);

            fetch(routes.fetchLaravel + "register", {
                method: 'POST',
                mode: 'cors',
                body: user,
                credentials: 'include'
            }).then((response) => response.json()).then((data) => {
                if (data.valid) {
                    cookies.set('token', data.token, { path: '/' })
                    socket.emit("send token", {
                        token: cookies.get('token')
                    });
                    navigate("/")
                }
            }
            );user.append("token", cookies.get('token') != undefined ? cookies.get('token') : null);
        }
    }, [registro]);

    return (
        <div>
                <Link to="/">
                    <button className="createGame__leaveButton">Go back</button>
                </Link>
            <div className="form register">
                <h1>REGISTER</h1>
                <br />
                <div className="form__form">
                    <div className="form__inputGroup">
                        <input className="form__input" style={{ color: color.username }} placeholder=" " type="text" onChange={(e) => setUserData({ ...userData, username: e.target.value })} required></input>
                        <span className="form__inputBar"></span>
                        <label className="form__inputlabel">Username</label>
                    </div>
                    <div className="form__inputGroup">
                        <input className="form__input" style={{ color: color.email }} placeholder=" " type="text" onChange={(e) => setUserData({ ...userData, email: e.target.value })} required></input>
                        <span className="form__inputBar"></span>
                        <label className="form__inputlabel">E-mail</label>
                    </div>
                    <div className="form__inputGroup">
                        <input className="form__input" style={{ color: color.password }} placeholder=" " type="password" name="password" onChange={(e) => setUserData({ ...userData, password: e.target.value })} required></input>
                        <span className="form__inputBar"></span>
                        <label className="form__inputlabel">Password
                        </label>
                    </div>
                    <div className="form__inputGroup">
                        <input className="form__input" style={{ color: color.passwordValidation }} placeholder=" " type="password" onChange={(e) => setUserData({ ...userData, passwordValidation: e.target.value })} onKeyDown={handleKeyDown} required></input>
                        <span className="form__inputBar"></span>
                        <label className="form__inputlabel">Repeat password </label>
                    </div>
                </div>

                <div className="form__buttonsLinks">
                    <div className="form__buttons">
                        <div className="form__submit submit">
                            <button onClick={() => setRegistro(registro + 1)} id="submit__button">
                                <span className="circle2" aria-hidden="true">
                                    <span className="icon2 arrow2"></span>
                                </span>
                                <span className="button-text">SUBMIT</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Register;