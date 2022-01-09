import { useRouter } from "next/router";
import { useEffect, useState, useContext, ContextType } from "react";
import { io } from "socket.io-client";
import { ISocketContext, SocketContext } from "../../../contexts/SocketContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

interface User {
  socketId: string;
  username: string;
}

interface Message {
  data: string;
  socketId: string;
}

interface UserConnectedListProps {
  users: User[];
}

interface MessageProps {
  message: any;
  socketContext: ISocketContext;
  usersConnected: User[];
  key: string;
}

const Message: React.FC<MessageProps> = ({
  message,
  socketContext,
  usersConnected,
  key,
}) => {
  return (
    <div
      className={`${
        message.socketId === socketContext.socket.id ? "self-end" : "self-start"
      } w-auto`}
      key={key}
    >
      <div className="flex justify-between gap-2 px-2 items-center mb-1">
        <div className="text-black dark:text-white font-semibold">
          {usersConnected
            ? usersConnected?.find((x) => x.socketId === message.socketId)
                ?.username
            : "N/A"}
        </div>
        <div className="text-gray-500 text-sm">Thurs 23 2021</div>
      </div>

      <div
        className="mb-4 bg-button-bg dark:bg-message-dark-bg text-white px-4 py-1 rounded-full max-w-sm w-48 break-all"
        key={message.data}
      >
        {message.data}
      </div>
    </div>
  );
};

const UsersConnectedList: React.FC<UserConnectedListProps> = ({ users }) => (
  <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-message-dark-bg h-full p-4 rounded-r-md">
    <div className="font-semibold">Users Connected</div>
    <div>
      {users.map((user) => {
        return <div>{user.username}</div>;
      })}
    </div>
  </div>
);

const Room = () => {
  const router = useRouter();
  const roomName = router.query.roomName as string;
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [usersConnected, setUsersConnected] = useState<User[]>([]);
  const socketContext = useContext(SocketContext) as ISocketContext;

  const getConnectedUsers = async () => {
    await axios
      .get(`http://localhost:5000/users/${roomName}`)
      .then((res: any) => {
        setUsersConnected(res.data);
      });
  };

  useEffect(() => {
    getConnectedUsers();
  }, [roomName]);

  useEffect(() => {
    let newMessages = [...messages];

    if (socketContext.socket != null) {
      socketContext.joinRoom(roomName);

      socketContext.socket.on("receive_message", (data: any) => {
        console.log("message received");
        newMessages.push(data);
        setMessages(newMessages);
      });

      socketContext.socket.on("connect", () => {
        setIsConnected(true);
      });

      socketContext.socket.on("joined_room", (arg: any) => {
        getConnectedUsers();
      });

      socketContext.socket.on("leave_room", (arg: any) => {
        console.log("someone left the room");
        getConnectedUsers();
      });

      // socketContext.socket.on("disconnect", (arg: any) => {
      //   router.push("/");
      // });
    }
  }, [socketContext]);

  return (
    <div className="flex items-center justify-center gap-4 min-h-screen max-h-screen bg-button-bg">
      <div className="flex justify-center items-center h-1/2-screen max-w-1/2-screen w-full">
        <div className="flex-1 h-full bg-white dark:bg-primary-dark-bg rounded-l-md flex flex-col border-r-2 dark:border-r-message-dark-bg">
          <div className="flex justify-between p-6 items-center">
            <div className="font-bold text-lg">{roomName}</div>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="cursor-pointer h-6"
              color="#6277f2"
              onClick={() => {
                socketContext.socket.emit("leave_room", roomName);
                router.push("/");
                // socketContext.socket.disconnect();
              }}
            />
          </div>
          <div className="flex flex-col flex-1 px-12 py-6 overflow-y-scroll">
            {messages.map((message) => {
              return (
                <Message
                  message={message}
                  socketContext={socketContext}
                  usersConnected={usersConnected}
                  key={uuidv4()}
                />
              );
            })}
          </div>
          <div className="flex gap-2 items-center pb-6 px-6 pt-4">
            <input
              className="w-full border-none dark:bg-message-dark-bg h-8 rounded-full px-4 py-6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message"
            />
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="cursor-pointer w-8"
              color="#6277f2"
              onClick={() => {
                socketContext.socket.emit("send_message", {
                  message: message,
                  roomName: roomName,
                });
                setMessage("");
              }}
            />
          </div>
        </div>

        <UsersConnectedList users={usersConnected} />
      </div>
    </div>
  );
};

export default Room;
