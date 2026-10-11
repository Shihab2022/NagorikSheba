
CREATE TYPE action_enum AS ENUM (
    'READ_GUIDE',
    'VISIT_OFFICIAL_PORTAL',
    'VISIT_OFFICE',
    'PREPARE_DOCUMENTS',
    'OTHER'
);

CREATE TABLE serviceStep (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "serviceId" UUID NOT NULL REFERENCES services(id),
    "stepNumber" INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    "actionType" action_enum NOT NULL DEFAULT 'READ_GUIDE',
    "officialUrl" TEXT,
    "isDeleted" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE ("serviceId", "stepNumber")
);
