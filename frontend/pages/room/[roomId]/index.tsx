import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "../../../contexts/SocketContext";
import axios from "axios";

interface User {
  socketId: string;
  username: string;
}

interface Message {
  data: string;
  socketId: string;
}

const Room = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [usersConnected, setUsersConnected] = useState<User[]>([]);
  const socketContext = useContext(SocketContext);

  const getConnectedUsers = async () => {
    await axios
      .get(`http://localhost:5000/users/${roomId}`)
      .then((res: any) => {
        setUsersConnected(res.data);
      });
  };

  useEffect(() => {
    getConnectedUsers();
  }, [roomId]);

  useEffect(() => {
    if (socketContext.socket != null) {
      console.log("joining room", roomId);
      socketContext.joinRoom(roomId);
    }
  }, [socketContext]);

  if (socketContext.socket != null) {
    socketContext.socket.on("message", (data: any) => {
      console.log(data);
      let newMessages = [...messages];
      newMessages.push(data);
      setMessages(newMessages);
      console.log(newMessages);
    });

    socketContext.socket.on("connect", () => {
      setIsConnected(true);
    });

    socketContext.socket.on("joined_room", (arg: any) => {
      getConnectedUsers();
    });
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="mb-4">
          Socket context id is{" "}
          {socketContext ? socketContext?.socket?.id : "Loading..."}
        </div>
        <div className=" bg-gray-400 rounded-md p-12 flex flex-col">
          <div>
            <div className="text-black-400">
              {messages.map((message) => {
                return (
                  <div>
                    <div className="flex justify-between">
                      <div className="text-gray-500">
                        {usersConnected
                          ? usersConnected?.find(
                              (x) => x.socketId === message.socketId
                            )?.username
                          : "N/A"}
                      </div>
                      <div className="text-gray-500">Thurs 23 2021</div>
                    </div>

                    <div
                      className="mb-4 bg-button-bg text-white pl-2 py-1 rounded-full"
                      key={message.data}
                    >
                      {message.data}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              className="w-full h-8 rounded-full pl-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={() => {
                socketContext.socket.send(message);
                setMessage("");
              }}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="underline">Users Connected</div>
        <div>
          {usersConnected.map((user) => {
            return <div>{user.username}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
