CREATE TYPE source_enum AS ENUM(
    'OFFICIAL_PORTAL', 'OFFICIAL_NOTICE', 'OFFICIAL_DOCUMENT', 'OTHER'
);

CREATE TABLE serviceSource(
    id UUID PRIMARY KEY,
    "serviceId" UUID NOT NULL REFERENCES services(id),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    "sourceType" source_enum NOT NULL,
    "lastCheckedAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);