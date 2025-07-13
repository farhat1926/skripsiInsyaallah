// src/lib/socket.js
import { io } from "socket.io-client";

const userId = socket.handshake.auth.userId;

export const connectSocket = (userId) => {
  return io("https://skripsiinsyaallah-production.up.railway.app", {
    auth: { userId },
    withCredentials: true,
  });
};

