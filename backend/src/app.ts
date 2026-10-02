import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { config } from "./config";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// CORS origin policy configuration
const allowedOrigins =
  config.nodeEnv === "production"
    ? [config.frontendUrl]
    : [config.frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Policy Violation: Origin ${origin} not permitted.`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusLink Academic Network API is operational",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", routes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
