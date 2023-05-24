import * as dotenv from "dotenv";
dotenv.config();

export const production = {
  port: +process.env.PROD_PORT,
};
