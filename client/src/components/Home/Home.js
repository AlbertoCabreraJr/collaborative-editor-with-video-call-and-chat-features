import { useContext, useEffect } from "react";
import { Context } from "../../context/Context";
import { v4 as uuidV4 } from "uuid";
import { Link } from "react-router-dom";

import logo from "../../static/logo.png";
import vid1 from "../../static/vid1.mp4";
import vid2 from "../../static/vid2.mp4";

import "./home.scss";

const Home = () => {
  const { user, setUser, logout } = useContext(Context);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, []);

  return (
    <div className="home-container">
      <div className="home-nav">
        <img className="home-logo" src={logo} alt="CodeCollab Logo" />
        <img className="user-profile" src={user.img} alt="" />
        <p className="user-name">{user.name}</p>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="home-heading">Share code in real-time</div>
      <div className="home-sub-heading">
        A real-time collaborative editor with built-in chat and videocall
      </div>
      <div className="collab-btn">
        <Link to={`/room/${uuidV4()}`}>
          <button>Collab Now</button>
        </Link>
      </div>
      <div className="home-video-container">
        <div style={{ width: "720px" }}>
          <video src={vid1} autoPlay muted loop playsInline />
        </div>
        <div style={{ width: "720px" }}>
          <video src={vid2} autoPlay muted loop playsInline />
        </div>
      </div>
      <div className="home-p">
        Best for coding interviews, teaching, demos, and more
      </div>
    </div>
  );
};

export default Home;
