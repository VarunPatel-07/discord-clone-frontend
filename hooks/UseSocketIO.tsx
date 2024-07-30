import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
// Adjust the import path accordingly

const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string; // Replace with your actual host URL

const UseSocketIO = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = getCookie("User_Authentication_Token") as string;
    const socketIo = io(Host, {
      auth: {
        token,
      },
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
};

export default UseSocketIO;
