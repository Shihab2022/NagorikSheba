/**
 * Shared domain types for NagorikSheba / নাগরিক সেবা.
 *
 * All data consumed by the UI is MOCK/DEMO data until a backend is
 * connected. The shapes below mirror what a real API would return so
 * swapping mock data for live endpoints later requires no UI changes.
 */

export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Lucide icon name (kept as a string so data stays serializable). */
  icon: string;
  serviceCount: number;
  /** Sample sub-services shown on the category card. */
  samples: string[];
  /** Which subtle accent tint the card uses. */
  accent: "green" | "red";
};

export type GovernmentService = {
  id: string;
  name: string;
  slug: string;
  /** Category slug this service belongs to. */
  category: string;
  /** Owning ministry / department display name. */
  department: string;
  description: string;
  longDescription?: string;
  eligibility?: string[];
  requiredDocuments?: string[];
  fee?: string;
  processingTime?: string;
  /** Ordered steps of the application procedure. */
  steps?: string[];
  authority?: string;
  officeLocations?: string[];
  /** Absolute URL of the official government portal. Never a fake URL. */
  officialUrl?: string;
  /** ISO date the entry was last reviewed by an editor. */
  lastVerifiedAt?: string;
  /** Whether the service can be completed online end-to-end. */
  isOnline: boolean;
  /** Whether the applicant must visit an office in person. */
  requiresOfficeVisit: boolean;
  popularity: number;
  icon: string;
  /** Relative publish/update label used on cards, e.g. "Updated 2 days ago". */
  updatedLabel?: string;
};

export type OfficeType =
  | "passport"
  | "land"
  | "brta"
  | "police"
  | "hospital"
  | "tax"
  | "city-corporation"
  | "municipality"
  | "union-parishad"
  | "court";

export type GovernmentOffice = {
  id: string;
  name: string;
  type: OfficeType;
  typeLabel: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  services: string[];
  openingHours: string;
  contact: string;
  /** Official website when one exists for the office type. */
  officialUrl?: string;
  /** Latitude/longitude placeholder for a future map integration. */
  coordinates?: { lat: number; lng: number };
  icon: string;
};

export type NoticeCategory =
  | "nid"
  | "passport"
  | "tax"
  | "education"
  | "land"
  | "transport"
  | "health";

export type GovernmentNotice = {
  id: string;
  title: string;
  category: NoticeCategory;
  department: string;
  /** ISO date string. */
  publishedAt: string;
  summary: string;
  body: string[];
  officialUrl?: string;
  readMinutes: number;
};

export type FaqItem = {
  id: string;
  /** Bilingual copy — bn is the default language, en is the alternative. */
  question: { bn: string; en: string };
  answer: { bn: string; en: string };
  category: "general" | "services" | "account" | "data";
};

export type SearchResultType = "service" | "office" | "notice" | "document";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  badge?: string;
};

/* ------------------------------------------------------------------
   Nearby government offices feature
   ------------------------------------------------------------------ */

/** Office service keys accepted by the backend nearby endpoint. */
export type OfficeServiceKey =
  | "NID"
  | "PASSPORT"
  | "BIRTH_REGISTRATION"
  | "DRIVING_LICENCE";

/** A government office returned by the nearby/by-area API, with the
 *  approximate straight-line distance from the user (km) when available. */
export type NearbyOffice = {
  id: string;
  name: string;
  /** Backend office type enum, e.g. ELECTION_COMMISSION. */
  officeType: string;
  address: string;
  division?: string | null;
  district: string;
  upazila: string | null;
  latitude: number;
  longitude: number;
  /** Verified phone number, when the office publishes one. */
  phone: string | null;
  officialUrl: string | null;
  /** ISO date the record was last verified against an official source. */
  lastVerifiedAt: string | null;
  /** Straight-line distance in km; null when searching by area instead of GPS. */
  distanceKm: number | null;
};

export type OfficeArea = { district: string; upazila: string };

/** Envelope returned by the nearby / by-area endpoints. */
export type NearbyOfficesResult = {
  service: OfficeServiceKey;
  origin?: { lat: number; lng: number };
  area?: { district: string; upazila: string | null };
  radiusKm?: number;
  offices: NearbyOffice[];
};

/** Where the user's "location" on the nearby page comes from. */
export type NearbyOrigin =
  | { mode: "gps"; lat: number; lng: number }
  | { mode: "area"; district: string; upazila: string | null };
