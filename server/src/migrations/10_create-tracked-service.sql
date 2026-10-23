CREATE TYPE tracked_service_status AS ENUM (
    'PREPARING',
    'READY_TO_APPLY',
    'SUBMITTED_BY_USER',
    'FOLLOW_UP_REQUIRED',
    'COMPLETED_BY_USER',
    'CANCELLED'
);

CREATE TABLE trackedService (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "userId" UUID NOT NULL REFERENCES users (id),
    "serviceId" UUID NOT NULL REFERENCES services (id),
    title VARCHAR,
    status tracked_service_status NOT NULL DEFAULT 'PREPARING',
    "referenceNumber" VARCHAR,
    "startedAt" TIMESTAMP NOT NULL,
    "completedAt" TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);