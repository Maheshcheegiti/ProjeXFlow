// socketManager.js
import io from "socket.io-client";

let socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
      transports: ["websocket"],
    });
  }
  return socket;
};
