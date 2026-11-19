import assert from "node:assert/strict";
import test from "node:test";
import {
  isWithinBangladesh,
  haversineDistanceKm,
  BANGLADESH_BOUNDS,
} from "./distance";
import {
  resolveBangladeshLocation,
  searchNearestOfficesInMemory,
  VERIFIED_BANGLADESH_GOVERNMENT_OFFICES,
} from "./bangladesh-locations";
import { findNearestOffices } from "../AI/ai.tools";
import { GovernmentOfficesServices } from "./government-offices.service";

test("distance: coordinates within Bangladesh return true", () => {
  // Dhaka (center)
  assert.equal(isWithinBangladesh(23.8103, 90.4125), true);
  // Chattogram
  assert.equal(isWithinBangladesh(22.3569, 91.7832), true);
  // Sylhet
  assert.equal(isWithinBangladesh(24.8949, 91.8687), true);
  // Rajshahi
  assert.equal(isWithinBangladesh(24.3745, 88.6042), true);
  // Tetulia, Panchagarh (Northern tip)
  assert.equal(isWithinBangladesh(26.4950, 88.5550), true);
  // St. Martin's Island (Southern tip)
  assert.equal(isWithinBangladesh(20.6273, 92.3225), true);
});

test("distance: coordinates outside Bangladesh are strictly rejected", () => {
  // Kolkata, India
  assert.equal(isWithinBangladesh(22.5726, 88.3639), false);
  // New Delhi, India
  assert.equal(isWithinBangladesh(28.6139, 77.2090), false);
  // London, UK
  assert.equal(isWithinBangladesh(51.5074, -0.1278), false);
  // New York, USA
  assert.equal(isWithinBangladesh(40.7128, -74.0060), false);
  // Lat/Lng out of valid numeric ranges
  assert.equal(isWithinBangladesh(95, 90), false);
});

test("distance: haversine calculation is accurate within Bangladesh", () => {
  // Distance from Mirpur 10 (23.8069, 90.3687) to Agargaon Passport Office (23.7778, 90.3806)
  const d = haversineDistanceKm(
    { lat: 23.8069, lng: 90.3687 },
    { lat: 23.7778, lng: 90.3806 },
  );
  // Distance should be approximately 3.4 km
  assert.ok(d > 2.5 && d < 4.5, `Expected ~3.4 km, got ${d}`);
});

test("bangladesh-locations: resolves valid Bangladesh areas and districts", () => {
  const mirpur = resolveBangladeshLocation("Mirpur 10, Dhaka");
  assert.ok(mirpur);
  assert.equal(mirpur.district, "Dhaka");
  assert.equal(mirpur.isInsideBangladesh, true);

  const uttara = resolveBangladeshLocation("Sector 12, Uttara");
  assert.ok(uttara);
  assert.equal(uttara.district, "Dhaka");

  const sylhet = resolveBangladeshLocation("Sylhet Sadar");
  assert.ok(sylhet);
  assert.equal(sylhet.district, "Sylhet");
  assert.equal(sylhet.isInsideBangladesh, true);

  const ctg = resolveBangladeshLocation("Agrabad, Chittagong");
  assert.ok(ctg);
  assert.equal(ctg.district, "Chattogram");
  assert.equal(ctg.isInsideBangladesh, true);
});

test("bangladesh-locations: rejects foreign locations", () => {
  assert.equal(resolveBangladeshLocation("Kolkata, India"), null);
  assert.equal(resolveBangladeshLocation("London, UK"), null);
  assert.equal(resolveBangladeshLocation("New York"), null);
  assert.equal(resolveBangladeshLocation("Delhi"), null);
});

test("bangladesh-locations: searchNearestOfficesInMemory returns only Bangladesh offices sorted by distance", () => {
  // Search from Uttara, Dhaka
  const res = searchNearestOfficesInMemory({
    service: "PASSPORT",
    lat: 23.8745,
    lng: 90.3831,
    radiusKm: 50,
    limit: 5,
  });

  assert.ok(res.offices.length > 0);
  const firstOffice = res.offices[0]!;
  // Closest passport office should be Uttara passport office (0 km)
  assert.equal(firstOffice.name.includes("Uttara"), true);
  assert.ok(firstOffice.distanceKm < 1.0);

  // Every office returned must be within Bangladesh
  for (const office of res.offices) {
    assert.equal(isWithinBangladesh(office.latitude, office.longitude), true);
    assert.ok(office.distanceKm <= 50);
    assert.ok(office.directionsUrl.includes("google.com/maps/dir"));
  }

  // Sorted ascending by distance
  for (let i = 1; i < res.offices.length; i++) {
    const curr = res.offices[i]!;
    const prev = res.offices[i - 1]!;
    assert.ok(curr.distanceKm >= prev.distanceKm);
  }
});

test("bangladesh-locations: searchNearestOfficesInMemory rejects non-Bangladesh coordinates", () => {
  assert.throws(() => {
    searchNearestOfficesInMemory({
      service: "PASSPORT",
      lat: 51.5074,
      lng: -0.1278,
    });
  }, /outside Bangladesh/);
});

test("all verified offices in dataset are located strictly within Bangladesh", () => {
  for (const office of VERIFIED_BANGLADESH_GOVERNMENT_OFFICES) {
    assert.equal(
      isWithinBangladesh(office.latitude, office.longitude),
      true,
      `Office ${office.name} coordinates (${office.latitude}, ${office.longitude}) are outside Bangladesh`,
    );
  }
});

test("langchain tool: find_nearest_office returns verified Bangladesh offices", async () => {
  const resultRaw = await findNearestOffices.invoke({
    service: "PASSPORT",
    location: "Mirpur, Dhaka",
    radiusKm: 30,
    limit: 3,
  });

  const parsed = JSON.parse(typeof resultRaw === "string" ? resultRaw : JSON.stringify(resultRaw));
  assert.equal(parsed.success, true);
  assert.equal(parsed.inBangladesh, true);
  assert.equal(parsed.country, "Bangladesh");
  assert.ok(parsed.offices.length > 0);
  assert.ok(parsed.offices[0].distanceKm >= 0);
  assert.ok(parsed.offices[0].address);
  assert.ok(parsed.offices[0].directionsUrl);
});

test("langchain tool: find_nearest_office rejects coordinates outside Bangladesh", async () => {
  const resultRaw = await findNearestOffices.invoke({
    service: "PASSPORT",
    lat: 51.5074, // London
    lng: -0.1278,
  });

  const parsed = JSON.parse(typeof resultRaw === "string" ? resultRaw : JSON.stringify(resultRaw));
  assert.equal(parsed.success, false);
  assert.equal(parsed.inBangladesh, false);
  assert.ok(parsed.message.includes("outside Bangladesh"));
});

test("government-offices service: findNearbyOffices rejects coordinates outside Bangladesh", async () => {
  await assert.rejects(
    async () => {
      await GovernmentOfficesServices.findNearbyOffices({
        service: "PASSPORT",
        lat: 40.7128, // New York
        lng: -74.006,
      });
    },
    (err: any) => {
      return (
        err.message &&
        err.message.includes("outside Bangladesh") &&
        err.statusCode === 400
      );
    },
  );
});

test("government-offices service: findNearbyOffices succeeds with location name in Bangladesh", async () => {
  const res = await GovernmentOfficesServices.findNearbyOffices({
    service: "DRIVING_LICENCE",
    location: "Tejgaon, Dhaka",
    radiusKm: 25,
    limit: 3,
  });

  assert.equal(res.country, "Bangladesh");
  assert.ok(res.offices.length > 0);
  const first = res.offices[0]!;
  assert.equal(first.name.includes("Tejgaon"), true);
  assert.ok(first.distanceKm !== null && first.distanceKm < 2.0);
});
