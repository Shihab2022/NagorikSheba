import test from "node:test";
import assert from "node:assert/strict";
import { overpassPassportProvider } from "../src/app/modules/government-offices/office-location-provider";
import { _testUtils } from "../src/app/modules/government-offices/office-location-provider";

// Test state for isolation between tests
let cache;
let inFlight;
let lastFailureAt;

test.before(() => {
  cache = _testUtils.cache;
  inFlight = _testUtils.inFlight;
  lastFailureAt = _testUtils.lastFailureAt;
});

test.beforeEach(() => {
  if (cache) {
    cache.clear();
  }
  if (inFlight) {
    inFlight.clear();
  }
  if (lastFailureAt) {
    lastFailureAt.clear();
  }
});

test("parses nodes and ways", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response(
      JSON.stringify({
        elements: [
          { type: "node", lat: 22.34, lon: 91.81, tags: { name: "Passport Office" } },
          { type: "way", center: { lat: 22.35, lon: 91.82 }, tags: { name: "Way Passport Office" } },
        ],
      }),
      { status: 200 },
    );
  try {
    const result = await overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10);
    assert.equal(result.length, 2);
    assert.equal(result[0].verificationStatus, "candidate");
    assert.equal(result[0].serviceEligible, false);
  } finally {
    global.fetch = originalFetch;
  }
});

test("returns empty on malformed response", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({}), { status: 200 });
  try {
    const result = await overpassPassportProvider.findNearbyPassportCandidates(23.0, 90.0, 5);
    assert.deepEqual(result, []);
  } finally {
    global.fetch = originalFetch;
  }
});

test("successful non-empty response returns candidates", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response(
      JSON.stringify({
        elements: [
          { type: "node", id: 1, lat: 22.34, lon: 91.81, tags: { name: "Passport Office" } },
          { type: "way", id: 2, center: { lat: 22.35, lon: 91.82 }, tags: { name: "Way Passport Office" } },
        ],
      }),
      { status: 200 },
    );
  try {
    const result = await overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10);
    assert.equal(result.length, 2);
    assert.equal(result[0].verificationStatus, "candidate");
    assert.equal(result[0].serviceEligible, false);
  } finally {
    global.fetch = originalFetch;
  }
});

test("HTTP 502 throws instead of returning empty", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => new Response("Bad Gateway", { status: 502 });
  try {
    await assert.rejects(
      () => overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10),
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("HTTP 504 throws instead of returning empty", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => new Response("Gateway Timeout", { status: 504 });
  try {
    await assert.rejects(
      () => overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10),
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("invalid JSON throws instead of returning empty", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => new Response("not json", { status: 200 });
  try {
    await assert.rejects(
      () => overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10),
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("timeout throws instead of returning empty", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error("The operation was aborted due to timeout");
  };
  try {
    await assert.rejects(
      () => overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10),
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("network failure throws instead of returning empty", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error("fetch failed");
  };
  try {
    await assert.rejects(
      () => overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10),
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("failure cooldown throws temporary error", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => new Response("Bad Gateway", { status: 502 });
  try {
    await assert.rejects(
      overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10),
    );
  } catch {
    // expected
  }
  try {
    await assert.rejects(
      overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10),
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("in-flight deduplication works for concurrent requests", async () => {
  const originalFetch = global.fetch;
  let fetchCount = 0;
  global.fetch = async () => {
    fetchCount++;
    await new Promise((r) => setTimeout(r, 50));
    return new Response(
      JSON.stringify({
        elements: [
          { type: "node", id: 1, lat: 22.34, lon: 91.81, tags: { name: "Passport Office" } },
        ],
      }),
      { status: 200 },
    );
  };
  try {
    const [r1, r2] = await Promise.all([
      overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10),
      overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10),
    ]);
    assert.equal(fetchCount, 1, "fetch should only be called once");
    assert.equal(r1.length, 1);
    assert.equal(r2.length, 1);
  } finally {
    global.fetch = originalFetch;
  }
});
