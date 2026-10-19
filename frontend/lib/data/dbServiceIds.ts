/**
 * Mapping from the mock catalogue `slug` (frontend/lib/data/services.ts) to
 * the deterministic service `id` seeded in the database
 * (server/src/seed/services.seed.ts).
 *
 * Keep these in sync with the seed file — both sides must agree on the UUIDs
 * so that "Track this service" can create a `trackedService` row whose
 * `serviceId` foreign key resolves.
 */

export const DB_SERVICE_IDS: Record<string, string> = {
  "nid-correction": "20000000-0000-0000-0000-000000000001",
  "birth-registration": "20000000-0000-0000-0000-000000000002",
  "death-registration": "20000000-0000-0000-0000-000000000003",
  "birth-certificate-copy": "20000000-0000-0000-0000-000000000004",
  "old-age-allowance": "20000000-0000-0000-0000-000000000005",
  "government-hospital-services": "20000000-0000-0000-0000-000000000006",
  "epassport-new": "20000000-0000-0000-0000-000000000007",
  "passport-renewal": "20000000-0000-0000-0000-000000000008",
  "driving-license": "20000000-0000-0000-0000-0000-000000000009",
  "vehicle-registration": "20000000-0000-0000-0000-000000000010",
  "education-board-results": "20000000-0000-0000-0000-000000000011",
  "e-tin": "20000000-0000-0000-0000-000000000012",
  "income-tax-return": "20000000-0000-0000-0000-000000000013",
  "land-mutation": "20000000-0000-0000-0000-000000000014",
  "land-development-tax": "20000000-0000-0000-0000-000000000015",
  "holding-tax": "20000000-0000-0000-0000-000000000016",
  "union-parishad-certificates": "20000000-0000-0000-0000-000000000017",
  "police-clearance": "20000000-0000-0000-0000-000000000018",
  "general-diary": "20000000-0000-0000-0000-000000000019",
  "trade-license": "20000000-0000-0000-0000-000000000020",
  "company-registration": "20000000-0000-0000-0000-000000000021",
  "farmer-subsidy": "20000000-0000-0000-0000-000000000022",
};

export const getDbServiceId = (slug: string): string | undefined =>
  DB_SERVICE_IDS[slug];
