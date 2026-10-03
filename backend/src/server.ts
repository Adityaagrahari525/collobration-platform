import app from "./app";
import { config } from "./config";

const server = app.listen(config.port, () => {
  console.log(`🚀 CampusLink Backend running on http://localhost:${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
});

process.on("unhandledRejection", (reason: any) => {
  console.error("⚠️ Unhandled Rejection:", reason?.message || reason);
});

process.on("uncaughtException", (err: Error) => {
  console.error("⚠️ Uncaught Exception:", err);
});

export default server;
