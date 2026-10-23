CREATE TABLE aiRecommendation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "interactionId" UUID NOT NULL REFERENCES aiInteraction (id),
    "serviceId" UUID NOT NULL REFERENCES services (id),
    reason TEXT,
    "confidenceScore" DECIMAL(5,4),
    "createdAt" TIMESTAMP NOT NULL,
    UNIQUE ("interactionId", "serviceId")
);