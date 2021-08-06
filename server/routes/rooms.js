import mongoose from "mongoose";
import express from "express";
import { RoomModel, MessageModel } from "../models/Room.js";

const router = express.Router();

router.get("/:roomID", async (req, res) => {
  try {
    const { roomID } = req.params;

    const room = await RoomModel.findOne({ roomID }).lean();

    if (room) {
      return res.status(200).json(room.messages);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  const { roomID, user, text } = req.body;
  const message = new MessageModel({
    roomID,
    user,
    text,
  });

  try {
    const room = await RoomModel.findOne({ roomID });

    if (room) {
      room.messages.push(message);
      room.users = room.users.filter((u) => u !== user);
      room.users.push(user);
      await room.save();

      return res.status(200).json({ data: "Success" });
    } else {
      const result = await RoomModel.create({
        roomID,
        users: [user],
        messages: [message],
      });
      return res.status(200).json({ data: "Success" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
