DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'services_slug_unique'
    ) THEN
        ALTER TABLE services ADD CONSTRAINT services_slug_unique UNIQUE (slug);
    END IF;
END $$;
