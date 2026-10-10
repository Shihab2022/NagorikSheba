CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

CREATE TABLE users (
    id UUID PRIMARY KEY,
    "authProviderId" VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role user_role NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);
