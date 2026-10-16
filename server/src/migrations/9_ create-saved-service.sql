CREATE TABLE userService (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "userId" UUID NOT NULL REFERENCES users (id),
    "serviceId" UUID NOT NULL REFERENCES services (id),
    "createdAt" TIMESTAMP NOT NULL
);