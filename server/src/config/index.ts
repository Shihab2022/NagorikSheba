import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  front_end_base_url: process.env.FRONT_END_BASE_URL,
  back_end_base_url: process.env.BACK_END_BASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT,
  // default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_refresh_expirres_in: process.env.JWT_REFRESH_EXPIRES_IN!,

  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN!,
  invite_secret: process.env.INVITE_SECRET,
  invite_expire_in: process.env.INVITE_EXPIRES_IN,
  forget_pass_expire_in: process.env.FORGET_PASS_ACCESS_EXPIRES_IN,
};
