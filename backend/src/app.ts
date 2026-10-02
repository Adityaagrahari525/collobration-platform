import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { config } from "./config";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// CORS origin policy configuration (Supports local, production, and Vercel domains)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.includes("vercel.app") || origin.includes("localhost") || origin.includes("127.0.0.1")) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive fallback for deployment previews
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
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", routes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
