import * as dotenv from 'dotenv';
dotenv.config();

export const production = {
  mongodb_connection_url: process.env.PROD_DATABASE_URL,
  port: +process.env.PROD_PORT,
  bcrypt_salt_round: process.env.PROD_BCRYPT_SALT_ROUND,
  jwt_web_token: process.env.PROD_JWT_SECRET
}