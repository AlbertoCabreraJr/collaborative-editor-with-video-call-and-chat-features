import { useEffect, useContext } from "react";
import { Context } from "../../../../context/Context";

import "./message.scss";

const Message = ({ message: { text, user } }) => {
  const {
    user: { name: currentUser },
    setUser,
  } = useContext(Context);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, []);

  let isSentByCurrentUser = false;
  // const trimmedCurrentUser = currentUser.name.trim().split(" ")[0];

  if (user === currentUser) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{currentUser}</p>
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{text}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundDark">
        <p className="messageText colorLight">{text}</p>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

export default Message;
