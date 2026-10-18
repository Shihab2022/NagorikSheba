/**
 * Convert `data/passportOfficeData.json` (legacy shape) into the
 * government-offices seeder shape.
 *
 * IMPORTANT — read before seeding:
 *  - The source file is labelled "passport" in its filename but every record
 *    inside is an *Election Commission* office (service_type =
 *    "District Election Office", source_url = ecs.gov.bd). Those offices
 *    provide NID services, NOT passport services.
 *  - So this converter emits officeType ELECTION_COMMISSION + services ["NID"].
 *    Seeded rows will power `/services/nid-correction/nearby-offices`, NOT
 *    `/services/epassport-new/nearby-offices`.
 *  - To power e-Passport nearby results you must collect REAL passport offices
 *    from https://www.epassport.gov.bd (name, address, district, upazila,
 *    lat/lng from the official locator, phone ONLY if published, officialUrl,
 *    verification date) — never re-label election offices as passport offices.
 *
 *  Usage:
 *    node scripts/convert-passportOfficeData.mjs
 *    node scripts/convert-passportOfficeData.mjs data/passportOfficeData.json data/government-offices.seed.json
 *    npm run seed:offices -- data/government-offices.seed.json   (run inside server/)
 */
import fs from "node:fs";
import path from "node:path";

const inputArg = process.argv[2] ?? "data/passportOfficeData.json";
const outputArg = process.argv[3] ?? "data/government-offices.seed.json";

const inputPath = path.resolve(process.cwd(), inputArg);
const outputPath = path.resolve(process.cwd(), outputArg);

if (!fs.existsSync(inputPath)) {
  console.error(`Input not found: ${inputPath}`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const rows = Array.isArray(raw) ? raw : raw.offices ?? [];
if (!Array.isArray(rows) || rows.length === 0) {
  console.error("Input must be a non-empty array (or { offices: [...] }).");
  process.exit(1);
}

// Seeder sanity bounds (must match server/src/seed/government-offices.seed.ts)
const BD_LAT_MIN = 20.0;
const BD_LAT_MAX = 27.5;
const BD_LNG_MIN = 88.0;
const BD_LNG_MAX = 93.0;

let skipped = 0;
const offices = [];

for (const r of rows) {
  const lat = Number(r.latitude);
  const lng = Number(r.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    skipped += 1;
    continue;
  }
  if (lat < BD_LAT_MIN || lat > BD_LAT_MAX || lng < BD_LNG_MIN || lng > BD_LNG_MAX) {
    console.warn(`skip (outside Bangladesh): ${r.office_name} @ ${lat},${lng}`);
    skipped += 1;
    continue;
  }
  const district = String(r.district ?? "").trim();
  if (!district) {
    skipped += 1;
    continue;
  }
  // Source file uses null upazila for district-level offices.
  // The DB requires a non-empty upazila, so fall back to the district name
  // (identity = name+district+upazila stays stable across re-runs).
  // Replace with the exact upazila only when verified from an official source.
  const upazila = String(r.upazila ?? "").trim() || district;

  // Phone: seeder rejects anything that is not a BD mobile or a 6-15 digit
  // international number. "105" is the EC helpline, not this office's line —
  // store null rather than an unverified number.
  const rawPhone = r.phone ? String(r.phone).replace(/[\s-]/g, "") : "";
  const phone = /^(\+?880|0)1[3-9]\d{8}$|^\+?\d{6,15}$/.test(rawPhone) ? rawPhone : null;


  offices.push({
    name: String(r.office_name ?? "").trim(),
    officeType: "ELECTION_COMMISSION",
    address: String(r.address ?? "").trim(),
    district,
    upazila,
    latitude: lat,
    longitude: lng,
    phone,
    officialUrl: r.source_url?.startsWith("https://") ? r.source_url : "https://ecs.gov.bd",
    lastVerifiedAt: new Date().toISOString().slice(0, 10),
    services: ["NID"],
    isActive: true,
  });
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({ offices }, null, 2) + "\n");
console.log(`Converted ${offices.length} offices (skipped ${skipped}) -> ${outputPath}`);
console.log("Next: cd server && npm run seed:offices -- ../data/government-offices.seed.json");
