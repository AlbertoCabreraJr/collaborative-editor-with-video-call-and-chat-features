import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import CodeDocument from "./models/CodeDocument.js";
import roomsRoutes from "./routes/rooms.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
  },
});

const users = {};
const socketToRoom = {};
let currentUser;

io.on("connection", (socket) => {
  socket.on("join-video", (roomID) => {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 3) {
        socket.emit("room-full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }

    // FOR VIDEOCALL
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
    socket.emit("all-users", usersInThisRoom);

    // EVENTS For VIDEOCALL
    socket.on("sending-signal", (payload) => {
      io.to(payload.userToSignal).emit("user-joined", {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    });

    socket.on("returning-signal", (payload) => {
      io.to(payload.callerID).emit("receiving-returned-signal", {
        signal: payload.signal,
        id: socket.id,
      });
    });
  });

  // For EDITOR
  socket.on("join-editor", async (roomID) => {
    socket.join(roomID);

    const codeDocument = await findOrCreateCodeDocument(roomID);
    socket.emit("load-code-document", codeDocument.data);
    socket.broadcast.to(roomID).emit("user-connected", roomID);

    socket.on("send-changes-code", (code) => {
      socket.broadcast.to(roomID).emit("receive-changes-code", code);
    });

    socket.on("save-code-document", async (data) => {
      await CodeDocument.findByIdAndUpdate(roomID, { data });
    });
  });

  socket.on("join-chat", ({ roomID, user }) => {
    socket.join(roomID);
    currentUser = user.name;

    socket.emit("send message", {
      roomID,
      user: "admin",
      text: `Hello ${user.name}!`,
    });

    socket.broadcast.to(roomID).emit("send message", {
      roomID,
      user: "admin",
      text: `${user.name} has joined the room!`,
    });
  });
  socket.on("chat message", (message) => {
    io.to(message.roomID).emit("send message", message, "io");
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
      io.emit("exit", socket.id);
      socket.broadcast.to(roomID).emit("user-disconnected", roomID);
      socket.broadcast.to(roomID).emit("send message", {
        roomID,
        user: "admin",
        text: `${currentUser} has left the room!`,
      });
    }
  });
});

async function findOrCreateCodeDocument(id) {
  if (id == null) return;

  const document = await CodeDocument.findById(id);
  if (document) return document;
  return await CodeDocument.create({ _id: id, data: "" });
}

app.use(express.json({ limit: "100mb", extended: true }));
app.use(express.urlencoded({ limit: "100mb", extend: true }));
app.use(cors());

app.use("/api/rooms", roomsRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() =>
    server.listen(PORT, () =>
      console.log(`Server running at PORT: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(error));
