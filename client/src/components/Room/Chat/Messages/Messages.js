import Message from "../Message/Message";

import "./messages.scss";

const Messages = ({ messages }) => {
  return (
    <>
      {messages
        .filter((message) => message.text.length != 0)
        .map((message, index) => (
          <div key={index}>
            <Message message={message} />
          </div>
        ))}
    </>
  );
};

export default Messages;
