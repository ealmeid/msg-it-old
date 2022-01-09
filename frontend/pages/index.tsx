import { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { io } from "socket.io-client";
// import Image from "next/image";
// import styles from "../styles/Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPlus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { SocketContext, ISocketContext } from "../contexts/SocketContext";
import Header from "../components/Header";

const Home: NextPage = () => {
  const [choice, setChoice] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const socketContext = useContext(SocketContext) as ISocketContext;
  const router = useRouter();

  useEffect(() => {
    let randomNum = Math.floor(Math.random() * 9999);
    setUsername(`Guest#${randomNum}`);
  }, []);

  useEffect(() => {
    let newSocket = io("ws://localhost:5000");

    if (socketContext?.socket == null) {
      socketContext.setSocket(newSocket);
      newSocket.on("connect", () => {
        setIsConnected(true);
      });
    }
  }, [socketContext]);

  return (
    <div className="bg-red dark:bg-primary-dark min-h-screen flex flex-col justify-center align-middle">
      <Header />
      <div className="flex flex-col flex-1 h-full justify-center gap-8 items-center">
        <div>
          <img src="/assets/connected.svg" className="w-32 mx-auto" />
        </div>
        <div className="font-semibold text-6xl text-center">msg-it</div>
        <div className="text-gray-400 text-lg text-center">
          Join. Chat. Leave.
        </div>
        {isConnected ? (
          <div className="flex flex-col justify-center items-center gap-4 w-4/5 md:w-1/2 lg:w-1/4">
            {/* Socket Context id is{" "}
          {socketContext?.socket?.id ? socketContext?.socket.id : "Loading..."} */}
            {/* <div className="mb-4 font-semibold">What should we call you?</div> */}
            <div className="flex gap-2">
              <input
                className="text-center border-b-2 border-button-bg mb-4 w-32 py-2"
                placeholder="Guest #2000"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex h-12 justify-between w-full">
              <button
                className="bg-button-bg text-white text-lg p-2 px-4 rounded-full opacity-50 cursor-not-allowed"
                onClick={(e) => {
                  // setChoice("Join");
                }}
              >
                &nbsp;&nbsp;Join a Room&nbsp;&nbsp;
              </button>
              <div className="h-full border-l-2 border-gray-200"></div>
              <button
                className="bg-button-bg text-white text-lg p-2 px-4 rounded-full"
                onClick={(e) => {
                  setChoice("Create");
                }}
              >
                Create a Room
              </button>
              {/* <input
              className="p-2 text-center border-2 rounded-full border-button-bg"
              placeholder="Search for a room..."
            /> */}
            </div>
            {choice === "Join" && (
              <div className="mt-6 flex items-center gap-4">
                <input
                  className="p-2 text-center border-2 rounded-full border-button-bg"
                  placeholder="Search for a room..."
                />
                <button className="bg-green-300 rounded-full p-2">
                  <FontAwesomeIcon icon={faArrowRight} className="w-4" />
                </button>
              </div>
            )}
            {choice === "Create" && (
              <div className="mt-6 flex items-center gap-4 w-full">
                <input
                  className="p-2 text-center border-2 rounded-full border-button-bg flex-1"
                  placeholder="Name of your room"
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <button
                  className="bg-green-300 rounded-full p-2 hover:opacity-50 cursor-pointer"
                  onClick={() => {
                    socketContext.socket.emit("set_name", username);
                    socketContext.socket.emit("create_room", roomName);
                    router.push(`/room/${roomName}`);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} className="w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin w-8 self-center fill-blue-400"
            color="#6277f2"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
