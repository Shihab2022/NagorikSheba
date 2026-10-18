CREATE TYPE tracked_step_status AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED',
    'NOT_APPLICABLE'
);

-- Business Rule: The ServiceStep referenced by a TrackedStep must belong 
-- to the same Service referenced by its TrackedService. 
-- Note: The backend must validate this rule.
CREATE TABLE trackedStep (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "trackedServiceId" UUID NOT NULL REFERENCES trackedService (id),
    "serviceStepId" UUID NOT NULL REFERENCES serviceStep (id),
    status tracked_step_status NOT NULL DEFAULT 'NOT_STARTED',
    "completedAt" TIMESTAMP,
    note TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    UNIQUE ("trackedServiceId", "serviceStepId")
);