import React, { useRef, useEffect } from "react";

const VideoPlayer = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video width="50%" height="50%" playsInline autoPlay ref={ref} />;
};

export default VideoPlayer;
