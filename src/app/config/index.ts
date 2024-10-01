import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_password: process.env.DEFAULT_PASS,
  salt_Rounds: process.env.SALT_ROUNDS,
  jwt_access_secret_key: process.env.JWT_ACCESS_SECRET_KEY,
  jwt_refresh_secret_key: process.env.JWT_REFRESH_SECRET_KEY,
  jwt_reset_secret_key: process.env.JWT_RESET_SECRET_KEY,
  jwt_access_exp_time: process.env.JWT_ACCESS_EXP_TIME,
  jwt_refresh_exp_time: process.env.JWT_REFRESH_EXP_TIME,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
  reset_pass_url: process.env.RESET_PASS_URL,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
