CREATE TABLE serviceRequirement (
    id UUID PRIMARY KEY,
    "serviceId" UUID UNIQUE NOT NULL REFERENCES services(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    "isMandatory" BOOLEAN NOT NULL,
    "conditionDescription" TEXT,
    "sortOrder" INTEGER NOT NULL,
);
