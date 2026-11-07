import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildGoogleMapsDirectionsUrl } from "../lib/nearby";

describe("buildGoogleMapsDirectionsUrl", () => {
  it("builds URL with coordinates as destination for Rajshahi Divisional Passport and Visa Office", () => {
    const url = buildGoogleMapsDirectionsUrl(
      { lat: 24.3, lng: 90.0 },
      { lat: 24.3822676, lng: 88.608159 },
    );
    assert.ok(url);
    const urlObj = new URL(url);
    assert.equal(urlObj.origin, "https://www.google.com");
    assert.equal(urlObj.pathname, "/maps/dir/");
    assert.equal(urlObj.searchParams.get("api"), "1");
    assert.equal(urlObj.searchParams.get("travelmode"), "driving");
    assert.equal(urlObj.searchParams.get("origin"), "24.300000,90.000000");
    assert.equal(urlObj.searchParams.get("destination"), "24.382268,88.608159");
  });

  it("builds URL with coordinates as destination for Natore Regional Passport Office", () => {
    const url = buildGoogleMapsDirectionsUrl(
      { lat: 24.3, lng: 90.0 },
      { lat: 24.4122594, lng: 89.0005231 },
    );
    assert.ok(url);
    const urlObj = new URL(url);
    assert.equal(urlObj.searchParams.get("destination"), "24.412259,89.000523");
  });

  it("builds URL with coordinates as destination for Chapai Nawabganj Regional Passport Office", () => {
    const url = buildGoogleMapsDirectionsUrl(
      { lat: 24.3, lng: 90.0 },
      { lat: 24.581319, lng: 88.2890345 },
    );
    assert.ok(url);
    const urlObj = new URL(url);
    assert.equal(urlObj.searchParams.get("destination"), "24.581319,88.289034");
  });

  it("validates origin coordinates", () => {
    const url = buildGoogleMapsDirectionsUrl(
      { lat: 24.3, lng: 90.0 },
      { lat: 24.3822676, lng: 88.608159 },
    );
    assert.ok(url);
    const urlObj = new URL(url);
    assert.equal(urlObj.searchParams.get("origin"), "24.300000,90.000000");
  });

  it("validates destination coordinates are finite", () => {
    const url = buildGoogleMapsDirectionsUrl(
      { lat: 24.3, lng: 90.0 },
      { lat: NaN, lng: 88.608159 },
    );
    assert.strictEqual(url, null);
  });

  it("validates destination coordinates within bounds", () => {
    const url = buildGoogleMapsDirectionsUrl(
      { lat: 24.3, lng: 90.0 },
      { lat: 91, lng: 88.608159 },
    );
    assert.strictEqual(url, null);
  });

  it("preserves origin coordinates when destination has name/address", () => {
    const url = buildGoogleMapsDirectionsUrl(
      { area: "Rajshahi, Rajshahi, Bangladesh" },
      {
        name: "Divisional Passport and Visa Office",
        address: "Rajshahi Sadar Upazila, Rajshahi, Bangladesh",
        district: "Rajshahi",
        lat: 24.3822676,
        lng: 88.608159,
      },
    );
    assert.ok(url);
    const urlObj = new URL(url);
    assert.equal(
      urlObj.searchParams.get("origin"),
      "Rajshahi, Rajshahi, Bangladesh",
    );
    assert.equal(urlObj.searchParams.get("destination"), "24.382268,88.608159");
  });

  it("uses coordinates as primary destination", () => {
    const url = buildGoogleMapsDirectionsUrl(
      { lat: 24.3, lng: 90.0 },
      { lat: 24.581319, lng: 88.2890345 },
    );
    assert.ok(url);
    const urlObj = new URL(url);
    assert.equal(urlObj.searchParams.get("destination"), "24.581319,88.289034");
  });

  it("returns null when destination coordinates are missing", () => {
    const url = buildGoogleMapsDirectionsUrl(
      { lat: 24.3, lng: 90.0 },
      { lat: undefined as unknown as number, lng: 88.608159 },
    );
    assert.strictEqual(url, null);
  });

  it("returns null when destination coordinates are out of range", () => {
    const url = buildGoogleMapsDirectionsUrl(
      { lat: 24.3, lng: 90.0 },
      { lat: 91, lng: 88.608159 },
    );
    assert.strictEqual(url, null);
  });
});