import assert from "node:assert/strict";
import test from "node:test";
import { haversineDistanceKm, isValidCoordinate } from "./distance";

test("calculates a realistic distance between two coordinates", () => {
  const distance = haversineDistanceKm(
    { lat: 23.8103, lng: 90.4125 },
    { lat: 23.7772, lng: 90.3775 },
  );
  assert.ok(distance > 4 && distance < 6);
});

test("rejects coordinates outside geographic bounds", () => {
  assert.equal(isValidCoordinate(91, 90), false);
  assert.equal(isValidCoordinate(23, 181), false);
  assert.equal(isValidCoordinate(23, 90), true);
});
