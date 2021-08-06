import GridLoader from "react-spinners/GridLoader";

const Loading = ({ text }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        background: "#02203c",
      }}
    >
      <GridLoader speedMultiplier={2} color="#f6f9fc" />
    </div>
  );
};

export default Loading;
