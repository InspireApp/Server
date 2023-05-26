import * as dotenv from 'dotenv';
dotenv.config();

export const production = {
  mongodb_connection_url: process.env.PROD_DATABASE_URL,
  port: +process.env.PROD_PORT,
  bcrypt_password_salt_round: process.env.PROD_PASSWORD_BCRYPT_SALT_ROUND,
  bcrypt_OTP_salt_round: process.env.PROD_OTP_BCRYPT_SALT_ROUND,
  jwt_web_token: process.env.PROD_JWT_SECRET,
  mail_trap_username: process.env.PROD_MAIL_TRAP_USERNAME,
  mail_trap_password: process.env.PROD_MAIL_TRAP_PASSWORD,
  bcrypt_forgot_password_salt_round: process.env.PROD_FORGOT_PASSWORD_SALT_ROUND,
  google_strategy_client_id: process.env.PROD_GOOGLE_STRATEGY_CLIENT_ID,
  google_strategy_client_secret: process.env.PROD_GOOGLE_STRATEGY_CLIENT_SECRET,
  cookie_session_key: process.env.PROD_COOKIE_SESSION_KEY
}