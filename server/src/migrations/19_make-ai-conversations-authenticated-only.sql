-- Up Migration

-- Protect any existing guest conversations from accidental loss.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM ai_conversations
        WHERE user_id IS NULL
    ) THEN
        RAISE EXCEPTION
            'Guest conversations exist. Handle them before removing guest mode.';
    END IF;
END
$$;

-- Remove the old guest-capable schema.
ALTER TABLE ai_conversations
    DROP CONSTRAINT IF EXISTS ai_conversations_owner_check;

ALTER TABLE ai_conversations
    DROP COLUMN IF EXISTS guest_session_id;

-- Every conversation must now belong to an authenticated user.
ALTER TABLE ai_conversations
    ALTER COLUMN user_id SET NOT NULL;

-- Replace the partial index with a regular user-history index.
DROP INDEX IF EXISTS ai_conversations_user_updated_idx;

CREATE INDEX ai_conversations_user_updated_idx
    ON ai_conversations (user_id, updated_at DESC);


-- Down Migration

DROP INDEX IF EXISTS ai_conversations_user_updated_idx;

ALTER TABLE ai_conversations
    ADD COLUMN guest_session_id UUID;

ALTER TABLE ai_conversations
    ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE ai_conversations
    ADD CONSTRAINT ai_conversations_owner_check
    CHECK (
        (user_id IS NOT NULL AND guest_session_id IS NULL)
        OR
        (user_id IS NULL AND guest_session_id IS NOT NULL)
    );

CREATE INDEX ai_conversations_user_updated_idx
    ON ai_conversations (user_id, updated_at DESC)
    WHERE user_id IS NOT NULL;