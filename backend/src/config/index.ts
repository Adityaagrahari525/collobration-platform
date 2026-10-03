import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const isProd = process.env.NODE_ENV === "production";

if (isProd && (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET)) {
  throw new Error("FATAL: JWT_SECRET and REFRESH_TOKEN_SECRET must be set in production environment!");
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "campuslink_jwt_access_secret_key_2026_super_secure_key",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "campuslink_jwt_refresh_secret_key_2026_super_secure_key",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  accessTokenExpiresIn: "15m",
  refreshTokenExpiresDays: 7,
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
};
