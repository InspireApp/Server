import * as dotenv from 'dotenv';
dotenv.config();

export const development = {
  mongodb_connection_url: process.env.DEV_DATABASE_URL,
  port: +process.env.DEV_PORT,
  bcrypt_password_salt_round: process.env.DEV_PASSWORD_BCRYPT_SALT_ROUND,
  bcrypt_OTP_salt_round: process.env.DEV_OTP_BCRYPT_SALT_ROUND,
  jwt_web_token: process.env.DEV_JWT_SECRET,
  mail_trap_username: process.env.DEV_MAIL_TRAP_USERNAME,
  mail_trap_password: process.env.DEV_MAIL_TRAP_PASSWORD,
  bcrypt_forgot_password_salt_round: process.env.DEV_FORGOT_PASSWORD_SALT_ROUND,
  google_strategy_client_id: process.env.DEV_GOOGLE_STRATEGY_CLIENT_ID,
  google_strategy_client_secret: process.env.DEV_GOOGLE_STRATEGY_CLIENT_SECRET,
  cookie_session_key: process.env.DEV_COOKIE_SESSION_KEY,
  cloudinary_name: process.env.DEV_CLOUDINARY_NAME,
  cloudinary_key: process.env.DEV_CLOUDINARY_KEY,
  cloudinary_secret: process.env.DEV_CLOUDINARY_SECRET
}