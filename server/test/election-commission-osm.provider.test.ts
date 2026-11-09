import test from "node:test";
import assert from "node:assert/strict";
import config from "../src/config";
import {
  electionCommissionOsmProvider,
  ELECTION_COMMISSION_OSM_PROVIDER_ID,
} from "../src/app/modules/government-offices/election-commission-osm.provider";
import { NormalizedOffice } from "../src/app/modules/government-offices/office-provider.types";

const originalFetch = global.fetch;

function installFetchMock(handler: (url: string, init: RequestInit) => Response) {
  global.fetch = handler as unknown as typeof fetch;
  return () => {
    global.fetch = originalFetch;
  };
}

test.beforeEach(() => {
  // Point the provider at a deterministic test Overpass endpoint.
  config.overpass.overpass_api_url = "https://overpass.example.com/interpreter";
  config.overpass.overpass_timeout_ms = "5000";
});

test.afterEach(() => {
  global.fetch = originalFetch;
});

test("providerId and family are stable", () => {
  assert.equal(electionCommissionOsmProvider.providerId, "election-commission-osm");
  assert.equal(electionCommissionOsmProvider.family, "ELECTION_COMMISSION");
  assert.deepEqual(electionCommissionOsmProvider.supportedModes, ["gps", "area"]);
});

test("findNearby invokes Overpass and normalizes EC offices", async () => {
  const restore = installFetchMock(() =>
    new Response(
      JSON.stringify({
        elements: [
          {
            type: "node",
            id: 101,
            lat: 23.812,
            lon: 90.412,
            tags: {
              name: "Dhaka District Election Commission Office",
              office: "government",
              "addr:full": "Dhaka, Bangladesh",
              phone: "+880-2-xxx",
            },
          },
          {
            type: "way",
            id: 202,
            center: { lat: 23.813, lon: 90.413 },
            tags: {
              name: "Dhaka Government Hospital",
              office: "government",
            },
          },
        ],
      }),
      { status: 200 },
    ),
  );
  try {
    const result = await electionCommissionOsmProvider.findNearby({
      lat: 23.81,
      lng: 90.41,
      radiusKm: 5,
    });

    assert.equal(result.length, 1);
    const office = result[0];
    assert.equal(office.id, "osm:node:101");
    assert.equal(office.name, "Dhaka District Election Commission Office");
    assert.equal(office.family, "ELECTION_COMMISSION");
    assert.equal(office.officeType, "UNKNOWN");
    assert.equal(office.source, "OpenStreetMap");
    assert.equal(office.latitude, 23.812);
    assert.equal(office.longitude, 90.412);
    assert.equal(office.address, "Dhaka, Bangladesh");
    assert.equal(office.phone, "+880-2-xxx");
    assert.equal(office.matchedArea, undefined);
    assert.equal(typeof office.distanceKm, "number");
    assert.ok(office.distanceKm! > 0);
  } finally {
    restore();
  }
});

test("findNearby returns empty for invalid coordinates", async () => {
  const result = await electionCommissionOsmProvider.findNearby({
    lat: 91,
    lng: 90.41,
    radiusKm: 5,
  });
  assert.deepEqual(result, []);
});

test("findNearby returns empty when Overpass returns no elements", async () => {
  const restore = installFetchMock(
    () => new Response(JSON.stringify({ elements: [] }), { status: 200 }),
  );
  try {
    const result = await electionCommissionOsmProvider.findNearby({
      lat: 23.81,
      lng: 90.41,
      radiusKm: 5,
    });
    assert.deepEqual(result, []);
  } finally {
    restore();
  }
});

test("findByArea returns EC offices matching the district", async () => {
  const restore = installFetchMock(() =>
    new Response(
      JSON.stringify({
        elements: [
          {
            type: "node",
            id: 303,
            lat: 23.85,
            lon: 90.39,
            tags: {
              name: "Sadar Upazila Election Office",
              office: "government",
              district: "Dhaka",
            },
          },
          {
            type: "node",
            id: 304,
            lat: 24.0,
            lon: 90.0,
            tags: {
              name: "Some Other Office",
              office: "government",
              district: "Chittagong",
            },
          },
        ],
      }),
      { status: 200 },
    ),
  );
  try {
    const result = await electionCommissionOsmProvider.findByArea({
      district: "Dhaka",
      upazila: "Sadar",
    });

    assert.equal(result.length, 1);
    assert.equal(result[0].id, "osm:node:303");
    assert.equal(result[0].matchedArea?.district, "Dhaka");
    assert.equal(result[0].matchedArea?.upazila, "Sadar");
    assert.equal(result[0].matchedArea?.mode, "area");
    assert.equal(result[0].distanceKm, null);
  } finally {
    restore();
  }
});

test("findByArea throws when district is missing", async () => {
  await assert.rejects(
    () => electionCommissionOsmProvider.findByArea({ district: "" }),
    (err: unknown) => (err as Error).message === "District is required.",
  );
});

test("findByArea propagates Overpass failures", async () => {
  const restore = installFetchMock(() => {
    throw new Error("network down");
  });
  try {
    await assert.rejects(
      () =>
        electionCommissionOsmProvider.findByArea({ district: "Dhaka" }),
      (err: unknown) => (err as Error).message === "network down",
    );
  } finally {
    restore();
  }
});

test("provider id constant matches registered provider", () => {
  assert.equal(ELECTION_COMMISSION_OSM_PROVIDER_ID, "election-commission-osm");
});
