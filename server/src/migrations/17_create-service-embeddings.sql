DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'vector') THEN
        CREATE EXTENSION IF NOT EXISTS vector;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'service_embeddings'
        ) THEN
            CREATE TABLE service_embeddings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                service_id UUID NOT NULL
                    REFERENCES services(id)
                    ON DELETE CASCADE,

                chunk_key TEXT NOT NULL,

                chunk_type TEXT NOT NULL
                    CHECK (
                        chunk_type IN (
                            'overview',
                            'eligibility',
                            'requirement',
                            'step',
                            'fee',
                            'source'
                        )
                    ),

                content TEXT NOT NULL,

                embedding VECTOR(768) NOT NULL,

                metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

                content_hash TEXT NOT NULL,

                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                UNIQUE (service_id, chunk_key)
            );

            CREATE INDEX service_embeddings_service_id_idx
            ON service_embeddings (service_id);
        END IF;
    END IF;
END
$$;
