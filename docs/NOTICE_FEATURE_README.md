# Government Notices Feature & Scraper Guide

NagorikSheba provides scheduled scraping and category-wise curation of official government notices and circulars directly from ministerial and agency websites.

---

## Architecture Overview

```
                                      +------------------------+
                                      | Ministry Web Portals   |
                                      +-----------+------------+
                                                  |
                                (HTTP / Cheerio / RSS Parser)
                                                  v
+-----------------------------+       +------------------------+
| Notice Scraper Worker       | ----> | notice_sources         |
| (node-cron every 10 min)    |       | (DB configs & rules)   |
+--------------+--------------+       +------------------------+
               |
               v (Deduplication via sha256 content_hash)
+-----------------------------+
| notices Table (PostgreSQL)  |
+--------------+--------------+
               |
       (Express REST API)
               v
+-----------------------------+
| Next.js Frontend            |
| - /notices                  | (All categories overview)
| - /notices/[category]       | (Dynamic category notice board)
| - /services/[slug]          | (Service detail notice integration)
| - /admin/notice-sources     | (Admin scraper test & management)
| - /admin/notices            | (Admin moderation & manual notice)
+-----------------------------+
```

---

## 1. How to Add a Notice Source

1. Navigate to the Admin Console at `/admin/notice-sources` (requires `ADMIN` role).
2. Click **"Add Notice Source"**.
3. Fill in:
   - **Source Name:** e.g., `National Board of Revenue (NBR) Circulars`
   - **Category:** Select the relevant service category (loaded dynamically from DB).
   - **Notice Listing URL:** The official web page listing announcements (e.g., `https://nbr.gov.bd/notices`). Outbound URLs are automatically protected against SSRF vulnerabilities.
   - **Scraper Type:** `HTML` (for standard portal tables/lists) or `RSS` (for RSS/Atom feeds).
   - **CSS Selectors** (for HTML type): See Section 2 below.
   - **Fetch Interval:** Minutes between scraper checks (e.g., 180 min).
4. Click **"Test"** on the created source to run a **dry-run preview**. This verifies selectors and extracts the first 5 notices without saving them to the database.
5. Click **"Run"** to execute an immediate scrape and populate the database.

---

## 2. How to Find CSS Selectors

When setting up an HTML scraper source:
1. Open the target government notice page in Chrome or Firefox.
2. Right-click on a notice item row and select **Inspect**.
3. Identify:
   - **`itemSelector`**: Selector targeting each individual item row or container (e.g. `table tbody tr` or `.notice-list-item`).
   - **`titleSelector`**: Selector for the notice title text relative to the item (e.g. `td:nth-child(2) a` or `h3.notice-title`).
   - **`linkSelector`**: Selector for the anchor element pointing to the original file/page (e.g. `td:nth-child(2) a`).
   - **`dateSelector`** (optional): Selector for the publication date column (e.g. `td:nth-child(3)` or `.notice-date`).

---

## 3. How to Run the Scraper Worker

The notice scraper runs as an isolated worker process and will never crash or degrade the main API server.

### Start Scraper Worker:
```bash
cd server
npm run worker:scraper
```

### Features:
- Executes on startup and then on a recurring `*/10 * * * *` schedule (every 10 minutes).
- Uses PostgreSQL advisory locking (`pg_try_advisory_lock`) to prevent concurrent overlapping runs.
- Respects `robots.txt` rules per domain (cached 24h).
- Validates URLs against private/loopback IP address ranges (SSRF protection).
- Deduplicates items via `sha256(source_id + ':' + absoluteUrl)` with `ON CONFLICT (content_hash) DO NOTHING`.
- Handles graceful shutdown on `SIGINT` / `SIGTERM`.

---

## 4. Environment Variables

In `server/.env`:
```env
# Database connection
DATABASE_URL=postgresql://neondb_owner:password@ep-host.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# Server port
PORT=5000

# Authentication secrets
JWT_ACCESS_SECRET=your_jwt_secret
```

---

## 5. Security & Reliability Highlights

- **SSRF Protection:** Outbound scraper calls strictly validate destination protocols (`http:` / `https:`) and resolve DNS records to reject private/loopback/link-local/multicast IP addresses (RFC 1918, RFC 3927, RFC 4193).
- **Parameterized SQL:** All queries use `$1, $2` parameters with raw `pg` queries.
- **Deduplication:** Hash-based deduplication guarantees that re-running scrapers causes zero duplicate rows.
- **Fail-safe Execution:** An error in one source does not halt the worker loop.
