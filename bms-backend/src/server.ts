import app from "./app";
import { config } from "./config/config";
import dbConnect from "./config/db";

const startServer = async () => {
  const PORT = config.port;

  await dbConnect();

  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
};

startServer();
