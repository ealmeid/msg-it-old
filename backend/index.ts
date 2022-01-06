const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: any) => {
  socket.join("testRoom");

  socket.to("testRoom").emit(`joined`, socket.id);

  socket.on("message", (data: any) => {
    io.in("testRoom").emit("message", data);
  });

  // socket.on("set-username", (name: any) => {
  //   socket.username = name;
  // });

  // console.log(io.of("/").adapter.rooms.get("testRoom").size);
});

httpServer.listen(5000);
