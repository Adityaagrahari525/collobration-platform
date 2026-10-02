import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const DEFAULT_JWT_SECRET = "campuslink_jwt_access_secret_key_2026_super_secure_key";
const DEFAULT_REFRESH_SECRET = "campuslink_jwt_refresh_secret_key_2026_super_secure_key";

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || DEFAULT_REFRESH_SECRET,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  accessTokenExpiresIn: "15m",
  refreshTokenExpiresDays: 7,
};
