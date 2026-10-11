CREATE TABLE serviceRequirement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "serviceId" UUID NOT NULL REFERENCES services(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    "isMandatory" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN DEFAULT FALSE,
    "conditionDescription" TEXT,
    "sortOrder" INTEGER NOT NULL,

    UNIQUE ("serviceId", "sortOrder")
);
