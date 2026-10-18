CREATE TYPE information_report_type AS ENUM (
    'WRONG_FEE',
    'WRONG_REQUIREMENT',
    'BROKEN_LINK',
    'OUTDATED_INFORMATION',
    'OTHER'
);

CREATE TYPE information_report_status AS ENUM (
    'PENDING',
    'UNDER_REVIEW',
    'RESOLVED',
    'REJECTED'
);

CREATE TABLE informationReport (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "userId" UUID NOT NULL REFERENCES users (id),
    "serviceId" UUID NOT NULL REFERENCES services (id),
    "reportType" information_report_type NOT NULL,
    description TEXT NOT NULL,
    status information_report_status NOT NULL DEFAULT 'PENDING',
    "reviewedById" UUID REFERENCES users (id),
    "reviewedAt" TIMESTAMP,
    "adminComment" TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);