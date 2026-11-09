/** EC matching logic with independent testable functions. */

/** 1. Positive EC name matching (no \b for Bangla) --- */

const BENGALI_EC_TERMS: string[] = [
  "নির্বাচন",        // election
  "আঞ্চলিক নির্বাচন", // regional election
  "উপজেলা নির্বাচন",  // upazila election
  "জেলা নির্বাচন",   // district election
  "থানা নির্বাচন",   // thana election
];

const ENGLISH_EC_PHRASES: string[] = [
  "election commission",
  "election office",
  "regional election",
  "district election",
  "upazila election",
  "thana election",
];

const ENGLISH_EC_PATTERN: RegExp = new RegExp(
  ENGLISH_EC_PHRASES.map((t) => t.split(/\s+/).join("\\s+")).join("|"),
  "i",
);

/** Returns true if the name has positive EC relevance. */
export function hasPositiveEcRelevance(rawName: string): boolean {
  const name = rawName.trim();
  if (!name) return false;
  if (ENGLISH_EC_PATTERN.test(name)) return true;
  return BENGALI_EC_TERMS.some((term) => name.includes(term));
}

/** 2. Explicit name exclusions --- */

const NAME_EXCLUSIONS: string[] = [
  "server station",
  "election godown",
  "কমিশনার",               // Deputy Commissioner's Office
  "প্রশিক্ষণ কেন্দ্র",        // Regional Training Centre
];

function matchesNameExclusion(rawName: string): boolean {
  const name = rawName.toLowerCase().trim();
  return NAME_EXCLUSIONS.some((p) => name.includes(p));
}

/** Commercial entity detection. */
function isCommercialEcLike(rawName: string): boolean {
  const name = rawName.toLowerCase().trim();
  const hasElection = /(election)/i.test(name);
  const commercialMarkers = /(enterprise|m\/s|ltd|company|pvt)/i;
  return hasElection && commercialMarkers.test(name);
}

/** OSM tag validation — independent checks for office and government. */
export function evaluateTags(tags: Record<string, string>): "include" | "exclude" {
  const office = tags.office ?? "";
  const government = tags.government ?? "";
  const shop = tags.shop ?? "";

  const EXCLUSION_OFFICE_TAGS = new Set(["political_party", "telecommunication"]);
  if (EXCLUSION_OFFICE_TAGS.has(office)) return "exclude";

  const VALID_OFFICE_TAGS = new Set(["government", "yes", "administrative", "public_service"]);
  if (VALID_OFFICE_TAGS.has(office)) {
    if (shop && /electronics|hardware/i.test(shop)) return "exclude";
    return "include";
  }

  const VALID_GOVERNMENT_TAGS = new Set(["public_service", "administrative", "election_commission"]);
  if (VALID_GOVERNMENT_TAGS.has(government)) {
    if (shop && /electronics|hardware/i.test(shop)) return "exclude";
    return "include";
  }

  return "exclude";
}

/** Combined EC record classifier using the four-stage pipeline. */
export function classifyEcRecord(tags: Record<string, string>): "include" | "exclude" {
  const name = [tags.name, tags["name:en"], tags["name:bn"]]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (!name) return "exclude";

  if (!hasPositiveEcRelevance(name)) return "exclude";
  if (matchesNameExclusion(name)) return "exclude";
  if (isCommercialEcLike(name)) return "exclude";
  const tagResult = evaluateTags(tags);
  if (tagResult === "exclude") return "exclude";

  return "include";
}
