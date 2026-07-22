import http from "node:http";
import app from "./app";
import createSocketServer from "./socket";
import { config } from "./config/config";
import dbConnect from "./config/db";
import "./config/redis";

const startServer = async () => {
  const PORT = config.port;

  await dbConnect();

  const httpServer = http.createServer(app);

  createSocketServer(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
};

startServer();
