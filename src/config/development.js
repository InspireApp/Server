import dotenv from dotenv;
dotenv.config();

export const development = {
  mongodb_dev_connection_url: process.env.DEV_DATABASE_URL,
  port: +process.env.PORT
}