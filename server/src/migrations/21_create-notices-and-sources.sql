CREATE TABLE IF NOT EXISTS notice_sources (
  id                      SERIAL PRIMARY KEY,
  category_id             UUID NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
  name                    TEXT NOT NULL,
  list_url                TEXT NOT NULL,
  scraper_type            TEXT NOT NULL DEFAULT 'html',
  config                  JSONB NOT NULL DEFAULT '{}',
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  fetch_interval_minutes  INT NOT NULL DEFAULT 180,
  last_fetched_at         TIMESTAMPTZ,
  last_status             TEXT,
  last_error              TEXT,
  consecutive_failures    INT NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notices (
  id            BIGSERIAL PRIMARY KEY,
  source_id     INT REFERENCES notice_sources(id) ON DELETE SET NULL,
  category_id   UUID NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
  title         TEXT NOT NULL,
  url           TEXT NOT NULL,
  published_at  TIMESTAMPTZ,
  content_hash  TEXT NOT NULL UNIQUE,
  is_manual     BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notices_category_pub ON notices (category_id, published_at DESC NULLS LAST, id DESC) WHERE is_hidden = FALSE;
CREATE INDEX IF NOT EXISTS idx_notices_source ON notices (source_id);
