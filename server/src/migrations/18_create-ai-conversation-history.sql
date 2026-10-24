
-- Up Migration

CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Null for guest conversations; populated after login.
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Generated and managed by the backend for anonymous visitors.
    guest_session_id UUID,

    title VARCHAR(120) NOT NULL DEFAULT 'New chat',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- A conversation must belong to either a user or a guest session.
    CONSTRAINT ai_conversations_owner_check CHECK (
        (user_id IS NOT NULL AND guest_session_id IS NULL)
        OR
        (user_id IS NULL AND guest_session_id IS NOT NULL)
    )
);

CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    conversation_id UUID NOT NULL
        REFERENCES ai_conversations(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('user', 'assistant')),

    content TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Efficiently list conversations belonging to a guest.
CREATE INDEX ai_conversations_guest_updated_idx
    ON ai_conversations (guest_session_id, updated_at DESC)
    WHERE guest_session_id IS NOT NULL;

-- Ready for authenticated conversations in the future.
CREATE INDEX ai_conversations_user_updated_idx
    ON ai_conversations (user_id, updated_at DESC)
    WHERE user_id IS NOT NULL;

-- Efficiently retrieve messages in chronological order.
CREATE INDEX ai_messages_conversation_created_idx
    ON ai_messages (conversation_id, created_at, id);


-- Down Migration

DROP TABLE IF EXISTS ai_messages;
DROP TABLE IF EXISTS ai_conversations;
