import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

import { pool } from "../utils/pg";
import { runScraperTick } from "./scheduler";

console.log("==================================================");
console.log("     NagorikSheba Government Notice Scraper       ");
console.log("    Schedule: BD Daytime Only (08:00 - 20:30 BST) ");
console.log("==================================================");

/**
 * Checks if the current time in Bangladesh (Asia/Dhaka) is daytime
 * (between 08:00 AM and 08:59 PM BST).
 */
export function isBangladeshDaytime(): boolean {
  try {
    const bdHourStr = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      hour12: false,
    }).format(new Date());

    const bdHour = parseInt(bdHourStr, 10);
    // Active between 08:00 AM and 08:59 PM (20:59)
    return bdHour >= 8 && bdHour <= 20;
  } catch {
    // Fallback: default to true if Intl formatting fails
    return true;
  }
}

// Schedule: Every 30 minutes between 08:00 AM and 08:30 PM Bangladesh Time (Asia/Dhaka)
// Cron expression: "0,30 8-20 * * *"
const task = cron.schedule(
  "0,30 8-20 * * *",
  async () => {
    console.log("[Worker] Daytime cron triggered (Asia/Dhaka). Running check...");
    await runScraperTick();
  },
  {
    timezone: "Asia/Dhaka",
  }
);

// Initial startup tick (only if starting up during BD daytime)
setTimeout(async () => {
  if (isBangladeshDaytime()) {
    console.log("[Worker] Executing initial startup tick (Current time is within BD daytime)...");
    await runScraperTick();
  } else {
    console.log(
      "[Worker] Startup is outside BD daytime (08:00 - 20:00 Asia/Dhaka). Scraper is sleeping until 08:00 AM BST."
    );
  }
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
