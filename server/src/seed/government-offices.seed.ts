/**
 * Government office seeder.
 *
 * Loads verified office records from a JSON file into the database.
 * Records are NEVER invented here — supply data collected from official
 * Bangladesh government sources (Election Commission, epassport.gov.bd,
 * BDRIS, brta.gov.bd) in the JSON file:
 *
 *   npm run seed:offices -- path/to/offices.json
 *
 * See `government-offices.seed.example.json` for the expected shape.
 * The importer validates every record and rejects the whole file on any
 * invalid entry, so partial/wrong data never reaches the database.
 */
import fs from "fs";
import path from "path";
import { pool } from "../utils/pg";
import {
  OFFICE_SERVICE_KEYS,
} from "../app/modules/government-offices/government-offices.service";

const OFFICE_TYPES = [
  "ELECTION_COMMISSION",
  "PASSPORT_OFFICE",
  "REGISTRAR_GENERAL",
  "UNION_PARISHAD",
  "MUNICIPALITY",
  "CITY_CORPORATION",
  "BRTA_OFFICE",
] as const;

type SeedOffice = {
  name: string;
  officeType: string;
  address: string;
  district: string;
  upazila: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  officialUrl?: string | null;
  lastVerifiedAt: string;
  services: string[];
  isActive?: boolean;
};

// Rough sanity bounds for Bangladesh — catches swapped lat/lng and typos.
const BD_LAT_MIN = 20.0;
const BD_LAT_MAX = 27.5;
const BD_LNG_MIN = 88.0;
const BD_LNG_MAX = 93.0;

const PHONE_PATTERN = /^(\+?880|0)1[3-9]\d{8}$|^\+?\d{6,15}$/;

function validateOffice(raw: unknown, index: number): string[] {
  const errors: string[] = [];
  const label = `offices[${index}]`;
  if (typeof raw !== "object" || raw === null) {
    return [`${label}: must be an object.`];
  }
  const o = raw as SeedOffice;

  if (typeof o.name !== "string" || !o.name.trim() || o.name.length > 255)
    errors.push(`${label}: "name" is required (max 255 chars).`);
  if (typeof o.officeType !== "string" || !(OFFICE_TYPES as readonly string[]).includes(o.officeType))
    errors.push(`${label}: "officeType" must be one of ${OFFICE_TYPES.join(", ")}.`);
  if (typeof o.address !== "string" || !o.address.trim())
    errors.push(`${label}: "address" is required.`);
  if (typeof o.district !== "string" || !o.district.trim() || o.district.length > 100)
    errors.push(`${label}: "district" is required (max 100 chars).`);
  if (typeof o.upazila !== "string" || !o.upazila.trim() || o.upazila.length > 100)
    errors.push(`${label}: "upazila" is required (max 100 chars).`);

  if (typeof o.latitude !== "number" || !Number.isFinite(o.latitude) || o.latitude < BD_LAT_MIN || o.latitude > BD_LAT_MAX)
    errors.push(`${label}: "latitude" must be a number between ${BD_LAT_MIN} and ${BD_LAT_MAX} (Bangladesh).`);
  if (typeof o.longitude !== "number" || !Number.isFinite(o.longitude) || o.longitude < BD_LNG_MIN || o.longitude > BD_LNG_MAX)
    errors.push(`${label}: "longitude" must be a number between ${BD_LNG_MIN} and ${BD_LNG_MAX} (Bangladesh).`);

  if (o.phone != null && o.phone !== "" && !PHONE_PATTERN.test(String(o.phone).replace(/[\s-]/g, "")))
    errors.push(`${label}: "phone" must be a valid BD mobile or international number.`);
  if (o.officialUrl != null && o.officialUrl !== "" && !/^https:\/\/\S+$/.test(String(o.officialUrl)))
    errors.push(`${label}: "officialUrl" must be an https:// URL from an official source.`);

  if (typeof o.lastVerifiedAt !== "string" || Number.isNaN(Date.parse(o.lastVerifiedAt)))
    errors.push(`${label}: "lastVerifiedAt" must be an ISO date string (the date the record was verified against the official source).`);

  if (!Array.isArray(o.services) || o.services.length === 0)
    errors.push(`${label}: "services" must be a non-empty array.`);
  else {
    for (const s of o.services) {
      if (!(OFFICE_SERVICE_KEYS as readonly string[]).includes(s))
        errors.push(`${label}: unknown service key "${s}". Allowed: ${OFFICE_SERVICE_KEYS.join(", ")}.`);
    }
  }

  return errors;
}

async function seed() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npm run seed:offices -- path/to/offices.json");
    process.exit(1);
  }
  const resolved = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${resolved}`);
    process.exit(1);
  }

  const parsed = JSON.parse(fs.readFileSync(resolved, "utf8"));
  const offices: SeedOffice[] = Array.isArray(parsed) ? parsed : parsed?.offices;
  if (!Array.isArray(offices) || offices.length === 0) {
    console.error('Input must be an array (or an object with an "offices" array) with at least one record.');
    process.exit(1);
  }

  const allErrors: string[] = [];
  offices.forEach((o, i) => allErrors.push(...validateOffice(o, i)));
  if (allErrors.length > 0) {
    console.error("Validation failed — nothing was imported:\n" + allErrors.map((e) => ` - ${e}`).join("\n"));
    process.exit(1);
  }

  const client = await pool.connect();
  let inserted = 0;
  let updated = 0;
  try {
    await client.query("BEGIN");
    for (const o of offices) {
      const result = await client.query(
        `INSERT INTO government_offices
           (name, "officeType", address, district, upazila, latitude, longitude, phone, "officialUrl", "lastVerifiedAt", "isActive")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (name, district, upazila) WHERE "isDeleted" = FALSE
         DO UPDATE SET
           "officeType" = EXCLUDED."officeType",
           address = EXCLUDED.address,
           latitude = EXCLUDED.latitude,
           longitude = EXCLUDED.longitude,
           phone = EXCLUDED.phone,
           "officialUrl" = EXCLUDED."officialUrl",
           "lastVerifiedAt" = EXCLUDED."lastVerifiedAt",
           "isActive" = EXCLUDED."isActive",
           "updatedAt" = CURRENT_TIMESTAMP
         RETURNING id, (xmax = 0) AS inserted`,
        [
          o.name.trim(),
          o.officeType,
          o.address.trim(),
          o.district.trim(),
          o.upazila.trim(),
          o.latitude,
          o.longitude,
          o.phone ? String(o.phone).replace(/[\s-]/g, "") : null,
          o.officialUrl || null,
          o.lastVerifiedAt,
          o.isActive !== false,
        ],
      );
      const officeId: string = result.rows[0].id;
      if (result.rows[0].inserted) inserted += 1;
      else updated += 1;

      await client.query(`DELETE FROM government_office_services WHERE "officeId" = $1`, [officeId]);
      for (const serviceKey of Array.from(new Set(o.services))) {
        await client.query(
          `INSERT INTO government_office_services ("officeId", "serviceKey") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [officeId, serviceKey],
        );
      }
    }
    await client.query("COMMIT");
    console.log(`Seed complete: ${inserted} inserted, ${updated} updated.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seeding failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
