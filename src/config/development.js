import * as dotenv from 'dotenv';
dotenv.config();

export const development = {
  mongodb_connection_url: process.env.DEV_DATABASE_URL,
  port: +process.env.DEV_PORT
}