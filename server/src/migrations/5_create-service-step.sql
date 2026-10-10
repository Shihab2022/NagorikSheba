
CREATE TYPE action_enum AS ENUM (
    'READ_GUIDE',
    'VISIT_OFFICIAL_PORTAL',
    'VISIT_OFFICE',
    'PREPARE_DOCUMENTS',
    'OTHER'
);

CREATE TABLE serviceStep (
    id UUID PRIMARY KEY,
    "serviceId" UUID NOT NULL REFERENCES services(id),
    "stepNumber" INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    "actionType" action_enum NOT NULL,
    "officialUrl" TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,

    UNIQUE ("serviceId", "stepNumber")
);
