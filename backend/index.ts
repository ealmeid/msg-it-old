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
  socket.on("send_message", (data: any) => {
    const { roomName, message } = data;
    io.in(roomName).emit("receive_message", {
      socketId: socket.id,
      data: message,
    });
  });

  socket.on("set_name", (name: string) => {
    socket.data["username"] = name;
  });

  socket.on("create_room", (name: string) => {
    socket.join(name);
  });
  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);
    io.in(roomId).emit("joined_room");
  });

  socket.on("leave_room", (roomId: string) => {
    socket.leave(roomId);
    io.in(roomId).emit("leave_room");
  });
});

app.get(`/users/:roomId`, async (req: any, res: any) => {
  let params = req.params;
  let roomId = params.roomId;
  let socketSet = io.of("/").adapter.rooms.get(roomId);
  let socketIds = Array.from(socketSet.values());
  let sockets = await io.fetchSockets();

  let socketIdsAndUsernames = socketIds.map((id) => {
    let socket = sockets.find((x) => x.id === id);
    let res = { socketId: id, username: socket.data.username };
    return res;
  });
  // console.log(sockets);
  // console.log(io.of("/").adapter.rooms);
  // console.log(users.values());
  res.send(socketIdsAndUsernames);
});

httpServer.listen(5000);
