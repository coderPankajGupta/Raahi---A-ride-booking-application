import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import userModel from "./models/user.model.js";

const port = process.env.PORT || 5000;
const mongoDbUrl = process.env.MONGO_URI;

async function connectDb() {
  try {
    await mongoose.connect(mongoDbUrl);
    console.log("DB connected");
  } catch (error) {
    console.log("DB Error : " + error);
  }
}

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_URL,
  },
});

io.on("connection", (socket) => {
  socket.on("identity", async (userId) => {
    socket.userId = userId;
    await userModel.findByIdAndUpdate(userId, {
      socketId: socket.id,
      isOnline: true,
    });
  });

  socket.on("update-location", async ({ userId, latitude, longitude }) => {
    await userModel.findByIdAndUpdate(userId, {
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });
  });

  socket.on("disconnect", async () => {
    if (!socket.userId) return;
    await userModel.findByIdAndUpdate(socket.userId, {
      socketId: null,
      isOnline: false,
    });
  });
});

server.listen(port, () => {
  console.log("Server started");
  connectDb();
});
