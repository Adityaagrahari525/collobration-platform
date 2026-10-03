import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { config } from "./config";
import { errorHandler } from "./middleware/error.middleware";
import { requestIdMiddleware } from "./middleware/requestId.middleware";

const app = express();

// Trace every incoming request
app.use(requestIdMiddleware);

// CORS origin policy configuration (Strictly validates origin with local dev support)
const allowedOrigins = [
  config.frontendUrl,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusLink Academic Network API is operational",
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", routes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
