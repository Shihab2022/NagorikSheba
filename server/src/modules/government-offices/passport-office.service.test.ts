import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import ApiError from "../../app/errors/AppError";
import {
  clearPassportOfficeCache,
  findNearbyPassportOffices,
} from "./passport-office.service";

const originalDataPath = process.env.PASSPORT_OFFICE_DATA_PATH;

test.beforeEach(() => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "nagoriksheba-"));
  const fixturePath = path.join(directory, "passportOfficeData.json");
  fs.writeFileSync(
    fixturePath,
    JSON.stringify([
      {
        office_name: "Passport Office, Dhaka",
        division: "Dhaka",
        district: "Dhaka",
        upazila: "Agargaon",
        address: "Agargaon",
        phone: "02-1234567",
        service_type: "Passport Office",
        latitude: 23.7772,
        longitude: 90.3775,
        source_url: "https://www.epassport.gov.bd",
        verified: true,
      },
      {
        office_name: "Passport Office, Gazipur",
        district: "Gazipur",
        service_type: "Passport Office",
        latitude: "24.0000",
        longitude: "90.4200",
      },
      {
        office_name: "Election Office",
        service_type: "District Election Office",
        latitude: 23.81,
        longitude: 90.41,
      },
      {
        office_name: "Incomplete Passport Office",
        service_type: "Passport Office",
        latitude: "not-a-coordinate",
        longitude: 90,
      },
    ]),
  );
  process.env.PASSPORT_OFFICE_DATA_PATH = fixturePath;
  clearPassportOfficeCache();
});

test.afterEach(() => {
  if (originalDataPath === undefined) {
    delete process.env.PASSPORT_OFFICE_DATA_PATH;
  } else {
    process.env.PASSPORT_OFFICE_DATA_PATH = originalDataPath;
  }
  clearPassportOfficeCache();
});

test("normalizes, filters, sorts, and limits passport offices", () => {
  const result = findNearbyPassportOffices({
    lat: "23.8103",
    lng: "90.4125",
    radiusKm: "100",
    limit: "1",
  });

  assert.equal(result.meta.total, 2);
  assert.equal(result.offices.length, 1);
  assert.equal(result.offices[0].name, "Passport Office, Dhaka");
  assert.ok(result.offices[0].distanceKm > 0);
});

test("rejects incomplete coordinate text", () => {
  assert.throws(
    () =>
      findNearbyPassportOffices({
        lat: "22.",
        lng: "90.4",
      }),
    (error: unknown) =>
      error instanceof ApiError && error.statusCode === 400,
  );
});
