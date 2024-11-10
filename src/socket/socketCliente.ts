// src/socket/socketCliente.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getSocket = () => {
  if (!socket) {
    socket = io("https://servidor-ecoadm-2dfe114c75e8.herokuapp.com/"); // Substitua pela URL do seu servidor
  }
  return socket;
};

export default getSocket;
