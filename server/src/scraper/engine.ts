import axios from "axios";
import https from "https";
import crypto from "crypto";
import { pool } from "../utils/pg";
import { assertSafeUrl } from "./utils/urlSafety";
import { parseHtmlNotices, HtmlScraperConfig, ParsedNoticeItem } from "./parsers/html";
import { parseRssNotices } from "./parsers/rss";

export interface NoticeSourceRecord {
  id: number;
  category_id: string;
  name: string;
  list_url: string;
  scraper_type: "html" | "rss" | string;
  config: any;
  is_active: boolean;
  fetch_interval_minutes: number;
  last_fetched_at?: Date | null;
  last_status?: string | null;
  last_error?: string | null;
  consecutive_failures: number;
}

export interface ScrapeResult {
  sourceId: number;
  sourceName: string;
  success: boolean;
  itemsFound: number;
  itemsInserted: number;
  previewItems?: ParsedNoticeItem[];
  error?: string;
  durationMs: number;
}

// In-memory cache for robots.txt rules (host -> { disallowedPaths: string[], expiresAt: number })
const robotsCache = new Map<string, { disallowedPaths: string[]; expiresAt: number }>();

// Support government portal certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * Checks robots.txt permission for a given URL.
 */
async function isAllowedByRobots(targetUrl: string): Promise<boolean> {
  try {
    const parsed = new URL(targetUrl);
    const origin = parsed.origin;
    const now = Date.now();

    const cached = robotsCache.get(origin);
    let disallowedPaths: string[] = [];

    if (cached && cached.expiresAt > now) {
      disallowedPaths = cached.disallowedPaths;
    } else {
      const robotsUrl = `${origin}/robots.txt`;
      try {
        const resp = await axios.get(robotsUrl, {
          timeout: 5000,
          maxRedirects: 3,
          httpsAgent,
          headers: { "User-Agent": "NagorikSheba-Bot/1.0 (+https://nagoriksheba.gov.bd/bot)" },
          validateStatus: (status) => status < 400,
        });

        const lines = (resp.data as string).split("\n");
        let appliesToUs = false;

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("#") || !trimmed) continue;

          const [directive, ...rest] = trimmed.split(":");
          if (!directive) continue;
          const value = rest.join(":").trim();

          if (directive.toLowerCase() === "user-agent") {
            if (value === "*" || value.toLowerCase().includes("nagoriksheba")) {
              appliesToUs = true;
            } else {
              appliesToUs = false;
            }
          } else if (appliesToUs && directive.toLowerCase() === "disallow") {
            if (value) {
              disallowedPaths.push(value);
            }
          }
        }
      } catch {
        // robots.txt unreachable or 404 -> assume allowed
        disallowedPaths = [];
      }

      robotsCache.set(origin, {
        disallowedPaths,
        expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours
      });
    }

    const path = parsed.pathname + parsed.search;
    for (const disallowed of disallowedPaths) {
      if (disallowed === "/" || path.startsWith(disallowed)) {
        return false;
      }
    }

    return true;
  } catch {
    return true;
  }
}

/**
 * Executes scraping for a single notice source.
 * Supports dry-run testing (no DB modifications).
 */
export async function scrapeSource(
  source: NoticeSourceRecord,
  options: { dryRun?: boolean } = {}
): Promise<ScrapeResult> {
  const startTime = Date.now();
  const { dryRun = false } = options;

  try {
    // 1. SSRF check
    await assertSafeUrl(source.list_url);

    // 2. Robots.txt check
    const allowed = await isAllowedByRobots(source.list_url);
    if (!allowed) {
      throw new Error(`Crawling disallowed by robots.txt for URL: ${source.list_url}`);
    }

    // 3. Fetch list page
    const customHeaders = source.config?.headers || {};
    const response = await axios.get(source.list_url, {
      timeout: 20000,
      maxRedirects: 3,
      maxContentLength: 5 * 1024 * 1024, // 5 MB max
      httpsAgent,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (NagorikSheba-Bot/1.0)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...customHeaders,
      },
      responseType: "text",
    });

    const content = typeof response.data === "string" ? response.data : String(response.data);

    // 4. Parse content
    let items: ParsedNoticeItem[] = [];
    if (source.scraper_type === "rss") {
      items = await parseRssNotices(content, source.list_url, source.config?.maxItems || 50);
    } else {
      items = parseHtmlNotices(content, source.list_url, source.config as HtmlScraperConfig);
    }

    // If dry run, return preview items directly
    if (dryRun) {
      return {
        sourceId: source.id,
        sourceName: source.name,
        success: true,
        itemsFound: items.length,
        itemsInserted: 0,
        previewItems: items.slice(0, 5),
        durationMs: Date.now() - startTime,
      };
    }

    // 5. Database insertion with deduplication
    let insertedCount = 0;
    if (items.length > 0) {
      // Build parameterized batch insert
      const valueTuples: string[] = [];
      const queryParams: any[] = [];
      let paramIndex = 1;

      for (const item of items) {
        const contentHash = crypto
          .createHash("sha256")
          .update(`${source.id}:${item.url}`)
          .digest("hex");

        valueTuples.push(
          `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4}, $${paramIndex + 5}, FALSE, FALSE)`
        );
        queryParams.push(
          source.id,
          source.category_id,
          item.title,
          item.url,
          item.publishedAt ? item.publishedAt.toISOString() : null,
          contentHash
        );
        paramIndex += 6;
      }

      const insertSql = `
        INSERT INTO notices (source_id, category_id, title, url, published_at, content_hash, is_manual, is_hidden)
        VALUES ${valueTuples.join(", ")}
        ON CONFLICT (content_hash) DO NOTHING
      `;

      const insertRes = await pool.query(insertSql, queryParams);
      insertedCount = insertRes.rowCount || 0;
    }

    // Check consecutive failure condition: 0 items returned on 3 consecutive runs
    let newConsecutiveFailures = 0;
    let newStatus = "success";
    let newError: string | null = null;

    if (items.length === 0) {
      newConsecutiveFailures = (source.consecutive_failures || 0) + 1;
      if (newConsecutiveFailures >= 3) {
        newStatus = "failed";
        newError = "Selectors may be broken or site layout changed (0 items found across consecutive runs)";
      }
    }

    // Update notice source metadata
    await pool.query(
      `UPDATE notice_sources
       SET last_fetched_at = NOW(),
           last_status = $1,
           last_error = $2,
           consecutive_failures = $3,
           updated_at = NOW()
       WHERE id = $4`,
      [newStatus, newError, newConsecutiveFailures, source.id]
    );

    return {
      sourceId: source.id,
      sourceName: source.name,
      success: newStatus === "success",
      itemsFound: items.length,
      itemsInserted: insertedCount,
      durationMs: Date.now() - startTime,
    };
  } catch (err: any) {
    const errorMsg = err.message || "Scraper execution failed";
    const durationMs = Date.now() - startTime;

    if (!dryRun) {
      await pool.query(
        `UPDATE notice_sources
         SET last_fetched_at = NOW(),
             last_status = 'failed',
             last_error = $1,
             consecutive_failures = consecutive_failures + 1,
             updated_at = NOW()
         WHERE id = $2`,
        [errorMsg, source.id]
      );
    }

    return {
      sourceId: source.id,
      sourceName: source.name,
      success: false,
      itemsFound: 0,
      itemsInserted: 0,
      error: errorMsg,
      durationMs,
    };
  }
}
