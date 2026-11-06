import assert from "node:assert/strict";
import test from "node:test";
import {
  assessEvidence,
  collectSources,
  getServicePagePath,
  shouldUseOfficialWebFallback,
} from "./ai.evidence";

function serviceDetails(overrides: Record<string, unknown> = {}) {
  return {
    success: true,
    availability: {
      overview: true,
      eligibility: true,
      requirements: true,
      steps: true,
      fees: true,
      sources: true,
    },
    service: {
      name: "Example service",
      slug: "example-service",
      servicePagePath: "/services/example-service",
      description: "A verified service description.",
      eligibility: "Residents who meet the stated criteria.",
      processingTime: "The official authority determines the processing time.",
      requirements: [{ name: "Identity document" }],
      steps: [{ title: "Submit the application" }],
      fees: [{ name: "Application fee", amount: "Not specified" }],
      sources: [
        {
          title: "Official portal",
          url: "https://service.gov.bd/apply",
          lastCheckedAt: "2026-10-01T00:00:00.000Z",
        },
      ],
      ...overrides,
    },
  };
}

test("service page paths are service-agnostic and safely encoded", () => {
  assert.equal(
    getServicePagePath("passport-renewal"),
    "/services/passport-renewal",
  );
  assert.equal(
    getServicePagePath("land mutation/online"),
    "/services/land%20mutation%2Fonline",
  );
});

test("NID, passport, driving licence, land mutation, and tax details are assessed uniformly", () => {
  const slugs = [
    "nid-correction",
    "passport-renewal",
    "driving-licence",
    "land-mutation",
    "income-tax-return",
  ];

  for (const slug of slugs) {
    const payload = serviceDetails({ slug, name: slug });
    const assessment = assessEvidence(
      [{ toolName: "get_service_details", payload }],
      "What are the documents, fee, and steps?",
      { now: new Date("2026-10-24T00:00:00.000Z") },
    );

    assert.deepEqual(assessment, { sufficient: true, reason: "available" });
  }
});

test("missing fee evidence triggers official-web fallback instead of an invented fee", () => {
  const payload = serviceDetails({ fees: [] });
  const results = [{ toolName: "get_service_details", payload }];

  assert.deepEqual(
    assessEvidence(results, "How much is the fee?"),
    { sufficient: false, reason: "insufficient" },
  );
  assert.equal(shouldUseOfficialWebFallback(results, "How much is the fee?"), true);
});

test("official-web fallback becomes usable evidence and contributes only government sources", () => {
  const databaseResults = [
    {
      toolName: "search_knowledge_base",
      payload: { success: true, found: false, results: [] },
    },
  ];
  const officialResult = {
    toolName: "search_official_web",
    payload: {
      success: true,
      found: true,
      results: [
        {
          title: "Passport authority notice",
          url: "https://passport.gov.bd/notices/fees",
          content: "The authority's current notice contains the applicable fee information.",
        },
      ],
    },
  };
  const results = [...databaseResults, officialResult];

  assert.deepEqual(
    assessEvidence(results, "What is the current passport fee?"),
    { sufficient: true, reason: "available" },
  );
  assert.deepEqual(
    collectSources(results, false).map((source) => source.url),
    ["https://passport.gov.bd/notices/fees"],
  );
});

test("service discovery waits for details before falling back to the web", () => {
  const results = [
    {
      toolName: "search_services",
      payload: {
        success: true,
        results: [
          {
            name: "Passport renewal",
            slug: "passport-renewal",
            servicePagePath: "/services/passport-renewal",
          },
        ],
      },
    },
  ];

  assert.equal(
    shouldUseOfficialWebFallback(results, "What documents are required?"),
    false,
  );
});

test("contradictory and stale evidence is not treated as sufficient", () => {
  const contradictory = [
    {
      toolName: "get_service_details",
      payload: serviceDetails({ processingTime: "3 days" }),
    },
    {
      toolName: "search_services",
      payload: {
        success: true,
        results: [
          {
            name: "Example service",
            slug: "example-service",
            processingTime: "30 days",
            servicePagePath: "/services/example-service",
          },
        ],
      },
    },
  ];

  assert.deepEqual(
    assessEvidence(contradictory, "How long does it take?"),
    { sufficient: false, reason: "contradictory" },
  );

  const stale = serviceDetails({
    lastVerifiedAt: "2024-01-01T00:00:00.000Z",
  });

  assert.deepEqual(
    assessEvidence(
      [{ toolName: "get_service_details", payload: stale }],
      "What are the steps?",
      { now: new Date("2026-10-24T00:00:00.000Z") },
    ),
    { sufficient: false, reason: "stale" },
  );
});

test("sources are deduplicated and unsafe/local URLs never escape", () => {
  const sources = collectSources(
    [
      { toolName: "get_service_details", payload: serviceDetails() },
      {
        toolName: "search_official_web",
        payload: {
          success: true,
          results: [
            {
              title: "Same official portal",
              url: "https://service.gov.bd/apply/?utm_source=test#top",
            },
            { title: "Local service", url: "http://localhost:3000/services/x" },
            { title: "Non-government result", url: "https://example.com/x" },
            { title: "Government contact", url: "https://help.gov.bd/contact" },
          ],
        },
      },
    ],
    false,
  );

  assert.deepEqual(
    sources.map((source) => source.url),
    ["/services/example-service", "https://service.gov.bd/apply", "https://help.gov.bd/contact"],
  );
  assert.equal(sources.some((source) => /localhost|127\.0\.0\.1/.test(source.url)), false);
});

test("knowledge-base metadata preserves the service's official source URL", () => {
  const sources = collectSources(
    [
      {
        toolName: "search_knowledge_base",
        payload: {
          success: true,
          found: true,
          results: [
            {
              serviceName: "Land mutation",
              serviceSlug: "land-mutation",
              servicePagePath: "/services/land-mutation",
              metadata: {
                officialUrl: "https://land.gov.bd/portal",
                sources: [
                  {
                    title: "Land authority portal",
                    url: "https://land.gov.bd/portal",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
    false,
  );

  assert.deepEqual(sources.map((source) => source.url), [
    "/services/land-mutation",
    "https://land.gov.bd/portal",
  ]);
});

test("knowledge-base evidence is accepted only when it matches the requested fact", () => {
  const overviewOnly = {
    success: true,
    found: true,
    results: [
      {
        chunkType: "overview",
        content: "Government service: Tax registration",
      },
    ],
  };
  const feeEvidence = {
    success: true,
    found: true,
    results: [
      {
        chunkType: "fee",
        content: "Fee name: application fee\nAmount: Not specified",
      },
    ],
  };

  assert.deepEqual(
    assessEvidence([{ toolName: "search_knowledge_base", payload: overviewOnly }], "What is the fee?"),
    { sufficient: false, reason: "insufficient" },
  );
  assert.deepEqual(
    assessEvidence([{ toolName: "search_knowledge_base", payload: feeEvidence }], "What is the fee?"),
    { sufficient: true, reason: "available" },
  );
});
