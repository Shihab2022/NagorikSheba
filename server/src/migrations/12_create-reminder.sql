CREATE TYPE reminder_status AS ENUM (
    'PENDING',
    'SENT',
    'DISMISSED'
);

CREATE TABLE reminder (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "userId" UUID NOT NULL REFERENCES users (id),
    "trackedServiceId" UUID REFERENCES trackedService (id),
    title VARCHAR NOT NULL,
    description TEXT,
    "remindAt" TIMESTAMP NOT NULL,
    status reminder_status NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);