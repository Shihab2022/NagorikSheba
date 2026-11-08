import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

import { pool } from "../utils/pg";
import { runScraperTick } from "./scheduler";

console.log("==========================================");
console.log("  NagorikSheba Government Notice Scraper  ");
console.log("==========================================");

// Schedule every 10 minutes
const task = cron.schedule("*/10 * * * *", async () => {
  await runScraperTick();
});

// Run an initial tick shortly after startup
setTimeout(async () => {
  console.log("[Worker] Executing initial startup tick...");
  await runScraperTick();
}, 2000);

// Graceful shutdown handling
let isShuttingDown = false;
async function shutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n[Worker] Received ${signal}. Shutting down notice scraper worker...`);
  task.stop();

  try {
    await pool.end();
    console.log("[Worker] Database connection pool closed.");
  } catch (err: any) {
    console.error("[Worker] Error closing database pool:", err.message);
  }

  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
