import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

interface ISocketContext {
  socket: any;
  setSocket: (socket: any) => void;
  joinRoom: (roomId: string) => void;
  setUsername: (username: string) => void;
}

const SocketContext = createContext<ISocketContext>(undefined);

const SocketProvider = (props: any) => {
  const [socket, setSocket] = useState<any>(null);

  const joinRoom = (roomId: string) => {
    socket.emit("join_room", roomId);
  };

  const setUsername = (name: string) => {
    socket.emit("set_name", name);
    setSocket(socket);
    console.log(socket);
  };

  const value: any = {
    socket,
    setSocket,
    setUsername,
    joinRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {props.children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
