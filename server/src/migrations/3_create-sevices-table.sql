CREATE TYPE verify_status AS ENUM (
    'UNVERIFIED',
    'VERIFIED',
    'NEEDS_REVIEW'
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "categoryId" UUID NOT NULL REFERENCES category(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    "shortDescription" VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT,
    "processingTime" VARCHAR(255),
    "officialUrl" TEXT,
    "verificationStatus" verify_status NOT NULL DEFAULT 'VERIFIED',
    "lastVerifiedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT FALSE,
    "isDeleted" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
