
import test from "node:test";
import assert from "node:assert/strict";

import { pool } from "../src/utils/pg";
import { GovernmentOfficesServices } from "../src/app/modules/government-offices/government-offices.service";
import {
  overpassPassportProvider,
  type OfficeCandidate,
  type PassportAreaSearchInput,
} from "../src/app/modules/government-offices/office-location-provider";

const createCandidates = (): OfficeCandidate[] =>
  Array.from({ length: 5 }, (_, index) => ({
    osmType: "node" as const,
    osmId: index + 1,
    name: `Passport Office ${index + 1}`,
    latitude: 23.685 + index * 0.001,
    longitude: 90.356 + index * 0.001,
    source: "overpass",
    verificationStatus: "candidate" as const,
    serviceEligible: false,
  }));

function installMocks(
  implementation: (
    input: PassportAreaSearchInput,
  ) => Promise<OfficeCandidate[]>,
) {
  const originalProvider =
    overpassPassportProvider.findPassportOfficesByArea;

  const originalQuery = pool.query;

  let databaseQueryCalls = 0;

  overpassPassportProvider.findPassportOfficesByArea = implementation;

  const queryMockInstalled = Reflect.set(
    pool,
    "query",
    async () => {
      databaseQueryCalls++;

      throw new Error(
        "PostgreSQL query must not execute during Passport area discovery.",
      );
    },
  );

  if (!queryMockInstalled) {
    overpassPassportProvider.findPassportOfficesByArea = originalProvider;
    throw new Error("Unable to install PostgreSQL query mock.");
  }

  return {
    get databaseQueryCalls() {
      return databaseQueryCalls;
    },

    restore() {
      overpassPassportProvider.findPassportOfficesByArea =
        originalProvider;

      Reflect.set(pool, "query", originalQuery);
    },
  };
}

test(
  "Passport area service forwards bilingual parameters, paginates, returns null distance, and skips PostgreSQL",
  async () => {
    const candidates = createCandidates();
    const receivedInputs: PassportAreaSearchInput[] = [];

    const mocks = installMocks(async (input) => {
      receivedInputs.push(input);
      return candidates;
    });

    try {
      // Page 1
      const pageOne = await GovernmentOfficesServices.findOfficesByArea({
        service: "PASSPORT",
        district: " Dhaka ",
        districtBn: " ঢাকা ",
        upazila: " Savar ",
        upazilaBn: " সাভার ",
        page: 1,
        limit: 2,
      });

      assert.equal(pageOne.service, "PASSPORT");

      assert.deepEqual(pageOne.area, {
        district: "Dhaka",
        upazila: "Savar",
      });

      assert.deepEqual(receivedInputs[0], {
        district: "Dhaka",
        districtBn: "ঢাকা",
        upazila: "Savar",
        upazilaBn: "সাভার",
      });

      assert.equal(pageOne.meta.page, 1);
      assert.equal(pageOne.meta.limit, 2);
      assert.equal(pageOne.meta.total, 5);
      assert.equal(pageOne.offices.length, 2);

      assert.deepEqual(
        pageOne.offices.map((office) => office.id),
        ["osm:node:1", "osm:node:2"],
      );

      assert.equal(
        pageOne.offices.every((office) => office.distanceKm === null),
        true,
      );

      assert.equal(pageOne.offices[0].source, "OpenStreetMap");

      // Page 2
      const pageTwo = await GovernmentOfficesServices.findOfficesByArea({
        service: "PASSPORT",
        district: "Dhaka",
        page: 2,
        limit: 2,
      });

      assert.equal(pageTwo.meta.page, 2);
      assert.equal(pageTwo.meta.limit, 2);
      assert.equal(pageTwo.meta.total, 5);
      assert.equal(pageTwo.offices.length, 2);

      assert.deepEqual(
        pageTwo.offices.map((office) => office.id),
        ["osm:node:3", "osm:node:4"],
      );

      assert.equal(
        pageTwo.offices.every((office) => office.distanceKm === null),
        true,
      );

      // Page 3
      const pageThree = await GovernmentOfficesServices.findOfficesByArea({
        service: "PASSPORT",
        district: "Dhaka",
        page: 3,
        limit: 2,
      });

      assert.equal(pageThree.meta.total, 5);
      assert.equal(pageThree.offices.length, 1);
      assert.equal(pageThree.offices[0].id, "osm:node:5");
      assert.equal(pageThree.offices[0].distanceKm, null);

      // Verify PostgreSQL was never queried.
      assert.equal(mocks.databaseQueryCalls, 0);

      // Provider should have been called for all three pages.
      assert.equal(receivedInputs.length, 3);
    } finally {
      mocks.restore();
    }
  },
);

test("Passport area service propagates Provider errors", async () => {
  const expectedError = new Error("Overpass area discovery failed.");

  const mocks = installMocks(async () => {
    throw expectedError;
  });

  try {
    await assert.rejects(
      GovernmentOfficesServices.findOfficesByArea({
        service: "PASSPORT",
        district: "Dhaka",
      }),
      (error: unknown) => error === expectedError,
    );

    assert.equal(mocks.databaseQueryCalls, 0);
  } finally {
    mocks.restore();
  }
});
