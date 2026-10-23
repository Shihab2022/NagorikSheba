CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

CREATE TYPE auth_provider AS ENUM ('LOCAL', 'GOOGLE');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'USER',
    "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_auth_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    provider auth_provider NOT NULL,
    "providerUserId" VARCHAR(255),
    "passwordHash" VARCHAR(255),

    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_provider_identity
        UNIQUE (provider, "providerUserId"),

    CONSTRAINT valid_auth_identity CHECK (
        (
            provider = 'LOCAL'
            AND "passwordHash" IS NOT NULL
            AND "providerUserId" IS NULL
        )
        OR
        (
            provider = 'GOOGLE'
            AND "providerUserId" IS NOT NULL
            AND "passwordHash" IS NULL
        )
    )
);