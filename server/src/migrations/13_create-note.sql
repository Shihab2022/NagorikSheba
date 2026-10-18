CREATE TABLE note (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "userId" UUID NOT NULL REFERENCES users (id),
    "trackedServiceId" UUID REFERENCES trackedService (id),
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);