const Input = ({ message, setMessage, sendMessageHandler }) => {
  return (
    <>
      <input
        type="text"
        className="input-message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyPress={(e) => (e.key === "Enter" ? sendMessageHandler(e) : null)}
      />
    </>
  );
};

export default Input;
