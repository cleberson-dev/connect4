import express from "express";
import cors from "cors";
import { createRoom, getRoomsList } from "@/server/data-source";
import * as schemas from "@/server/http/schemas";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.HTTP_PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.send("Hello, World!");
});

// Get Rooms
app.get("/rooms", async (_, res) => {
  const rooms = await getRoomsList();
  return res.status(200).json(rooms);
});

// Create Room
app.post("/rooms", async (req, res) => {
  const { name, password } = req.body;

  const { error } = schemas.createRoomSchema.validate({ name, password });
  if (error) {
    return res.sendStatus(400).json({ message: error });
  }

  const room = await createRoom(name, password);
  return res.status(201).json({ id: room.id });
});

app.listen(PORT, () => {
  console.log(`HTTP: Running on port ${PORT}`);
});
