CREATE TYPE ai_interaction_type AS ENUM (
    'SERVICE_FINDER',
    'GUIDE_SIMPLIFIER',
    'DOCUMENT_CHECKLIST',
    'NEXT_STEP'
);

CREATE TABLE aiInteraction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "userId" UUID REFERENCES users (id),
    query TEXT NOT NULL,
    "interactionType" ai_interaction_type NOT NULL,
    "detectedIntent" VARCHAR,
    "responseSummary" TEXT,
    "createdAt" TIMESTAMP NOT NULL
);