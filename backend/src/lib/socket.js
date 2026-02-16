import { Server } from "socket.io";
import http from "http";
import express from "express";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set("io", io);

// store online users
const userSocketMap = {};
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", async (socket) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  console.log("Cookies received:", cookies);

  if (cookies.jwt) {
    try {
      const decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("_id");
      if (user) {
        userSocketMap[user._id] = socket.id;
        console.log("User connected via cookie:", user._id.toString());
      }
    } catch (err) {
      console.log("JWT verify error:", err.message);
    }
  } else {
    console.warn("No JWT cookie found in handshake");
  }

  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

export { io, app, server };
