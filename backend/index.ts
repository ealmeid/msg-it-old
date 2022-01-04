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
  console.log("server side - connected");

  socket.on("message", (data: any) => {
    socket.send(data);
  });
});

httpServer.listen(5000);
