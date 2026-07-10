import { config as envConfig } from "dotenv";
envConfig();

const _config = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.MONGODB_URI as string,
};

export const config = Object.freeze(_config);
