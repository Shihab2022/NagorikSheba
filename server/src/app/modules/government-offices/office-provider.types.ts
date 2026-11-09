export type OfficeFamily =
  | "ELECTION_COMMISSION"
  | "DEPARTMENT_OF_IMMIGRATION_AND_PASSPORTS"
  | "BRTA"
  | "LOCAL_GOVERNMENT"
  | "UNKNOWN_FAMILY";

export type OfficeServiceKey = "NID" | "PASSPORT" | "BIRTH_REGISTRATION" | "DRIVING_LICENCE";

export type OfficeServiceMode = "gps" | "area";

export type OfficeSource = "OpenStreetMap" | "OfficialECS" | "PostgreSQL" | "Manual";

export type OfficeType =
  | "REGIONAL_OFFICE"
  | "DISTRICT_OFFICE"
  | "UPAZILA_OFFICE"
  | "THANA_OFFICE"
  | "DIVISIONAL_OFFICE"
  | "UNKNOWN";

export interface MatchedArea {
  district?: string;
  upazila?: string;
  mode: "gps" | "area"; // search context — never legal jurisdiction
}

export interface NormalizedOffice {
  id: string;
  name: string;
  officeType: OfficeType;
  family: OfficeFamily;
  address?: string;
  phone?: string;
  officialUrl?: string;
  latitude: number | null;   // nullable — no invented coordinates
  longitude: number | null;
  source: OfficeSource;      // internal attribution only
  matchedArea?: MatchedArea; // where the result came from (context only)
  distanceKm: number | null; // GPS driving distance; null for area results
}

export interface OfficeProvider {
  providerId: string;          // stable unique ID (e.g. "election-commission-osm")
  family: OfficeFamily;
  supportedModes: OfficeServiceMode[];
  findNearby(params: { lat: number; lng: number; radiusKm: number }): Promise<NormalizedOffice[]>;
  findByArea(params: { district: string; districtBn?: string; upazila?: string; upazilaBn?: string }): Promise<NormalizedOffice[]>;
  listAreas?(params: { serviceKey: OfficeServiceKey }): Promise<{ district: string; upazila?: string }[]>;
}

export interface ServiceDefinition {
  slug: string;                        // canonical routing identity (exact existing slug)
  serviceKey: OfficeServiceKey;
  family: OfficeFamily;
  officeTypes?: OfficeType[];
  preferredModes: OfficeServiceMode[];
  requiresJurisdictionCheck?: boolean;
  providerSelectionPolicy: ProviderSelectionPolicy;
  primaryProviderIds?: string[];
  stopOnEmpty?: boolean;
}

export type ProviderSelectionPolicy =
  | "primary-only"
  | "fallback"
  | "aggregate";

export interface ProviderExecutionRecord {
  providerId: string;   // stable unique identity
  success: boolean;
  officeCount: number;  // number of offices returned (0 = empty success)
  cause?: unknown;      // if !success
}

export interface DispatchOutcome {
  outcome: "success" | "empty" | "partial" | "complete-failure" | "missing-config";
  offices: NormalizedOffice[];
  executions: ProviderExecutionRecord[];
  errors: ProviderError[];
}

export interface ProviderError {
  kind: "provider-error";
  providerId: string;   // stable unique identifier (not family name)
  cause: unknown;
}