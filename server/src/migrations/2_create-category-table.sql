CREATE TABLE category(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) Unique NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    "isDeleted" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
)