CREATE TYPE verification_status AS ENUM(
    'VERIFIED',
    'NEEDS_REVIEW',
    'UNVERIFIED'
);

CREATE TABLE serviceVerification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "serviceId" UUID NOT NULL REFERENCES services (id),
    "verifiedById" UUID NOT NULL REFERENCES users (id),
    status verification_status NOT NULL,
    notes TEXT,
    "verifiedAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);