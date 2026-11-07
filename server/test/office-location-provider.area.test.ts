import test from "node:test";
import assert from "node:assert/strict";

import {
  overpassPassportProvider,
  _testUtils,
  type OfficeCandidate,
} from "../src/app/modules/government-offices/office-location-provider";

// Test state for isolation between tests
// Use _testUtils directly - no untyped variable declarations needed

// Reset provider state before every test to prevent cross-test interference.
test.beforeEach(() => {
  _testUtils.cache.clear();
  _testUtils.inFlight.clear();
  _testUtils.lastFailureAt.clear();
});

test.describe("findPassportOfficesByArea - district only", () => {
  test("district-only boundary resolution", async () => {
    const originalFetch = global.fetch;
    let requestCount = 0;

    global.fetch = async () => {
      requestCount++;

      // Request 1: Resolve Dhaka District boundary
      if (requestCount === 1) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "relation",
                id: 9514619,
                tags: {
                  boundary: "administrative",
                  admin_level: "5",
                  name: "Dhaka",
                  "name:en": "Dhaka",
                  "name:bn": "ঢাকা",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      // Request 2: Discover Passport offices inside the District polygon
      if (requestCount === 2) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "count",
                id: 0,
                tags: {
                  areas: "1",
                  nodes: "1",
                  ways: "0",
                  relations: "0",
                  total: "1",
                },
              },
              {
                type: "node",
                id: 2,
                lat: 23.685,
                lon: 90.356,
                tags: {
                  name: "Passport Office Dhaka",
                  office: "government",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      throw new Error(`Unexpected Overpass request: ${requestCount}`);
    };

    try {
      const result = await overpassPassportProvider.findPassportOfficesByArea({
        district: "Dhaka",
      });

      assert.equal(requestCount, 2);
      assert.equal(result.length, 1);
      assert.equal(result[0].name, "Passport Office Dhaka");
      assert.equal(result[0].latitude, 23.685);
      assert.equal(result[0].longitude, 90.356);
    } finally {
      global.fetch = originalFetch;
    }
  });
});

test.describe("findPassportOfficesByArea - valid area with zero offices", () => {
  test("valid area with zero Passport offices returns empty array", async () => {
    const originalFetch = global.fetch;
    let requestCount = 0;

    global.fetch = async () => {
      requestCount++;

      // Request 1: Resolve District boundary
      if (requestCount === 1) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "relation",
                id: 2,
                tags: {
                  boundary: "administrative",
                  admin_level: "5",
                  name: "SomeDistrict",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      // Request 2: Valid polygon, but no Passport offices
      if (requestCount === 2) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "count",
                id: 0,
                tags: {
                  areas: "1",
                  nodes: "0",
                  ways: "0",
                  relations: "0",
                  total: "0",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      throw new Error(`Unexpected Overpass request: ${requestCount}`);
    };

    try {
      const result = await overpassPassportProvider.findPassportOfficesByArea({
        district: "SomeDistrict",
      });

      assert.equal(requestCount, 2);
      assert.equal(result.length, 0);
    } finally {
      global.fetch = originalFetch;
    }
  });
});

test.describe("findPassportOfficesByArea - filtering and duplicates", () => {
  test("Passport keyword filtering with Bengali", async () => {
    const originalFetch = global.fetch;
    let requestCount = 0;

    global.fetch = async () => {
      requestCount++;

      // Request 1: District boundary
      if (requestCount === 1) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "relation",
                id: 101,
                tags: {
                  boundary: "administrative",
                  admin_level: "5",
                  name: "Dhaka",
                  "name:bn": "ঢাকা",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      // Request 2: Passport office candidates
      if (requestCount === 2) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "count",
                id: 0,
                tags: {
                  areas: "1",
                  nodes: "3",
                  ways: "0",
                  relations: "0",
                  total: "3",
                },
              },
              {
                type: "node",
                id: 2,
                lat: 23.685,
                lon: 90.356,
                tags: {
                  name: "Passport Office Dhaka",
                  office: "government",
                },
              },
              {
                type: "node",
                id: 3,
                lat: 23.686,
                lon: 90.357,
                tags: {
                  "name:bn": "পাসপোর্ট অফিস ঢাকা",
                  office: "government",
                },
              },
              {
                type: "node",
                id: 4,
                lat: 23.687,
                lon: 90.358,
                tags: {
                  name: "General Hospital",
                  office: "government",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      throw new Error(`Unexpected Overpass request: ${requestCount}`);
    };

    try {
      const result = await overpassPassportProvider.findPassportOfficesByArea({
        district: "Dhaka",
      });

      assert.equal(requestCount, 2);
      assert.equal(result.length, 2);

      const names = result.map((office) => office.name);

      assert.ok(names.includes("Passport Office Dhaka"));
      assert.ok(names.includes("পাসপোর্ট অফিস ঢাকা"));
      assert.ok(!names.includes("General Hospital"));
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("duplicate OSM objects removed", async () => {
    const originalFetch = global.fetch;
    let requestCount = 0;

    global.fetch = async () => {
      requestCount++;

      // Request 1: District boundary
      if (requestCount === 1) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "relation",
                id: 102,
                tags: {
                  boundary: "administrative",
                  admin_level: "5",
                  name: "Dhaka",
                  "name:bn": "ঢাকা",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      // Request 2: Office candidates with duplicate OSM node
      if (requestCount === 2) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "count",
                id: 0,
                tags: {
                  areas: "1",
                  nodes: "2",
                  ways: "1",
                  relations: "0",
                  total: "3",
                },
              },
              {
                type: "node",
                id: 1,
                lat: 23.685,
                lon: 90.356,
                tags: {
                  name: "Passport Office Dhaka",
                  office: "government",
                },
              },
              {
                type: "node",
                id: 1,
                lat: 23.685,
                lon: 90.356,
                tags: {
                  name: "Passport Office Dhaka",
                  office: "government",
                },
              },
              {
                type: "way",
                id: 2,
                center: {
                  lat: 23.685,
                  lon: 90.356,
                },
                tags: {
                  name: "Passport Office Dhaka",
                  office: "government",
                },
              },
              {
                type: "node",
                id: 3,
                lat: 23.686,
                lon: 90.357,
                tags: {
                  name: "General Hospital",
                  office: "government",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      throw new Error(`Unexpected Overpass request: ${requestCount}`);
    };

    try {
      const result = await overpassPassportProvider.findPassportOfficesByArea({
        district: "Dhaka",
      });

      assert.equal(requestCount, 2);
      assert.equal(result.length, 2);

      const objectKeys = result
        .map((office) => `${office.osmType}:${office.osmId}`)
        .sort();

      assert.deepEqual(objectKeys, ["node:1", "way:2"]);
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("invalid coordinates filtered out", async () => {
    const originalFetch = global.fetch;
    let requestCount = 0;

    global.fetch = async () => {
      requestCount++;

      // Request 1: District boundary
      if (requestCount === 1) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "relation",
                id: 103,
                tags: {
                  boundary: "administrative",
                  admin_level: "5",
                  name: "Dhaka",
                  "name:bn": "ঢাকা",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      // Request 2: Valid and invalid office coordinates
      if (requestCount === 2) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "count",
                id: 0,
                tags: {
                  areas: "1",
                  nodes: "3",
                  ways: "0",
                  relations: "0",
                  total: "3",
                },
              },
              {
                type: "node",
                id: 1,
                lat: 23.685,
                lon: 90.356,
                tags: {
                  name: "Passport Office Dhaka",
                },
              },
              {
                type: "node",
                id: 2,
                lat: null,
                lon: null,
                tags: {
                  name: "Passport Office Invalid",
                },
              },
              {
                type: "node",
                id: 3,
                lat: 999,
                lon: 999,
                tags: {
                  name: "Passport Office Out of Range",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      throw new Error(`Unexpected Overpass request: ${requestCount}`);
    };

    try {
      const result = await overpassPassportProvider.findPassportOfficesByArea({
        district: "Dhaka",
      });

      assert.equal(requestCount, 2);
      assert.equal(result.length, 1);
      assert.equal(result[0].name, "Passport Office Dhaka");
      assert.equal(result[0].latitude, 23.685);
      assert.equal(result[0].longitude, 90.356);
    } finally {
      global.fetch = originalFetch;
    }
  });
});


test.describe("findPassportOfficesByArea - district plus upazila", () => {
  test("district plus upazila boundary resolution", async () => {
    const originalFetch = global.fetch;
    let requestCount = 0;

    global.fetch = async () => {
      requestCount++;

      // Request 1: Resolve Dhaka District boundary
      if (requestCount === 1) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "relation",
                id: 9514619,
                tags: {
                  boundary: "administrative",
                  admin_level: "5",
                  name: "Dhaka",
                  "name:bn": "ঢাকা",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      // Request 2: Resolve Savar Upazila inside Dhaka District
      if (requestCount === 2) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "count",
                id: 0,
                tags: {
                  areas: "1",
                  nodes: "0",
                  ways: "0",
                  relations: "0",
                  total: "0",
                },
              },
              {
                type: "relation",
                id: 87654321,
                tags: {
                  boundary: "administrative",
                  admin_level: "6",
                  name: "Savar",
                  "name:bn": "সাভার",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      // Request 3: Discover Passport offices inside the Upazila polygon
      if (requestCount === 3) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "count",
                id: 0,
                tags: {
                  areas: "1",
                  nodes: "1",
                  ways: "0",
                  relations: "0",
                  total: "1",
                },
              },
              {
                type: "node",
                id: 20,
                lat: 23.858,
                lon: 90.262,
                tags: {
                  name: "Passport Office Savar",
                  office: "government",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      throw new Error(`Unexpected Overpass request: ${requestCount}`);
    };

    try {
      const result = await overpassPassportProvider.findPassportOfficesByArea({
        district: "Dhaka",
        upazila: "Savar",
      });

      assert.equal(requestCount, 3);
      assert.equal(result.length, 1);
      assert.equal(result[0].name, "Passport Office Savar");
      assert.equal(result[0].latitude, 23.858);
      assert.equal(result[0].longitude, 90.262);
    } finally {
      global.fetch = originalFetch;
    }
  });
});


test.describe("findPassportOfficesByArea - Bengali boundary matching", () => {
  test("Bengali District boundary matching using districtBn", async () => {
    const originalFetch = global.fetch;
    let requestCount = 0;

    global.fetch = async () => {
      requestCount++;

      // Request 1: Resolve District boundary matched only via Bengali name
      if (requestCount === 1) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "relation",
                id: 9514619,
                tags: {
                  boundary: "administrative",
                  admin_level: "5",
                  "name:bn": "ঢাকা",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      // Request 2: Discover Passport offices inside the District polygon
      if (requestCount === 2) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "count",
                id: 0,
                tags: {
                  areas: "1",
                  nodes: "1",
                  ways: "0",
                  relations: "0",
                  total: "1",
                },
              },
              {
                type: "node",
                id: 30,
                lat: 23.685,
                lon: 90.356,
                tags: {
                  name: "Passport Office Dhaka",
                  office: "government",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      throw new Error(`Unexpected Overpass request: ${requestCount}`);
    };

    try {
      const result = await overpassPassportProvider.findPassportOfficesByArea({
        district: "UnknownDistrict",
        districtBn: "ঢাকা",
      });

      assert.equal(requestCount, 2);
      assert.equal(result.length, 1);
      assert.equal(result[0].name, "Passport Office Dhaka");
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("Bengali Upazila boundary matching using upazilaBn", async () => {
    const originalFetch = global.fetch;
    let requestCount = 0;

    global.fetch = async () => {
      requestCount++;

      // Request 1: Resolve Dhaka District boundary
      if (requestCount === 1) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "relation",
                id: 9514619,
                tags: {
                  boundary: "administrative",
                  admin_level: "5",
                  name: "Dhaka",
                  "name:bn": "ঢাকা",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      // Request 2: Resolve Upazila matched only via Bengali name
      if (requestCount === 2) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "count",
                id: 0,
                tags: {
                  areas: "1",
                  nodes: "0",
                  ways: "0",
                  relations: "0",
                  total: "0",
                },
              },
              {
                type: "relation",
                id: 87654321,
                tags: {
                  boundary: "administrative",
                  admin_level: "6",
                  "name:bn": "সাভার",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      // Request 3: Discover Passport offices inside the Upazila polygon
      if (requestCount === 3) {
        return new Response(
          JSON.stringify({
            elements: [
              {
                type: "count",
                id: 0,
                tags: {
                  areas: "1",
                  nodes: "1",
                  ways: "0",
                  relations: "0",
                  total: "1",
                },
              },
              {
                type: "node",
                id: 40,
                lat: 23.858,
                lon: 90.262,
                tags: {
                  name: "Passport Office Savar",
                  office: "government",
                },
              },
            ],
          }),
          { status: 200 },
        );
      }

      throw new Error(`Unexpected Overpass request: ${requestCount}`);
    };

    try {
      const result = await overpassPassportProvider.findPassportOfficesByArea({
        district: "Dhaka",
        upazila: "UnknownUpazila",
        upazilaBn: "সাভার",
      });

      assert.equal(requestCount, 3);
      assert.equal(result.length, 1);
      assert.equal(result[0].name, "Passport Office Savar");
    } finally {
      global.fetch = originalFetch;
    }
  });
});


test.describe("findPassportOfficesByArea - district boundary errors", () => {
  test("District boundary not found returns expected error", async () => {
    const originalFetch = global.fetch;

    global.fetch = async () => {
      return new Response(
        JSON.stringify({
          elements: [],
        }),
        { status: 200 },
      );
    };

    try {
      await assert.rejects(
        () =>
          overpassPassportProvider.findPassportOfficesByArea({
            district: "NonExistentDistrict",
          }),
        (err: Error & { statusCode: number }) => {
          assert.equal(err.statusCode, 404);
          assert.ok(
            err.message.includes("OSM district boundary was not found"),
          );
          return true;
        },
      );
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("Ambiguous District boundary returns expected error", async () => {
    const originalFetch = global.fetch;

    global.fetch = async () => {
      return new Response(
        JSON.stringify({
          elements: [
            {
              type: "relation",
              id: 1001,
              tags: {
                boundary: "administrative",
                admin_level: "5",
                name: "Dhaka",
              },
            },
            {
              type: "relation",
              id: 1002,
              tags: {
                boundary: "administrative",
                admin_level: "5",
                name: "Dhaka",
              },
            },
          ],
        }),
        { status: 200 },
      );
    };

    try {
      await assert.rejects(
        () =>
          overpassPassportProvider.findPassportOfficesByArea({
            district: "Dhaka",
          }),
        (err: Error & { statusCode: number }) => {
          assert.equal(err.statusCode, 409);
          assert.ok(
            err.message.includes(
              "Multiple OSM boundaries match the selected district",
            ),
          );
          return true;
        },
      );
    } finally {
      global.fetch = originalFetch;
    }
  });
});

test.describe("findPassportOfficesByArea - Overpass API failure", () => {
  test("Overpass API failure propagates correctly", async () => {
    const originalFetch = global.fetch;

    global.fetch = async () => {
      throw new Error("fetch failed: network error");
    };

    try {
      await assert.rejects(
        () =>
          overpassPassportProvider.findPassportOfficesByArea({
            district: "Dhaka",
          }),
        (err: Error & { statusCode: number }) => {
          assert.equal(err.statusCode, 503);
          assert.ok(
            err.message.includes(
              "Unable to connect to Overpass area discovery service",
            ),
          );
          return true;
        },
      );
    } finally {
      global.fetch = originalFetch;
    }
  });
});
