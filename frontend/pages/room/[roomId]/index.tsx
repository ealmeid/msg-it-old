import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Room = () => {
  const router = useRouter();
  const roomCode = router.query.roomId;
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    let newSocket = io("ws://localhost:5000?room=test");

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("connected");
    });

    newSocket.on("joined", (arg) => {
      console.log("someone joined", arg);
    });
  }, []);

  if (socket != null) {
    socket.on("message", (data: any) => {
      // console.log(data, messages, newSocket.id);
      let newMessages = [...messages];
      newMessages.push(data);
      setMessages(newMessages);
    });
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="mb-4">
        Your socket id is: {isConnected ? socket.id : "Loading..."}
      </div>
      <div className=" bg-gray-400 rounded-md p-12 flex flex-col">
        {/* <div></div> */}
        {/* <div className="text-black">
          {isConnected ? "Connected!" : "Connecting..."}
        </div> */}
        <div>
          <div className="text-black-400">
            {messages.map((message) => {
              return (
                <div
                  className="mb-4 bg-button-bg text-white pl-2 py-1 rounded-full"
                  key={message}
                >
                  {message}
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
              socket.send(message);
              setMessage("");
            }}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
