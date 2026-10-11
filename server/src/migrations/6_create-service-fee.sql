CREATE TABLE serviceFee(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "serviceId" UUID NOT NULL REFERENCES services(id),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NULL,
    currency VARCHAR(3) NOT NULL Default 'BDT',
    description TEXT,
    "effectiveFrom" DATE NULL,
    "effectiveUntil" DATE NULL,
    "isDeleted" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);