import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import Peer from "simple-peer";
import VideoPlayer from "./VideoPlayer/VideoPlayer";

import { Context } from "../../../context/Context";

import "./videoContainer.scss";

const VideoContainer = ({ roomID }) => {
  const { peers, setPeers, socket, userVideo, peersRef } = useContext(Context);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [isAllowCamera, setIsAllowCamera] = useState(true);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        socket.emit("join-video", roomID);

        socket.on("all-users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socket.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push({ peer, peerID: userID });
          });
          setPeers(peers);
        });

        socket.on("user-joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, { peer, peerID: payload.callerID }]);
        });

        socket.on("receiving-returned-signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socket.on("room-full", () => {
          alert("Room is full");
          setIsRoomFull(true);
        });

        // socket.on("exit", () => window.location.reload());
        socket.on("exit", (userID) =>
          setPeers((peers) => {
            const p = peers.filter((peer) => peer.peerID !== userID);
            return p;
          })
        );
      })
      .catch((err) => setIsAllowCamera(false));
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("sending-signal", { userToSignal, callerID, signal });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("returning-signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function containerClass(peersLength) {
    switch (peersLength) {
      case 0:
        return "video-container-0";
      case 1:
        return "video-container-1";
      case 2:
        return "video-container-2";
    }
  }

  if (isRoomFull) {
    return <Redirect to="/" />;
  } else {
    return (
      <div className={containerClass(peers.length)}>
        {isAllowCamera ? (
          <video muted ref={userVideo} autoPlay playsInline />
        ) : (
          <p className="note">Allow use of Camera and Mic</p>
        )}

        {peers.map((peer, index) => (
          <VideoPlayer key={index} peer={peer} />
        ))}
      </div>
    );
  }
};

export default VideoContainer;
