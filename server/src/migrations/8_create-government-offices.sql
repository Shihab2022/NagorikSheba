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
CREATE TYPE office_service_key AS ENUM (
    'NID',
    'PASSPORT',
    'BIRTH_REGISTRATION',
    'DRIVING_LICENCE'
);

CREATE TYPE government_office_type AS ENUM (
    'ELECTION_COMMISSION',
    'PASSPORT_OFFICE',
    'REGISTRAR_GENERAL',
    'UNION_PARISHAD',
    'MUNICIPALITY',
    'CITY_CORPORATION',
    'BRTA_OFFICE'
);

CREATE TABLE government_offices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    "officeType" government_office_type NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    upazila VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    -- Only store phone numbers that were verified against an official source.
    phone VARCHAR(40),
    "officialUrl" TEXT,
    "lastVerifiedAt" DATE NOT NULL DEFAULT CURRENT_DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_office_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT valid_office_longitude CHECK (longitude BETWEEN -180 AND 180),
    CONSTRAINT valid_office_official_url CHECK (
        "officialUrl" IS NULL OR "officialUrl" ~* '^https://'
    )
);

-- An office only supports the services it is verified to provide.
CREATE TABLE government_office_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "officeId" UUID NOT NULL REFERENCES government_offices(id) ON DELETE CASCADE,
    "serviceKey" office_service_key NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE ("officeId", "serviceKey")
);

-- Upsert identity: one office record per name/district/upazila (soft-deleted rows excluded).
CREATE UNIQUE INDEX uq_government_offices_identity
    ON government_offices (name, district, upazila)
    WHERE "isDeleted" = FALSE;

CREATE INDEX idx_government_offices_area
    ON government_offices (district, upazila)
    WHERE "isDeleted" = FALSE AND "isActive" = TRUE;

-- Supports bounding-box pre-filtering before the Haversine refinement.
CREATE INDEX idx_government_offices_coordinates
    ON government_offices (latitude, longitude)
    WHERE "isDeleted" = FALSE AND "isActive" = TRUE;

CREATE INDEX idx_government_office_services_key
    ON government_office_services ("serviceKey");
