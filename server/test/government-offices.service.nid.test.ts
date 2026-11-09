import test from "node:test";
import assert from "node:assert/strict";
import { GovernmentOfficesServices } from "../src/app/modules/government-offices/government-offices.service";
import { overpassPassportProvider } from "../src/app/modules/government-offices/office-location-provider";
import config from "../src/config";
import AppError from "../src/app/errors/AppError";

const originalFetch = global.fetch;
const originalFindNearbyPassportCandidates = overpassPassportProvider.findNearbyPassportCandidates;
const originalFindPassportOfficesByArea = overpassPassportProvider.findPassportOfficesByArea;

function installFetchMock(handler: (url: string, init: RequestInit) => Response) {
  global.fetch = handler as unknown as typeof fetch;
  return () => {
    global.fetch = originalFetch;
  };
}

function stubPassportProviderToThrow() {
  overpassPassportProvider.findNearbyPassportCandidates = async () => {
    throw new Error("Passport provider must NOT be invoked for NID requests.");
  };
  overpassPassportProvider.findPassportOfficesByArea = async () => {
    throw new Error("Passport provider must NOT be invoked for NID requests.");
  };
}

function restorePassportProvider() {
  overpassPassportProvider.findNearbyPassportCandidates = originalFindNearbyPassportCandidates;
  overpassPassportProvider.findPassportOfficesByArea = originalFindPassportOfficesByArea;
}

test.beforeEach(() => {
  config.overpass.overpass_api_url = "https://overpass.example.com/interpreter";
  config.overpass.overpass_timeout_ms = "5000";
  stubPassportProviderToThrow();
});

test.afterEach(() => {
  global.fetch = originalFetch;
  restorePassportProvider();
});

const ecElements = [
  {
    type: "node",
    id: 11,
    lat: 23.812,
    lon: 90.412,
    tags: {
      name: "Dhaka District Election Commission Office",
      office: "government",
      "addr:full": "Dhaka, Dhaka Sadar, Bangladesh",
    },
  },
];

test("NID GPS request (slug nid-correction) reaches EC provider through dispatcher", async () => {
  const restore = installFetchMock(() =>
    new Response(JSON.stringify({ elements: ecElements }), { status: 200 }),
  );
  try {
    const result = await GovernmentOfficesServices.findNearbyOffices({
      service: "nid-correction",
      lat: 23.81,
      lng: 90.41,
      radiusKm: 5,
      page: 1,
      limit: 20,
    });

    assert.equal(result.service, "NID");
    assert.deepEqual(result.origin, { lat: 23.81, lng: 90.41 });
    assert.equal(result.radiusKm, 5);
    assert.equal(result.offices.length, 1);
    assert.equal(result.offices[0].name, "Dhaka District Election Commission Office");
    assert.equal(result.offices[0].source, "OpenStreetMap");
    assert.equal(result.offices[0].family, "ELECTION_COMMISSION");
    assert.equal(result.meta.total, 1);
  } finally {
    restore();
  }
});

test("NID GPS request works with service key NID directly", async () => {
  const restore = installFetchMock(() =>
    new Response(JSON.stringify({ elements: ecElements }), { status: 200 }),
  );
  try {
    const result = await GovernmentOfficesServices.findNearbyOffices({
      service: "NID",
      lat: 23.81,
      lng: 90.41,
      radiusKm: 10,
      page: 1,
      limit: 20,
    });
    assert.equal(result.service, "NID");
    assert.equal(result.offices.length, 1);
  } finally {
    restore();
  }
});

test("NID Area request (slug nid-correction) reaches EC provider through dispatcher", async () => {
  const restore = installFetchMock(() =>
    new Response(JSON.stringify({ elements: ecElements }), { status: 200 }),
  );
  try {
    const result = await GovernmentOfficesServices.findOfficesByArea({
      service: "nid-correction",
      district: "Dhaka",
      districtBn: "ঢাকা",
      upazila: "Sadar",
      upazilaBn: "সাদর",
      page: 1,
      limit: 20,
    });

    assert.equal(result.service, "NID");
    assert.deepEqual(result.area, { district: "Dhaka", upazila: "Sadar" });
    assert.equal(result.offices.length, 1);
    assert.equal(result.offices[0].district, "Dhaka");
    assert.equal(result.offices[0].upazila, "Sadar");
    assert.equal(result.offices[0].distanceKm, null);
    assert.equal(result.meta.total, 1);
  } finally {
    restore();
  }
});

test("NID GPS does not accidentally invoke the Passport provider", async () => {
  const restore = installFetchMock(() =>
    new Response(JSON.stringify({ elements: ecElements }), { status: 200 }),
  );
  try {
    const result = await GovernmentOfficesServices.findNearbyOffices({
      service: "nid-correction",
      lat: 23.81,
      lng: 90.41,
      radiusKm: 5,
    });
    assert.equal(result.offices.length, 1);
  } finally {
    restore();
  }
});

test("NID Area does not accidentally invoke the Passport provider", async () => {
  const restore = installFetchMock(() =>
    new Response(JSON.stringify({ elements: ecElements }), { status: 200 }),
  );
  try {
    const result = await GovernmentOfficesServices.findOfficesByArea({
      service: "nid-correction",
      district: "Dhaka",
    });
    assert.equal(result.offices.length, 1);
  } finally {
    restore();
  }
});

test("NID empty provider result is handled without becoming a failure", async () => {
  const restore = installFetchMock(() =>
    new Response(JSON.stringify({ elements: [] }), { status: 200 }),
  );
  try {
    const result = await GovernmentOfficesServices.findNearbyOffices({
      service: "nid-correction",
      lat: 23.81,
      lng: 90.41,
      radiusKm: 5,
    });
    assert.equal(result.service, "NID");
    assert.equal(result.offices.length, 0);
    assert.equal(result.meta.total, 0);
  } finally {
    restore();
  }
});

test("NID provider failure follows the dispatcher outcome contract", async () => {
  const restore = installFetchMock(() => {
    throw new Error("Overpass network failure");
  });
  try {
    await assert.rejects(
      () =>
        GovernmentOfficesServices.findNearbyOffices({
          service: "nid-correction",
          lat: 23.81,
          lng: 90.41,
          radiusKm: 5,
        }),
      (err: unknown) => err instanceof AppError && (err as AppError).statusCode === 503,
    );
  } finally {
    restore();
  }
});
