import dotenv from dotenv;
dotenv.config();

export const production = {
  mongodb_prod_connection_url: process.env.PROD_DATABASE_URL,
  port: +process.env.PORT
}