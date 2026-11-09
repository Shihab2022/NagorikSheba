import {
  OfficeFamily,
  OfficeServiceKey,
  OfficeServiceMode,
  OfficeType,
  ProviderSelectionPolicy,
  ServiceDefinition,
} from "./office-provider.types";

export const ELECTION_COMMISSION_OSM_PROVIDER_ID = "election-commission-osm";

export const NID_SERVICE_SLUG = "nid-correction";

export const NID_SERVICE_DEFINITION: ServiceDefinition = {
  slug: NID_SERVICE_SLUG,
  serviceKey: "NID",
  family: "ELECTION_COMMISSION",
  officeTypes: ["DISTRICT_OFFICE", "UPAZILA_OFFICE"] as OfficeType[],
  preferredModes: ["gps", "area"] as OfficeServiceMode[],
  providerSelectionPolicy: "fallback" as ProviderSelectionPolicy,
  primaryProviderIds: [ELECTION_COMMISSION_OSM_PROVIDER_ID],
  stopOnEmpty: true,
};

const SERVICE_DEFINITIONS: ServiceDefinition[] = [NID_SERVICE_DEFINITION];

/** Resolve a service definition by its canonical slug (e.g. "nid-correction"). */
export function getServiceDefinitionBySlug(
  slug: string,
): ServiceDefinition | undefined {
  return SERVICE_DEFINITIONS.find(
    (definition) =>
      definition.slug === String(slug ?? "").trim().toLowerCase(),
  );
}

/** Resolve a service definition by its service key (e.g. "NID"). */
export function getServiceDefinitionByServiceKey(
  serviceKey: OfficeServiceKey,
): ServiceDefinition | undefined {
  return SERVICE_DEFINITIONS.find(
    (definition) => definition.serviceKey === serviceKey,
  );
}

export function getAllServiceDefinitions(): ServiceDefinition[] {
  return SERVICE_DEFINITIONS.slice();
}
