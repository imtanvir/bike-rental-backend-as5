import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  db_user: process.env.DB_USER,
  db_pass: process.env.DB_PASS,
  db_url: process.env.DB_URL,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  dcrypt_salt_round: process.env.DCRYPT_SALT_ROUND,
  jwt_secret: process.env.JWT_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
};
