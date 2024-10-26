// src/socket/socketCliente.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getSocket = () => {
  if (!socket) {
    socket = io("https://servidor-ecoclean-c518707fbb1d.herokuapp.com/"); // Substitua pela URL do seu servidor
  }
  return socket;
};

export default getSocket;
