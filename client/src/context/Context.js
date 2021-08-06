import { useState, createContext, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

export const Context = createContext();

const URL = "http://localhost:5000";
const socket = io(URL);

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  // FOR EDITOR
  const [code, setCode] = useState("");
  const DEFAULT_LANGUAGE = "Python";
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const DEFAULT_THEME = "material";
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const languages = ["Python", "Javascript", "C", "C++", "C#", "Java"];
  const themes = [
    "3024-day",
    "3024-night",
    "abbott",
    "abcdef",
    "ambiance-mobile",
    "ambiance",
    "ayu-dark",
    "ayu-mirage",
    "base16-dark",
    "base16-light",
    "bespin",
    "blackboard",
    "cobalt",
    "colorforth",
    "darcula",
    "dracula",
    "duotone-dark",
    "duotone-light",
    "eclipse",
    "elegant",
    "erlang-dark",
    "gruvbox-dark",
    "hopscotch",
    "icecoder",
    "idea",
    "isotope",
    "juejin",
    "lesser-dark",
    "liquibyte",
    "lucario",
    "material-darker",
    "material-ocean",
    "material-palenight",
    "material",
    "mbo",
    "mdn-like",
    "midnight",
    "monokai",
    "moxer",
    "neat",
    "neo",
    "night",
    "nord",
    "oceanic-next",
    "panda-syntax",
    "paraiso-dark",
    "paraiso-light",
    "pastel-on-dark",
    "railscasts",
    "rubyblue",
    "seti",
    "shadowfox",
    "solarized",
    "ssms",
    "the-matrix",
    "tomorrow-night-bright",
    "tomorrow-night-eighties",
    "ttcn",
    "twilight",
    "vibrant-ink",
    "xq-dark",
    "xq-light",
    "yeti",
    "yonce",
    "zenburn",
  ];

  // FOR VIDEOCALL
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);

  // FOR SIGNIN
  const login = (response, type) => {
    if (type === "google") {
      if (response.accessToken) {
        const {
          profileObj: { name, imageUrl },
        } = response;

        setUser({ name, img: imageUrl });
        localStorage.setItem(
          "profile",
          JSON.stringify({ name, img: imageUrl })
        );
      }
    } else if (type === "facebook") {
      if (response.accessToken) {
        const {
          name,
          picture: {
            data: { url },
          },
        } = response;

        setUser({ name, img: url });
        localStorage.setItem("profile", JSON.stringify({ name, img: url }));
      }
    } else {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // FOR CHAT
  const createRoom = async (roomID, user, text) => {
    try {
      const { data } = await axios.post(`${URL}/api/rooms`, {
        roomID,
        user: user.name,
        text,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getRoomMessages = async (roomID) => {
    try {
      const { data: messages } = await axios.get(`${URL}/api/rooms/${roomID}`);
      return messages;
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (roomID, user, text) => {
    try {
      await axios.post(`${URL}/api/rooms`, { roomID, user: user.name, text });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        URL,
        socket,

        // For EDITOR
        code,
        setCode,
        language,
        setLanguage,
        languages,
        themes,
        theme,
        setTheme,

        // For VIDEOCALL
        peers,
        setPeers,
        userVideo,
        peersRef,

        // For CHAT
        createRoom,
        getRoomMessages,
        sendMessage,

        // For SIGNIN
        login,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
};
