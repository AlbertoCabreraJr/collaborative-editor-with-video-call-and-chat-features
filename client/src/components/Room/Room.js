import Editor from "./Editor/Editor";
import VideoContainer from "./VideoContainer/VideoContainer";
import Chat from "./Chat/Chat";
import Select from "./Select/Select";
import { useParams, Redirect } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";

import "./room.scss";
import Loading from "../Loading/Loading";

const Room = () => {
  const {
    user,
    setUser,
    logout,
    languages,
    themes,
    setLanguage,
    setTheme,
    createRoom,
  } = useContext(Context);
  const { roomID } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));

    const setRoom = async (roomID, user, text) => {
      await createRoom(roomID, user, text);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    setRoom(roomID, user, "");
  }, []);

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

  const handleSelectLanguage = (e) => {
    e.preventDefault();
    setLanguage(e.target.value);
  };

  const handleSelectTheme = (e) => {
    e.preventDefault();
    setTheme(e.target.value);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    if (!uuidPattern.test(roomID)) {
      return <Redirect to="/room" />;
    }
    return (
      <div className="room-container">
        <div className="room-nav">
          <img className="user-profile" src={user.img} alt="" />
          <p className="user-name">{user.name}</p>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
          <Select
            onChangeHandler={handleSelectLanguage}
            options={languages}
            selectName="Language"
            cssClass="language-choices"
            defaultVal="Python"
          />
          <Select
            onChangeHandler={handleSelectTheme}
            options={themes}
            selectName="Theme"
            cssClass="theme-choices"
            defaultVal="material"
          />
        </div>
        <div className="room-contents">
          <div className="room-editor-container">
            <Editor roomID={roomID} />
          </div>
          <div className="room-call-message-container">
            <div className="room-call">
              <VideoContainer roomID={roomID} />
            </div>
            <div className="room-message">
              <Chat roomID={roomID} currentUser={user} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <Redirect to="/" />;
};

export default Room;
