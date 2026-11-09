import test from "node:test";
import assert from "node:assert/strict";
import { OfficeProviderRegistry } from "../src/app/modules/government-offices/provider-registry";
import { dispatchOfficeSearch } from "../src/app/modules/government-offices/provider-dispatch";
import {
  NormalizedOffice,
  OfficeFamily,
  OfficeServiceMode,
  ProviderSelectionPolicy,
  ServiceDefinition,
} from "../src/app/modules/government-offices/office-provider.types";

const baseOffice: NormalizedOffice = {
  id: "osm:node:1",
  name: "Dhaka District Election Commission Office",
  officeType: "DISTRICT_OFFICE",
  family: "ELECTION_COMMISSION",
  address: "Dhaka, Bangladesh",
  source: "OpenStreetMap",
  latitude: 23.81,
  longitude: 90.41,
  matchedArea: undefined,
  distanceKm: 1.5,
  phone: undefined,
  officialUrl: undefined,
};

function makeProvider(
  id: string,
  result: NormalizedOffice[],
  shouldThrow = false,
): OfficeProvider {
  return {
    providerId: id,
    family: "ELECTION_COMMISSION",
    supportedModes: ["gps", "area"],
    findNearby: async () => {
      if (shouldThrow) throw new Error(`provider ${id} failed`);
      return result;
    },
    findByArea: async () => {
      if (shouldThrow) throw new Error(`provider ${id} failed`);
      return result;
    },
  };
}

const nidDef: ServiceDefinition = {
  slug: "nid-correction",
  serviceKey: "NID",
  family: "ELECTION_COMMISSION",
  providerSelectionPolicy: "fallback" as ProviderSelectionPolicy,
  primaryProviderIds: ["primary"],
  stopOnEmpty: true,
};

const gpsParams = { lat: 23.81, lng: 90.41, radiusKm: 5 };
const areaParams = { district: "Dhaka", upazila: "Sadar" };

test("dispatcher returns success when primary provider yields offices", async () => {
  const registry = new OfficeProviderRegistry();
  registry.register(
    makeProvider("primary", [baseOffice, { ...baseOffice, id: "osm:node:2" }]),
  );

  const outcome = await dispatchOfficeSearch(
    { serviceDefinition: nidDef, mode: "gps", params: gpsParams },
    registry,
  );

  assert.equal(outcome.outcome, "success");
  assert.equal(outcome.offices.length, 2);
  assert.equal(outcome.executions.length, 1);
  assert.equal(outcome.executions[0].providerId, "primary");
  assert.equal(outcome.executions[0].success, true);
  assert.equal(outcome.executions[0].officeCount, 2);
  assert.equal(outcome.errors.length, 0);
});

test("dispatcher returns empty (not failure) when primary yields empty and stopOnEmpty", async () => {
  const registry = new OfficeProviderRegistry();
  registry.register(makeProvider("primary", []));

  const outcome = await dispatchOfficeSearch(
    { serviceDefinition: nidDef, mode: "gps", params: gpsParams },
    registry,
  );

  assert.equal(outcome.outcome, "empty");
  assert.equal(outcome.offices.length, 0);
  assert.equal(outcome.errors.length, 0);
});

test("dispatcher falls back to secondary provider when primary throws", async () => {
  const registry = new OfficeProviderRegistry();
  registry.register(makeProvider("primary", [], true));
  registry.register(makeProvider("secondary", [baseOffice]));

  const outcome = await dispatchOfficeSearch(
    { serviceDefinition: nidDef, mode: "area", params: areaParams },
    registry,
  );

  assert.equal(outcome.outcome, "success");
  assert.equal(outcome.offices.length, 1);
  assert.equal(outcome.executions.length, 2);
  assert.equal(outcome.executions[0].success, false);
  assert.equal(outcome.executions[1].success, true);
  assert.equal(outcome.errors.length, 1);
});

test("dispatcher returns complete-failure when all providers throw", async () => {
  const registry = new OfficeProviderRegistry();
  registry.register(makeProvider("primary", [], true));
  registry.register(makeProvider("secondary", [], true));

  const outcome = await dispatchOfficeSearch(
    { serviceDefinition: nidDef, mode: "gps", params: gpsParams },
    registry,
  );

  assert.equal(outcome.outcome, "complete-failure");
  assert.equal(outcome.offices.length, 0);
  assert.equal(outcome.executions.length, 2);
  assert.equal(outcome.errors.length, 2);
});

test("dispatcher returns missing-config when no providers registered for family", async () => {
  const registry = new OfficeProviderRegistry();
  const outcome = await dispatchOfficeSearch(
    { serviceDefinition: nidDef, mode: "gps", params: gpsParams },
    registry,
  );
  assert.equal(outcome.outcome, "missing-config");
  assert.equal(outcome.offices.length, 0);
});

test("dispatcher primary-only does not call secondary when primary yields offices", async () => {
  const registry = new OfficeProviderRegistry();
  registry.register(makeProvider("primary", [baseOffice]));
  const secondary = makeProvider("secondary", [], true);
  registry.register(secondary);

  const def: ServiceDefinition = { ...nidDef, providerSelectionPolicy: "primary-only" };
  const outcome = await dispatchOfficeSearch(
    { serviceDefinition: def, mode: "gps", params: gpsParams },
    registry,
  );
  assert.equal(outcome.outcome, "success");
  assert.equal(outcome.offices.length, 1);
  assert.equal(outcome.executions.length, 1);
});

test("dispatcher aggregate collects offices from all providers", async () => {
  const registry = new OfficeProviderRegistry();
  registry.register(makeProvider("primary", [baseOffice]));
  registry.register(makeProvider("secondary", [{ ...baseOffice, id: "osm:node:2" }]));

  const def: ServiceDefinition = { ...nidDef, providerSelectionPolicy: "aggregate" };
  const outcome = await dispatchOfficeSearch(
    { serviceDefinition: def, mode: "area", params: areaParams },
    registry,
  );
  assert.equal(outcome.outcome, "success");
  assert.equal(outcome.offices.length, 2);
  assert.equal(outcome.executions.length, 2);
});
