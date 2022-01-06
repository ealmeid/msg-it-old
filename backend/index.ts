import { createServer } from "http";
import { Server } from "socket.io";
const express = require("express");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: any) => {
  socket.on("message", (data: any) => {
    io.in("testRoom").emit("message", data);
  });

  socket.on("set_name", (name: string) => {
    socket.username = name;
  });

  socket.on("join_room", (roomId: string) => {
    io.in(roomId).emit("joined_room");
    socket.join(roomId);
  });
});

app.get(`/users/:roomId`, (req: any, res: any) => {
  let params = req.params;
  let roomId = params.roomId;
  let users = io.of("/").adapter.rooms.get(roomId);
  // console.log(io.of("/").adapter.rooms);
  // console.log(users.values());
  res.send(Array.from(users.values()));
});

httpServer.listen(5000);
