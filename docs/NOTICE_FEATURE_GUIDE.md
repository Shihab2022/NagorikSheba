# Feature: Category-wise Government Notices (NagorikSheba)

Stack: **Next.js (frontend)**, **Express.js (backend)**, **raw PostgreSQL** (use `pg`, NO ORM, NO Prisma).

## Goal

Government websites publish notices. We scrape them on a schedule, store them in our database, and show them to users **category-wise** (Tax & Finance, Transport, Health, etc.) and on each service page. Notices link to the original government source; we do not copy PDFs or full content.

## Hard rules (read first)

1. **No static/hardcoded data.** No hardcoded category lists, slugs, category-to-site maps, keyword rules, or source URLs anywhere in code, seeds, or frontend. Categories already live in the database and new ones will be added later. Everything (categories, sources, selectors) must come from the DB.
2. Frontend routes are dynamic (`/notices/[category]`). Never write one page per category. Never write a `switch` on category names.
3. Do NOT create or alter the existing categories table except to add a column if truly needed. **Inspect the existing schema first** and reuse the existing categories table, its primary key type, and its slug column (if there is no slug column, add a nullable unique `slug` and backfill it from the name inside a migration, not in app code).
4. All SQL must be parameterized (`$1, $2`). No string concatenation of user input.
5. Match the existing project conventions (folder structure, error handling, env handling, auth middleware, styling/Tailwind/components). Do not introduce new libraries unless listed below.
6. Scraper must never crash the API server. Run it as a separate worker process.

## Step 0: Explore before coding

- Read the existing DB schema/migrations, the categories table, services table, user/role model, and the existing auth middleware (USER / ADMIN roles).
- Find how migrations are done in this repo (raw `.sql` files, node-pg-migrate, etc.) and follow it. If none exists, create `db/migrations/NNN_name.sql` files and a tiny runner script.
- Find the category card UI (grid of 12 cards with an "Explore" link) and the service detail page. Note the component names; you will modify them in Step 7.
- Write a short summary of findings before changing anything.

## Step 1: Database migration

Create tables (adjust the FK type to match the existing categories PK):

```sql
CREATE TABLE notice_sources (
  id                      SERIAL PRIMARY KEY,
  category_id             <same type as categories.id> NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name                    TEXT NOT NULL,                 -- e.g. "NBR Notices"
  list_url                TEXT NOT NULL,                 -- page that lists notices
  scraper_type            TEXT NOT NULL DEFAULT 'html',  -- 'html' | 'rss' (playwright is optional, later)
  config                  JSONB NOT NULL DEFAULT '{}',   -- selectors, see Step 3
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  fetch_interval_minutes  INT NOT NULL DEFAULT 180,
  last_fetched_at         TIMESTAMPTZ,
  last_status             TEXT,                          -- 'success' | 'failed'
  last_error              TEXT,
  consecutive_failures    INT NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notices (
  id            BIGSERIAL PRIMARY KEY,
  source_id     INT REFERENCES notice_sources(id) ON DELETE SET NULL,  -- NULL allowed for manual notices
  category_id   <same type as categories.id> NOT NULL REFERENCES categories(id),
  title         TEXT NOT NULL,
  url           TEXT NOT NULL,
  published_at  TIMESTAMPTZ,
  content_hash  TEXT NOT NULL UNIQUE,    -- sha256(source_id + absolute url), used for dedupe
  is_manual     BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notices_category_pub ON notices (category_id, published_at DESC NULLS LAST, id DESC) WHERE is_hidden = FALSE;
CREATE INDEX idx_notices_source ON notices (source_id);
```

Optional but recommended: a `service_id` nullable FK on `notices` is NOT needed. Service pages will reuse the service's category (Step 7).

Do not insert any seed rows into `notice_sources` or `notices`. Sources are created through the admin API/UI in Step 5.

## Step 2: Backend structure

```
server/src/
  modules/notices/
    notices.routes.js        (public endpoints)
    notices.admin.routes.js  (admin endpoints)
    notices.service.js       (SQL queries)
    notices.validation.js
  scraper/
    worker.js                (separate process entry point)
    scheduler.js
    engine.js                (generic scraper, driven by DB config)
    parsers/html.js
    parsers/rss.js
    utils/date.js            (Bangla digit + date parsing)
    utils/urlSafety.js       (SSRF protection)
```

Use the project's existing `pg` Pool instance. Add a script `"worker:scraper": "node src/scraper/worker.js"` to package.json.

## Step 3: Generic scraper engine (config-driven)

`notice_sources.config` for `scraper_type = 'html'`:

```json
{
  "itemSelector": "table tbody tr",
  "titleSelector": "td:nth-child(2) a",
  "linkSelector": "td:nth-child(2) a",
  "linkAttr": "href",
  "dateSelector": "td:nth-child(3)",
  "dateFormat": "DD-MM-YYYY",
  "maxItems": 30,
  "headers": {}
}
```

For `rss`, config can be empty (parse standard RSS/Atom).

Engine requirements:

- Libraries: `axios`, `cheerio`, `rss-parser` (only these). Add `node-cron` for the scheduler.
- Fetch with 20s timeout, a clear User-Agent (`NagorikSheba-Bot/1.0`), max redirects 3, response size limit (e.g. 5 MB).
- Resolve relative links to absolute using `new URL(href, list_url)`.
- Compute `content_hash = sha256(source_id + ':' + absoluteUrl)`.
- Insert with `INSERT ... ON CONFLICT (content_hash) DO NOTHING`. Use a single batched insert per source.
- `category_id` is copied from the source row at insert time (do not look up by name).
- `utils/date.js`: convert Bangla digits (০-৯) to English, handle common formats (`DD-MM-YYYY`, `DD/MM/YYYY`, `YYYY-MM-DD`, Bangla month names) generically. If parsing fails, store `NULL` and fall back to `created_at` for ordering. Never throw on bad dates.
- After each run update `last_fetched_at`, `last_status`, `last_error`, `consecutive_failures` (reset to 0 on success).
- If a source returns 0 items on 3 consecutive runs where it previously returned items, mark `last_status = 'failed'` with a "selectors may be broken" message.
- Respect `robots.txt` (fetch once per host, cache for 24h, skip if disallowed and record the reason in `last_error`).
- Process sources sequentially with a small delay (e.g. 2s) between hosts. One failing source must not stop the others (try/catch per source).

`utils/urlSafety.js` (SSRF protection): only allow `http`/`https`, reject URLs resolving to private/loopback/link-local IPs (127.0.0.0/8, 10/8, 172.16/12, 192.168/16, 169.254/16, ::1, fc00::/7). Use it in both the admin API (on create/update) and the engine (before every fetch).

## Step 4: Scheduler / worker

- `worker.js` starts `node-cron` every 10 minutes. Each tick selects sources where `is_active = TRUE AND (last_fetched_at IS NULL OR last_fetched_at < now() - fetch_interval_minutes * interval '1 minute')` and processes them.
- Prevent overlapping runs (in-process lock flag). If you run multiple worker instances, use `pg_try_advisory_lock`.
- Graceful shutdown on SIGTERM/SIGINT (close pool).
- Log clearly: source name, items found, items inserted, duration, errors.

## Step 5: API endpoints

### Public (no auth)

`GET /api/categories`
Returns all categories with notice stats, computed in SQL, nothing hardcoded:

```sql
SELECT c.*, 
       COUNT(n.id) FILTER (WHERE n.is_hidden = FALSE)                                   AS notice_count,
       COUNT(n.id) FILTER (WHERE n.is_hidden = FALSE AND COALESCE(n.published_at, n.created_at) > now() - interval '7 days') AS new_notice_count
FROM categories c
LEFT JOIN notices n ON n.category_id = c.id
GROUP BY c.id
ORDER BY <existing ordering column or name>;
```

(If an existing endpoint already returns categories, extend it with these two fields instead of creating a duplicate.)

`GET /api/categories/:slug/notices?page=1&limit=20`
- Validate `page >= 1`, `1 <= limit <= 50`.
- Look up the category by slug; if it doesn't exist return **404** (not an empty list).
- Return `{ category: {...}, items: [...], page, limit, total, totalPages }`.
- Each item: `id, title, url, publishedAt, sourceName, createdAt`.
- Order: `COALESCE(published_at, created_at) DESC, id DESC`. Exclude `is_hidden`.

`GET /api/notices/latest?categoryId=<id>&limit=5` (or by slug), used by service pages. Limit max 20.

### Admin (reuse the existing ADMIN auth middleware)

- `GET/POST /api/admin/notice-sources`, `GET/PATCH/DELETE /api/admin/notice-sources/:id`. `POST` and `PATCH` validate `category_id` exists, `list_url` is a safe URL, and `config` has the required selectors for the chosen `scraper_type`.
- `POST /api/admin/notice-sources/:id/test`: runs the scraper in **dry-run** mode (nothing saved) and returns the first 5 parsed items plus any error. This is how admins verify selectors before enabling a source.
- `POST /api/admin/notice-sources/:id/run`: triggers a real scrape immediately.
- `POST /api/admin/notices`: manual notice (`category_id`, `title`, `url`, `published_at`), sets `is_manual = TRUE`, `content_hash` = sha256 of the URL + title.
- `PATCH /api/admin/notices/:id`: change `category_id`, `title`, or `is_hidden`.
- `DELETE /api/admin/notices/:id`.

Add rate limiting to public endpoints if the project already uses a limiter. Use consistent error JSON like the rest of the API.

## Step 6: Next.js frontend (public)

1. **Category cards** (existing 12-card grid): data comes from `/api/categories`. Show `notice_count` (or a small "N new" badge when `new_notice_count > 0`). The "Explore" link goes to `/notices/${category.slug}`. Do not hardcode any card.
2. **`app/notices/[category]/page.tsx`** (server component, `revalidate = 600`):
   - `await params` (Next.js 15 async params).
   - Fetch `/api/categories/:slug/notices?page=`. On 404, call `notFound()`.
   - Show the category name as the heading (use the name from the API response, not from the slug).
   - List: title (link to the original URL, `target="_blank" rel="noopener noreferrer"`), source name, date (`toLocaleDateString('bn-BD')` or the app's current locale), and a small "Source: <hostname>" label.
   - Pagination via `?page=` search param.
   - Empty state ("No notices yet") and error state.
   - Loading skeleton via `loading.tsx`.
3. Respect the existing English/Bangla language toggle and design system (cards, spacing, colors).
4. Optional: a category filter chip bar at the top of the notices page, built from `/api/categories` (dynamic).

## Step 7: Service pages integration

On each service detail page, show a "Latest notices" section (3 to 5 items) for that service's category, using `GET /api/notices/latest`. Include a "View all" link to `/notices/${category.slug}`. Hide the section if there are no notices. Use whatever field already links a service to its category.

## Step 8: Admin UI

Using the existing admin area:
- **Notice Sources** page: table (name, category, URL, active toggle, last status, last fetched, failures) with Create/Edit form (category dropdown loaded from DB, URL, type, interval, selectors as a JSON editor or labeled inputs), a **"Test"** button that shows the dry-run result, and a "Run now" button.
- **Notices** page: list/search, change category, hide/unhide, delete, and add manual notice.
- Show a warning badge for sources with `consecutive_failures >= 3`.

## Step 9: Security and reliability checklist

- Parameterized SQL only; validate all inputs (zod/joi/whatever the project uses).
- Admin endpoints protected by ADMIN role.
- SSRF protection on every outbound URL (Step 3).
- Never render scraped HTML. Titles are plain text and rendered as text; links are validated to be `http(s)`.
- No scraped data is cached as files; only title, link, and date are stored.
- Scraper timeouts and size limits are in place; the worker is a separate process.

## Step 10: Acceptance criteria (verify each, then report)

- [ ] `grep` shows no hardcoded category names/slugs or source URLs in code or seed files.
- [ ] Adding a new row to `categories` makes it appear in `/api/categories`, in the card grid, and `/notices/<new-slug>` works with no code change.
- [ ] Adding a source via the admin API/UI, then pressing Test, shows parsed items; pressing Run saves them; running again inserts 0 duplicates.
- [ ] One broken source (wrong selector or dead URL) does not stop other sources and records `last_error`.
- [ ] Unknown category slug returns 404 page.
- [ ] Pagination works; hidden notices never appear publicly.
- [ ] Service page shows its category's latest notices.
- [ ] Migration runs cleanly on a fresh DB and on the existing DB.
- [ ] Worker starts with `npm run worker:scraper` and shuts down gracefully.

## Deliverables

1. Migration file(s).
2. Backend modules, scraper, worker, and package.json script.
3. Frontend pages/components/admin pages.
4. A short README section: how to add a source, how to find selectors, how to run the worker, and env variables.
5. A final summary listing every file created/changed and anything you could not complete.

Work in order, Step 0 through 10. After each step, run the code or tests where possible and confirm before moving on. If something in the existing codebase conflicts with this guide, prefer the existing conventions and tell me what you changed.
