/**
 * Bangladesh Administrative Areas Dataset
 *
 * Source: Bangladesh National Portal (bangladesh.gov.bd)
 * - District List: https://bangladesh.gov.bd/views/district-list/District-List/
 * - Upazila List: https://bangladesh.gov.bd/site/view/upazila-list/
 * Retrieved: 2026-11-06
 *
 * Contains all 8 divisions, 64 districts, and 503 upazilas of Bangladesh.
 * Canonical English names are used as API query parameter values.
 * Bengali names are used for display labels in the Bengali interface.
 *
 * District names follow the 2018 official spelling standard:
 * Bogura (not Bogra), Barishal (not Barisal), Jashore (not Jessore),
 * Chattogram (not Chittagong), Cumilla (not Comilla).
 *
 * Upazila count notes:
 * - Original dataset (retrieved 2026-11-06) contained 500 upazilas from the
 *   Bangladesh National Portal.
 * - Per Bangladesh Bureau of Statistics (BSS) gazette notification dated Nov 3, 2026,
 *   three additional upazilas were formed by bifurcating existing upazilas:
 *   1. Fatikchhari North (Chattogram district)
 *   2. Bangla (Cumilla district)
 *   3. Dakshin Gafargaon (Mymensingh district)
 * - The 5 upazilas approved on May 7, 2026 (Mokamtala, Matamuhuri, Ruhia, Bhulli,
 *   Chandraganj) are already included, bringing the total from 495 to 500.
 * - Total official upazila count: 503 (per BSS gazette notification Nov 3, 2026).
 *
 * Bengali names are used for display labels in the Bengali interface.
 * English canonical values are used as API query parameter values.
 * District names follow the 2018 official spelling standard:
 * Bogura (not Bogra), Barishal (not Barisal), Jashore (not Jessore),
 * Chattogram (not Chittagong), Cumilla (not Comilla).
 *
 * Known limitation: Bengali names for the 3 upazilas approved July 1, 2026
 * (Fatikchhari North, Bangla, Dakshin Gafargaon) are pending verification
 * against authoritative government records.
 */
import { BARISAL_DIVISION } from "./bangladesh-areas-barisal";
import { CHITTAGONG_DIVISION } from "./bangladesh-areas-chittagong";
import { DHAKA_DIVISION } from "./bangladesh-areas-dhaka";
import { KHULNA_DIVISION } from "./bangladesh-areas-khulna";
import { MYMENSINGH_DIVISION } from "./bangladesh-areas-mymensingh";
import { RAJSHAHI_DIVISION } from "./bangladesh-areas-rajshahi";
import { RANGPUR_DIVISION } from "./bangladesh-areas-rangpur";
import { SYLHET_DIVISION } from "./bangladesh-areas-sylhet";

export type Upazila = {
  /** Canonical English name, used as API query parameter value */
  en: string;
  /** Bengali name, used as display label in Bengali interface */
  bn: string;
};

export type District = {
  /** Canonical English name, used as API query parameter value */
  en: string;
  /** Bengali name, used as display label in Bengali interface */
  bn: string;
  /** Upazilas belonging to this district */
  upazilas: Upazila[];
};

export type Division = {
  /** Canonical English name, used as API query parameter value */
  en: string;
  /** Bengali name, used as display label in Bengali interface */
  bn: string;
  /** Districts belonging to this division */
  districts: District[];
};

/**
 * Total number of districts in Bangladesh
 */
export const DISTRICT_COUNT = 64;

/**
 * Total number of upazilas in Bangladesh
 */
export const UPAZILA_COUNT = 503;

/**
 * Get a district by its canonical English name
 */
export function getDistrictByName(
  districtName: string
): District | undefined {
  return ALL_DISTRICTS.find((d) => d.en === districtName);
}

/**
 * Get all upazilas for a given district name
 */
export function getUpazilasForDistrict(
  districtName: string
): Upazila[] {
  const district = getDistrictByName(districtName);
  return district ? district.upazilas : [];
}

/**
 * Get division name for a given district
 */
export function getDivisionForDistrict(
  districtName: string
): string | undefined {
  const division = ALL_DIVISIONS.find((d) =>
    d.districts.some((district) => district.en === districtName)
  );
  return division ? division.en : undefined;
}

/**
 * All divisions of Bangladesh
 */
export const ALL_DIVISIONS: Division[] = [
  BARISAL_DIVISION,
  CHITTAGONG_DIVISION,
  DHAKA_DIVISION,
  KHULNA_DIVISION,
  MYMENSINGH_DIVISION,
  RAJSHAHI_DIVISION,
  RANGPUR_DIVISION,
  SYLHET_DIVISION,
];

/**
 * All districts flattened into a single array
 */
export const ALL_DISTRICTS: District[] = ALL_DIVISIONS.flatMap(
  (division) => division.districts
);