import Input from "./Input/Input";
import Messages from "./Messages/Messages";

import ScrollToBottom from "react-scroll-to-bottom";
import { useContext, useState, useEffect } from "react";
import { Context } from "../../../context/Context";

import "./chat.scss";

const Chat = ({ roomID, currentUser }) => {
  const { socket, getRoomMessages, sendMessage } = useContext(Context);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async (roomID) => {
      try {
        const ms = await getRoomMessages(roomID);
        if (ms.length) setMessages([...ms]);
        socket.emit("join-chat", { roomID, user: currentUser, text: "" });
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages(roomID);
  }, []);

  useEffect(() => {
    socket.on("send message", (message, emitter) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const sendMessageHandler = (e) => {
    e.preventDefault();

    if (message) {
      socket.emit("chat message", {
        roomID,
        user: currentUser.name,
        text: message,
      });

      sendMessage(roomID, currentUser, message);
    }

    setMessage("");
  };

  return (
    <div className="chat-container">
      <ScrollToBottom className="messages-container">
        <Messages messages={messages} />
      </ScrollToBottom>
      <div className="input-container">
        <Input
          message={message}
          setMessage={setMessage}
          sendMessageHandler={sendMessageHandler}
        />
      </div>
    </div>
  );
};

export default Chat;
