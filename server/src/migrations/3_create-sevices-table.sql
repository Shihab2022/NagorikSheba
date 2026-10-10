CREATE TYPE verify_status AS ENUM (
    'UNVERIFIED',
    'VERIFIED',
    'NEEDS_REVIEW'
);

CREATE TABLE services (
    id UUID PRIMARY KEY,
    "categoryId" UUID NOT NULL REFERENCES category(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    "shortDescription" VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT,
    "processingTime" VARCHAR(255),
    "officialUrl" TEXT,
    "verificationStatus" verify_status NOT NULL DEFAULT 'UNVERIFIED',
    "lastVerifiedAt" TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);
