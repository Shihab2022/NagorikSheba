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
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  //   jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  invite_secret: process.env.INVITE_SECRET,
  invite_expire_in: process.env.INVITE_EXPIRES_IN,
  forget_pass_expire_in: process.env.FORGET_PASS_ACCESS_EXPIRES_IN,
  demo_admin_email: process.env.DEMO_ADMIN_EMAIL,
  demo_admin_password: process.env.DEMO_ADMIN_PASSWORD,
  demo_admin_name: process.env.DEMO_ADMIN_NAME,
<<<<<<< HEAD
  google_api_key: process.env.GOOGLE_API_KEY,
  groq_api_key: process.env.GROQ_API_KEY,
  groq_model: process.env.GROQ_MODEL,
  rag_min_similarity: process.env.RAG_MIN_SIMILARITY,
  tavily_api_key: process.env.TAVILY_API_KEY ,
=======
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
>>>>>>> DEV
};
