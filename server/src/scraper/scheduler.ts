import { pool } from "../utils/pg";
import { scrapeSource, NoticeSourceRecord } from "./engine";

let isRunning = false;
const ADVISORY_LOCK_ID = 8493021; // Distinct arbitrary 64-bit int for notice scraper

/**
 * Runs one scraper tick across all due active sources.
 */
export async function runScraperTick(): Promise<void> {
  if (isRunning) {
    console.log("[Notice Scraper] Previous tick still running, skipping.");
    return;
  }

  // Attempt postgres advisory lock
  let client;
  let lockAcquired = false;
  try {
    client = await pool.connect();
    const lockRes = await client.query("SELECT pg_try_advisory_lock($1) AS acquired", [ADVISORY_LOCK_ID]);
    lockAcquired = lockRes.rows[0]?.acquired === true;

    if (!lockAcquired) {
      console.log("[Notice Scraper] Advisory lock held by another process. Skipping tick.");
      client.release();
      return;
    }
  } catch (err: any) {
    console.error("[Notice Scraper] Error trying to acquire advisory lock:", err.message);
    if (client) client.release();
    return;
  }

  isRunning = true;
  console.log(`[Notice Scraper] Tick started at ${new Date().toISOString()}`);

  try {
    // Select due sources
    const query = `
      SELECT * FROM notice_sources
      WHERE is_active = TRUE
        AND (last_fetched_at IS NULL OR last_fetched_at < NOW() - (fetch_interval_minutes || ' minutes')::interval)
      ORDER BY id ASC
    `;
    const res = await pool.query(query);
    const sources: NoticeSourceRecord[] = res.rows;

    if (sources.length === 0) {
      console.log("[Notice Scraper] No sources are currently due for fetching.");
      return;
    }

    console.log(`[Notice Scraper] Found ${sources.length} sources to scrape.`);

    let lastHost = "";
    for (const source of sources) {
      try {
        const parsed = new URL(source.list_url);
        // Delay 2s if scraping the same host sequentially
        if (parsed.hostname === lastHost) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        lastHost = parsed.hostname;

        console.log(`[Notice Scraper] Scraping source: "${source.name}" (ID: ${source.id}) - ${source.list_url}`);
        const result = await scrapeSource(source);

        if (result.success) {
          console.log(
            `[Notice Scraper] SUCCESS: "${source.name}" | Found: ${result.itemsFound} | Inserted: ${result.itemsInserted} | Duration: ${result.durationMs}ms`
          );
        } else {
          console.warn(
            `[Notice Scraper] FAILED: "${source.name}" | Error: ${result.error} | Duration: ${result.durationMs}ms`
          );
        }
      } catch (err: any) {
        console.error(`[Notice Scraper] Unexpected error on source ${source.id}:`, err.message);
      }

      // Small pause between sources
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (err: any) {
    console.error("[Notice Scraper] Tick failed:", err.message);
  } finally {
    isRunning = false;
    if (client && lockAcquired) {
      try {
        await client.query("SELECT pg_advisory_unlock($1)", [ADVISORY_LOCK_ID]);
      } catch (e: any) {
        console.error("[Notice Scraper] Error releasing advisory lock:", e.message);
      }
      client.release();
    }
    console.log(`[Notice Scraper] Tick finished at ${new Date().toISOString()}`);
  }
}
