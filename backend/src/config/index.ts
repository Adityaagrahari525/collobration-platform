import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (process.env.NODE_ENV === "production") {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes("default")) {
    throw new Error("FATAL CONFIG ERROR: JWT_SECRET environment variable must be set in production.");
  }
  if (!process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_TOKEN_SECRET.includes("default")) {
    throw new Error("FATAL CONFIG ERROR: REFRESH_TOKEN_SECRET environment variable must be set in production.");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("FATAL CONFIG ERROR: DATABASE_URL environment variable must be set.");
  }
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "campuslink_dev_jwt_secret_key_2025",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "campuslink_dev_refresh_secret_key_2025",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  accessTokenExpiresIn: "15m",
  refreshTokenExpiresDays: 7,
};
