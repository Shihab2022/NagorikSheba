CREATE TABLE serviceFee(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "serviceId" UUID NOT NULL REFERENCES services(id),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NULL,
    currency VARCHAR(3) NOT NULL Default 'BDT',
    description TEXT,
    "effectiveFrom" DATE,
    "effectiveUntil" DATE,
    "isDeleted" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);