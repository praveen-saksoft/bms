import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { config } from "../config/config";
import { registerSocketHandlers } from "./socketHandlers";

const createSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.frontEndUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("[Socket] User connected:", socket.id);
    registerSocketHandlers(socket, io);

    socket.on("disconnect", (reason) => {
      console.log("[Socket] User disconnected:", socket.id, "Reason:", reason);
    });
  });
};

export default createSocketServer;
