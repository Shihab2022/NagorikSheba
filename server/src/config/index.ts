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
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  overpass:{
    overpass_api_url:process.env.OVERPASS_API_URL,
    overpass_user_agent:process.env.OVERPASS_USER_AGENT,
    overpass_timeout_ms:process.env.OVERPASS_TIMEOUT_MS,
  },
  valhalla: {
    base_url: process.env.VALHALLA_BASE_URL || "https://valhalla1.openstreetmap.de",
    client_id: process.env.VALHALLA_CLIENT_ID || "NagorikSheba",
    request_timeout_ms: process.env.VALHALLA_REQUEST_TIMEOUT_MS || "10000",
    cache_ttl_ms: process.env.VALHALLA_CACHE_TTL_MS || "300000",
    min_request_interval_ms: process.env.VALHALLA_MIN_REQUEST_INTERVAL_MS || "1000",
  },
};
