CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "authProviderId" VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role user_role NOT NULL DEFAULT 'USER',
    "isDeleted" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);
