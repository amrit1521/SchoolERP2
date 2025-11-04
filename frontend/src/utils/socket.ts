import { io, Socket } from "socket.io-client";

const SOCKET_URL =  import.meta.env.VITE_SERVERURL || "http://localhost:3004";

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});
