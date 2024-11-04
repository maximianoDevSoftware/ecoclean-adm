// src/socket/socketCliente.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getSocket = () => {
  if (!socket) {
    socket = io("https://sercidor-ecoclean-6c6fe114a9e0.herokuapp.com/"); // Substitua pela URL do seu servidor
  }
  return socket;
};

export default getSocket;
