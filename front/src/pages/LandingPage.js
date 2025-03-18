import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';
import "../styles/normalize.css";
import "../styles/LandingPage.css";
import { useEffect, useState } from "react";
import routes from "../index";


function LandingPage({ socket }) {
  const [isLogged, setisLogged] = useState(false);
  const [menuBarClass, setMenuBarClass] = useState(false);
  const [menuBgClass, setMenuBgClass] = useState(false);
  const [navClass, setNavClass] = useState(false);
  const [displayMenu, setdisplayMenu] = useState(false);



  const cookies = new Cookies();


  function changeColor() {
    document.getElementById("brush").addEventListener("mouseover", function () {
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
      document.getElementById("brush").style.color = color;
      document.getElementById("brush").style.transform =
        "translate(0px, -10px)";
    });
    document.getElementById("brush").addEventListener("mouseout", function () {
      document.getElementById("brush").style.color = "#5c5b5b";
    });
  }

  function enviarGetCategories() {
    socket.emit("get_categories");
  }
  function Logout() {
    const user = new FormData()
    user.append("token", cookies.get('token') != undefined ? cookies.get('token') : null);

    fetch(routes.fetchLaravel + "logout", {
      method: "POST",
      mode: "cors",
      body: user,
      credentials: "include",
    })
      .then((response) => response.json())
      .then(() => {
        setisLogged(false);
      });

      cookies.remove('token');  
    }

  function menuOnClick() {
    setMenuBarClass(!menuBarClass);
    setMenuBgClass(!menuBgClass);
    setNavClass(!navClass);
  }

  async function DoFetch() {
    const user = new FormData()
    user.append("token", cookies.get('token') != undefined ? cookies.get('token') : null);

    const response = await fetch(routes.fetchLaravel + "isUserLogged", {
      method: "POST",
      mode: "cors",
      body: user,
      credentials: "include",
    });

    const data = await response.json();
    setdisplayMenu(true);
    if (data) {
        setisLogged(true);
    }
    else {
      setisLogged(false);
    }
  }

  useEffect(() => {
    DoFetch();
  }, [])

  return (

    <div className="ldPage">
      {displayMenu ? 
      <>
         {isLogged ?
          <div>
            <div id="menu">
              <div id="menu-bar" className={`menu-bar${menuBarClass ? " change" : ""}`} onClick={menuOnClick}>
                <div id="bar1" className="bar"></div>
                <div id="bar2" className="bar"></div>
                <div id="bar3" className="bar"></div>
              </div>
              <nav className={`nav${navClass ? " change" : ""}`} id="nav">
                <ol>
                  <li><Link to="/categories">Categories</Link></li>
                  <li onClick={Logout}><Link to="/">Logout</Link></li>
                </ol>
              </nav>
            </div>
  
            <div className={`menu-bg${menuBgClass ? " change-bg" : ""}`} id="menu-bg"></div>
          </div>
          :
          <div>
            <Link to="/login">
              <div className="ldPage__loginRegister">
                <>Log in/Register</>
              </div>
            </Link>
          </div>
          }
          
        </>
        : 
        <>
        </>
    } 
      <div className="border is-drawn" id="border">
        <div className="space-around">
          <h1 className="ldPage__title">
            <span className="span">P</span>
            <span className="span">I</span>
            <span className="span">C</span>
            <span className="span">T</span>
            <span className="span">I</span>
            <span className="span">O</span>
            <span className="span">N</span>
            <span className="span">A</span>
            <span className="span">R</span>
            <span className="span">Y</span>{" "}
          </h1>
          <div className="ldPage__buttonsContainer">
            <Link to="/createlobby" tabIndex="-1" onClick={enviarGetCategories}>
              <button className="ldPage__button1">Create game</button>
            </Link>
            <br />
            <Link to="/joinlobby" tabIndex="-1">
              <button className="ldPage__button2">Join game</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
