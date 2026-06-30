import { io } from "socket.io-client";

export const socket = io("https://codemate-backend-rhj8.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});