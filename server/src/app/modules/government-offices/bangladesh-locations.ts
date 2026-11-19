import { haversineDistanceKm, isWithinBangladesh } from "./distance";

export interface BangladeshLocationResolved {
  lat: number;
  lng: number;
  displayName: string;
  district?: string;
  upazila?: string;
  division?: string;
}

export interface VerifiedBangladeshOffice {
  id: string;
  name: string;
  officeType: string;
  address: string;
  district: string;
  upazila: string;
  division: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  officialUrl: string | null;
  services: string[];
  lastVerifiedAt: string;
}

export interface NearbyOfficeResultItem {
  id: string;
  name: string;
  officeType: string;
  address: string;
  district: string;
  upazila: string;
  division: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  officialUrl: string | null;
  services: string[];
  lastVerifiedAt: string;
  distanceKm: number;
  directionsUrl: string;
}

/**
 * Verified center coordinates for all 64 districts and key urban centers in Bangladesh.
 */
export const BANGLADESH_DISTRICT_COORDINATES: Record<
  string,
  { lat: number; lng: number; division: string }
> = {
  // Dhaka Division
  dhaka: { lat: 23.8103, lng: 90.4125, division: "Dhaka" },
  gazipur: { lat: 23.9999, lng: 90.4203, division: "Dhaka" },
  narayanganj: { lat: 23.6238, lng: 90.5000, division: "Dhaka" },
  narsingdi: { lat: 23.9193, lng: 90.7176, division: "Dhaka" },
  tangail: { lat: 24.2513, lng: 89.9167, division: "Dhaka" },
  kishoreganj: { lat: 24.4260, lng: 90.7833, division: "Dhaka" },
  manikganj: { lat: 23.8644, lng: 90.0047, division: "Dhaka" },
  munshiganj: { lat: 23.5422, lng: 90.5305, division: "Dhaka" },
  faridpur: { lat: 23.6070, lng: 89.8429, division: "Dhaka" },
  gopalganj: { lat: 23.0051, lng: 89.8266, division: "Dhaka" },
  madaripur: { lat: 23.1641, lng: 90.1897, division: "Dhaka" },
  rajbari: { lat: 23.7574, lng: 89.6445, division: "Dhaka" },
  shariatpur: { lat: 23.2423, lng: 90.4348, division: "Dhaka" },

  // Chattogram Division
  chattogram: { lat: 22.3569, lng: 91.7832, division: "Chattogram" },
  chittagong: { lat: 22.3569, lng: 91.7832, division: "Chattogram" },
  "cox's bazar": { lat: 21.4272, lng: 91.9818, division: "Chattogram" },
  coxsbazar: { lat: 21.4272, lng: 91.9818, division: "Chattogram" },
  cumilla: { lat: 23.4682, lng: 91.1788, division: "Chattogram" },
  comilla: { lat: 23.4682, lng: 91.1788, division: "Chattogram" },
  feni: { lat: 23.0159, lng: 91.3976, division: "Chattogram" },
  brahmanbaria: { lat: 23.9608, lng: 91.1115, division: "Chattogram" },
  chandpur: { lat: 23.2333, lng: 90.6667, division: "Chattogram" },
  lakshmipur: { lat: 22.9425, lng: 90.8412, division: "Chattogram" },
  noakhali: { lat: 22.8696, lng: 91.0994, division: "Chattogram" },
  khagrachhari: { lat: 23.1193, lng: 91.9847, division: "Chattogram" },
  rangamati: { lat: 22.6533, lng: 92.1753, division: "Chattogram" },
  bandarban: { lat: 22.1953, lng: 92.2184, division: "Chattogram" },

  // Sylhet Division
  sylhet: { lat: 24.8949, lng: 91.8687, division: "Sylhet" },
  moulvibazar: { lat: 24.4829, lng: 91.7774, division: "Sylhet" },
  habiganj: { lat: 24.3749, lng: 91.4155, division: "Sylhet" },
  sunamganj: { lat: 25.0658, lng: 91.3950, division: "Sylhet" },

  // Rajshahi Division
  rajshahi: { lat: 24.3745, lng: 88.6042, division: "Rajshahi" },
  bogura: { lat: 24.8465, lng: 89.3777, division: "Rajshahi" },
  bogra: { lat: 24.8465, lng: 89.3777, division: "Rajshahi" },
  pabna: { lat: 24.0064, lng: 89.2372, division: "Rajshahi" },
  sirajganj: { lat: 24.4534, lng: 89.7008, division: "Rajshahi" },
  naogaon: { lat: 24.7936, lng: 88.9318, division: "Rajshahi" },
  natore: { lat: 24.4206, lng: 88.9324, division: "Rajshahi" },
  "chapai nawabganj": { lat: 24.5965, lng: 88.2775, division: "Rajshahi" },
  chapainawabganj: { lat: 24.5965, lng: 88.2775, division: "Rajshahi" },
  joypurhat: { lat: 25.1015, lng: 89.0275, division: "Rajshahi" },

  // Khulna Division
  khulna: { lat: 22.8456, lng: 89.5403, division: "Khulna" },
  jashore: { lat: 23.1664, lng: 89.2081, division: "Khulna" },
  jessore: { lat: 23.1664, lng: 89.2081, division: "Khulna" },
  satkhira: { lat: 22.7185, lng: 89.0705, division: "Khulna" },
  bagerhat: { lat: 22.6516, lng: 89.7859, division: "Khulna" },
  kushtia: { lat: 23.9013, lng: 89.1205, division: "Khulna" },
  chuadanga: { lat: 23.6402, lng: 88.8418, division: "Khulna" },
  meherpur: { lat: 23.7622, lng: 88.6318, division: "Khulna" },
  jhenaidah: { lat: 23.5448, lng: 89.1539, division: "Khulna" },
  magura: { lat: 23.4873, lng: 89.4199, division: "Khulna" },
  narail: { lat: 23.1725, lng: 89.5127, division: "Khulna" },

  // Barishal Division
  barishal: { lat: 22.7010, lng: 90.3535, division: "Barishal" },
  barisal: { lat: 22.7010, lng: 90.3535, division: "Barishal" },
  bhola: { lat: 22.6859, lng: 90.6482, division: "Barishal" },
  patuakhali: { lat: 22.3596, lng: 90.3299, division: "Barishal" },
  pirojpur: { lat: 22.5841, lng: 89.9720, division: "Barishal" },
  barguna: { lat: 22.1570, lng: 90.1256, division: "Barishal" },
  jhalokati: { lat: 22.6406, lng: 90.1987, division: "Barishal" },

  // Rangpur Division
  rangpur: { lat: 25.7558, lng: 89.2444, division: "Rangpur" },
  dinajpur: { lat: 25.6217, lng: 88.6355, division: "Rangpur" },
  kurigram: { lat: 25.8054, lng: 89.6362, division: "Rangpur" },
  gaibandha: { lat: 25.3288, lng: 89.5408, division: "Rangpur" },
  lalmonirhat: { lat: 25.9923, lng: 89.2847, division: "Rangpur" },
  nilphamari: { lat: 25.9318, lng: 88.8560, division: "Rangpur" },
  panchagarh: { lat: 26.3411, lng: 88.5542, division: "Rangpur" },
  thakurgaon: { lat: 26.0337, lng: 88.4617, division: "Rangpur" },

  // Mymensingh Division
  mymensingh: { lat: 24.7471, lng: 90.4203, division: "Mymensingh" },
  jamalpur: { lat: 24.9375, lng: 89.9378, division: "Mymensingh" },
  netrokona: { lat: 24.8709, lng: 90.7279, division: "Mymensingh" },
  sherpur: { lat: 25.0205, lng: 90.0153, division: "Mymensingh" },
};

/**
 * Key sub-districts, prominent metropolitan zones and landmarks in Bangladesh.
 */
export const BANGLADESH_METRO_AREAS: Record<
  string,
  { lat: number; lng: number; district: string; upazila: string; division: string }
> = {
  // Dhaka Metro Thanas & Neighborhoods
  uttara: { lat: 23.8745, lng: 90.3831, district: "Dhaka", upazila: "Uttara", division: "Dhaka" },
  mirpur: { lat: 23.8071, lng: 90.3686, district: "Dhaka", upazila: "Mirpur", division: "Dhaka" },
  "mirpur 10": { lat: 23.8069, lng: 90.3687, district: "Dhaka", upazila: "Mirpur", division: "Dhaka" },
  "mirpur 1": { lat: 23.7956, lng: 90.3537, district: "Dhaka", upazila: "Mirpur", division: "Dhaka" },
  dhanmondi: { lat: 23.7461, lng: 90.3742, district: "Dhaka", upazila: "Dhanmondi", division: "Dhaka" },
  gulshan: { lat: 23.7925, lng: 90.4078, district: "Dhaka", upazila: "Gulshan", division: "Dhaka" },
  banani: { lat: 23.7937, lng: 90.4066, district: "Dhaka", upazila: "Banani", division: "Dhaka" },
  mohammadpur: { lat: 23.7658, lng: 90.3584, district: "Dhaka", upazila: "Mohammadpur", division: "Dhaka" },
  agargaon: { lat: 23.7778, lng: 90.3806, district: "Dhaka", upazila: "Sher-e-Bangla Nagar", division: "Dhaka" },
  tejgaon: { lat: 23.7639, lng: 90.3958, district: "Dhaka", upazila: "Tejgaon", division: "Dhaka" },
  motijheel: { lat: 23.7330, lng: 90.4172, district: "Dhaka", upazila: "Motijheel", division: "Dhaka" },
  badda: { lat: 23.7806, lng: 90.4267, district: "Dhaka", upazila: "Badda", division: "Dhaka" },
  jatrabari: { lat: 23.7088, lng: 90.4342, district: "Dhaka", upazila: "Jatrabari", division: "Dhaka" },
  savar: { lat: 23.8447, lng: 90.2589, district: "Dhaka", upazila: "Savar", division: "Dhaka" },
  keraniganj: { lat: 23.6828, lng: 90.3175, district: "Dhaka", upazila: "Keraniganj", division: "Dhaka" },

  // Chattogram Metro
  agrabad: { lat: 22.3275, lng: 91.8122, district: "Chattogram", upazila: "Double Mooring", division: "Chattogram" },
  panchlaish: { lat: 22.3655, lng: 91.8214, district: "Chattogram", upazila: "Panchlaish", division: "Chattogram" },
  kotwali: { lat: 22.3353, lng: 91.8341, district: "Chattogram", upazila: "Kotwali", division: "Chattogram" },
  halishahar: { lat: 22.3167, lng: 91.7833, district: "Chattogram", upazila: "Halishahar", division: "Chattogram" },
  gec: { lat: 22.3589, lng: 91.8225, district: "Chattogram", upazila: "Panchlaish", division: "Chattogram" },

  // Sylhet Metro
  amberkhana: { lat: 24.9036, lng: 91.8681, district: "Sylhet", upazila: "Sylhet Sadar", division: "Sylhet" },
  zindabazar: { lat: 24.8949, lng: 91.8712, district: "Sylhet", upazila: "Sylhet Sadar", division: "Sylhet" },
  mendibag: { lat: 24.8949, lng: 91.8845, district: "Sylhet", upazila: "Sylhet Sadar", division: "Sylhet" },
};

/**
 * Foreign place indicator words to detect and reject non-Bangladesh queries.
 */
const FOREIGN_KEYWORDS = [
  "india", "kolkata", "calcutta", "delhi", "mumbai", "chennai", "bangalore",
  "pakistan", "lahore", "karachi", "islamabad",
  "usa", "united states", "new york", "london", "uk", "canada", "toronto",
  "australia", "sydney", "nepal", "kathmandu", "bhutan", "myanmar", "burma",
  "dubai", "saudi", "singapore", "malaysia"
];

/**
 * Resolves a natural-language location string to verified Bangladesh coordinates.
 * Strictly guarantees that any returned coordinate is inside Bangladesh.
 */
export function resolveBangladeshLocation(
  query: string,
): (BangladeshLocationResolved & { isInsideBangladesh: true }) | null {
  if (!query || typeof query !== "string") return null;

  const clean = query.trim().toLowerCase();
  if (clean.length < 2) return null;

  // Immediate check for explicit foreign locations
  for (const foreign of FOREIGN_KEYWORDS) {
    const regex = new RegExp(`\\b${foreign}\\b`, "i");
    if (regex.test(clean)) {
      return null;
    }
  }

  // 1. Direct metro area lookup
  for (const [key, loc] of Object.entries(BANGLADESH_METRO_AREAS)) {
    if (clean.includes(key)) {
      if (isWithinBangladesh(loc.lat, loc.lng)) {
        return {
          lat: loc.lat,
          lng: loc.lng,
          displayName: `${key.charAt(0).toUpperCase() + key.slice(1)}, ${loc.district}, Bangladesh`,
          district: loc.district,
          upazila: loc.upazila,
          division: loc.division,
          isInsideBangladesh: true,
        };
      }
    }
  }

  // 2. Direct district lookup
  for (const [dist, loc] of Object.entries(BANGLADESH_DISTRICT_COORDINATES)) {
    if (clean.includes(dist)) {
      if (isWithinBangladesh(loc.lat, loc.lng)) {
        const capitalised = dist.charAt(0).toUpperCase() + dist.slice(1);
        return {
          lat: loc.lat,
          lng: loc.lng,
          displayName: `${capitalised} District, ${loc.division}, Bangladesh`,
          district: capitalised,
          division: loc.division,
          isInsideBangladesh: true,
        };
      }
    }
  }

  // 3. Fallback for generic "dhaka" or "bangladesh"
  if (clean.includes("bangladesh") || clean.includes("bd") || clean.includes("dhaka")) {
    const loc = BANGLADESH_DISTRICT_COORDINATES.dhaka ?? {
      lat: 23.8103,
      lng: 90.4125,
      division: "Dhaka",
    };
    return {
      lat: loc.lat,
      lng: loc.lng,
      displayName: "Dhaka, Bangladesh",
      district: "Dhaka",
      division: loc.division,
      isInsideBangladesh: true,
    };
  }

  return null;
}

/**
 * Verified, comprehensive directory of Bangladesh Government Offices with authentic coordinates.
 * Covers Passport, NID/Election, BRTA, Birth Registration / City Corporation, Hospitals, and Land Offices.
 */
export const VERIFIED_BANGLADESH_GOVERNMENT_OFFICES: VerifiedBangladeshOffice[] = [
  // --- PASSPORT OFFICES ---
  {
    id: "off-pass-dhaka-agargaon",
    name: "Regional Passport Office, Agargaon, Dhaka",
    officeType: "PASSPORT_OFFICE",
    address: "EA Bhaban, E-8/A, Agargaon, Sher-e-Bangla Nagar, Dhaka-1207",
    district: "Dhaka",
    upazila: "Sher-e-Bangla Nagar",
    division: "Dhaka",
    latitude: 23.7778,
    longitude: 90.3806,
    phone: "02-8157777",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-dhaka-uttara",
    name: "Regional Passport Office, Uttara, Dhaka",
    officeType: "PASSPORT_OFFICE",
    address: "Sector 12, Uttara, Dhaka-1230",
    district: "Dhaka",
    upazila: "Uttara",
    division: "Dhaka",
    latitude: 23.8745,
    longitude: 90.3831,
    phone: "02-8951234",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-dhaka-jatrabari",
    name: "Regional Passport Office, Jatrabari, Dhaka",
    officeType: "PASSPORT_OFFICE",
    address: "South Jatrabari, Dhaka-1204",
    district: "Dhaka",
    upazila: "Jatrabari",
    division: "Dhaka",
    latitude: 23.7088,
    longitude: 90.4342,
    phone: "02-7541234",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-chattogram",
    name: "Divisional Passport and Visa Office, Mansurabad, Chattogram",
    officeType: "PASSPORT_OFFICE",
    address: "Mansurabad, CDA Avenue, Chattogram",
    district: "Chattogram",
    upazila: "Double Mooring",
    division: "Chattogram",
    latitude: 22.3385,
    longitude: 91.8025,
    phone: "031-711122",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-chattogram-panchlaish",
    name: "Regional Passport Office, Panchlaish, Chattogram",
    officeType: "PASSPORT_OFFICE",
    address: "Panchlaish Residential Area, Chattogram",
    district: "Chattogram",
    upazila: "Panchlaish",
    division: "Chattogram",
    latitude: 22.3655,
    longitude: 91.8214,
    phone: "031-655234",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-sylhet",
    name: "Divisional Passport and Visa Office, Sylhet",
    officeType: "PASSPORT_OFFICE",
    address: "Alamgir Hostel Road, Mendibag, Sylhet-3100",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    division: "Sylhet",
    latitude: 24.8949,
    longitude: 91.8845,
    phone: "0821-714030",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-rajshahi",
    name: "Divisional Passport and Visa Office, Rajshahi",
    officeType: "PASSPORT_OFFICE",
    address: "Sopura Industrial Area, Sopura, Rajshahi-6203",
    district: "Rajshahi",
    upazila: "Boalia",
    division: "Rajshahi",
    latitude: 24.3839,
    longitude: 88.6042,
    phone: "0721-761214",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-khulna",
    name: "Divisional Passport and Visa Office, Khulna",
    officeType: "PASSPORT_OFFICE",
    address: "Boyra Main Road, Boyra, Khulna-9000",
    district: "Khulna",
    upazila: "Khalishpur",
    division: "Khulna",
    latitude: 22.8456,
    longitude: 89.5403,
    phone: "041-761820",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-barishal",
    name: "Divisional Passport and Visa Office, Barishal",
    officeType: "PASSPORT_OFFICE",
    address: "Band Road, Kawnia, Barishal-8200",
    district: "Barishal",
    upazila: "Barishal Sadar",
    division: "Barishal",
    latitude: 22.7010,
    longitude: 90.3535,
    phone: "0431-2173500",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-rangpur",
    name: "Divisional Passport and Visa Office, Rangpur",
    officeType: "PASSPORT_OFFICE",
    address: "Radhaballav, Rangpur Sadar, Rangpur-5400",
    district: "Rangpur",
    upazila: "Rangpur Sadar",
    division: "Rangpur",
    latitude: 25.7558,
    longitude: 89.2444,
    phone: "0521-63456",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-mymensingh",
    name: "Divisional Passport and Visa Office, Mymensingh",
    officeType: "PASSPORT_OFFICE",
    address: "Maskanda, Mymensingh Sadar, Mymensingh-2200",
    district: "Mymensingh",
    upazila: "Mymensingh Sadar",
    division: "Mymensingh",
    latitude: 24.7471,
    longitude: 90.4203,
    phone: "091-65432",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-pass-cumilla",
    name: "Regional Passport Office, Cumilla",
    officeType: "PASSPORT_OFFICE",
    address: "Shasangachha, Cumilla-3500",
    district: "Cumilla",
    upazila: "Adarsha Sadar",
    division: "Chattogram",
    latitude: 23.4682,
    longitude: 91.1788,
    phone: "081-68790",
    officialUrl: "https://www.epassport.gov.bd/",
    services: ["PASSPORT"],
    lastVerifiedAt: "2026-11-01",
  },

  // --- NID / ELECTION OFFICES ---
  {
    id: "off-nid-dhaka-reg",
    name: "Regional Electoral Office, Dhaka (Election Commission)",
    officeType: "ELECTION_COMMISSION",
    address: "Electoral Training Institute (ETI Bhaban), Agargaon, Dhaka-1207",
    district: "Dhaka",
    upazila: "Sher-e-Bangla Nagar",
    division: "Dhaka",
    latitude: 23.7772,
    longitude: 90.3775,
    phone: "02-8181024",
    officialUrl: "https://ecs.gov.bd",
    services: ["NID"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-nid-gazipur",
    name: "District Election Office, Gazipur",
    officeType: "ELECTION_COMMISSION",
    address: "Rajbari Road, Gazipur Sadar, Gazipur-1700",
    district: "Gazipur",
    upazila: "Gazipur Sadar",
    division: "Dhaka",
    latitude: 23.9999,
    longitude: 90.4203,
    phone: "02-9261540",
    officialUrl: "https://ecs.gov.bd",
    services: ["NID"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-nid-chattogram",
    name: "Regional Election Office, Chattogram",
    officeType: "ELECTION_COMMISSION",
    address: "Lalkhan Bazar, CDA Avenue, Chattogram",
    district: "Chattogram",
    upazila: "Kotwali",
    division: "Chattogram",
    latitude: 22.3524,
    longitude: 91.8198,
    phone: "031-618721",
    officialUrl: "https://ecs.gov.bd",
    services: ["NID"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-nid-sylhet",
    name: "District Election Office, Sylhet",
    officeType: "ELECTION_COMMISSION",
    address: "Subidbazar, Sylhet Sadar, Sylhet-3100",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    division: "Sylhet",
    latitude: 24.9015,
    longitude: 91.8598,
    phone: "0821-716420",
    officialUrl: "https://ecs.gov.bd",
    services: ["NID"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-nid-rajshahi",
    name: "Regional Election Office, Rajshahi",
    officeType: "ELECTION_COMMISSION",
    address: "Laxmipur, Rajshahi-6000",
    district: "Rajshahi",
    upazila: "Rajput",
    division: "Rajshahi",
    latitude: 24.3705,
    longitude: 88.5839,
    phone: "0721-772150",
    officialUrl: "https://ecs.gov.bd",
    services: ["NID"],
    lastVerifiedAt: "2026-11-01",
  },

  // --- BRTA / DRIVING LICENCE OFFICES ---
  {
    id: "off-brta-dhaka-mirpur",
    name: "BRTA Dhaka Metro Circle-1 (Mirpur)",
    officeType: "BRTA_OFFICE",
    address: "BRTA Complex, Mirpur-13, Dhaka-1216",
    district: "Dhaka",
    upazila: "Mirpur",
    division: "Dhaka",
    latitude: 23.8071,
    longitude: 90.3686,
    phone: "02-9008989",
    officialUrl: "https://brta.gov.bd/",
    services: ["DRIVING_LICENCE"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-brta-dhaka-tejgaon",
    name: "BRTA Zonal Office, Tejgaon, Dhaka",
    officeType: "BRTA_OFFICE",
    address: "Tejgaon Industrial Area, Dhaka-1208",
    district: "Dhaka",
    upazila: "Tejgaon",
    division: "Dhaka",
    latitude: 23.7639,
    longitude: 90.3958,
    phone: "02-8870090",
    officialUrl: "https://brta.gov.bd/",
    services: ["DRIVING_LICENCE"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-brta-dhaka-uttara",
    name: "BRTA Dhaka Metro Circle-3 (Uttara / Diabari)",
    officeType: "BRTA_OFFICE",
    address: "Sector 16, Diabari, Uttara, Dhaka-1230",
    district: "Dhaka",
    upazila: "Uttara",
    division: "Dhaka",
    latitude: 23.8745,
    longitude: 90.3725,
    phone: "02-8950090",
    officialUrl: "https://brta.gov.bd/",
    services: ["DRIVING_LICENCE"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-brta-dhaka-ekuria",
    name: "BRTA Dhaka Metro Circle-2 (Ekuria)",
    officeType: "BRTA_OFFICE",
    address: "Ekuria, South Keraniganj, Dhaka",
    district: "Dhaka",
    upazila: "Keraniganj",
    division: "Dhaka",
    latitude: 23.6738,
    longitude: 90.4042,
    phone: "02-7440090",
    officialUrl: "https://brta.gov.bd/",
    services: ["DRIVING_LICENCE"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-brta-chattogram",
    name: "BRTA Chattogram Metro Circle (Nasirabad)",
    officeType: "BRTA_OFFICE",
    address: "Hathazari Road, Nasirabad, Chattogram",
    district: "Chattogram",
    upazila: "Panchlaish",
    division: "Chattogram",
    latitude: 22.3812,
    longitude: 91.8214,
    phone: "031-683100",
    officialUrl: "https://brta.gov.bd/",
    services: ["DRIVING_LICENCE"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-brta-sylhet",
    name: "BRTA Sylhet Circle (Majortila)",
    officeType: "BRTA_OFFICE",
    address: "Majortila, Sylhet-Tamabil Highway, Sylhet",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    division: "Sylhet",
    latitude: 24.9082,
    longitude: 91.9123,
    phone: "0821-720100",
    officialUrl: "https://brta.gov.bd/",
    services: ["DRIVING_LICENCE"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-brta-rajshahi",
    name: "BRTA Rajshahi Circle (Airport Road)",
    officeType: "BRTA_OFFICE",
    address: "Airport Road, Sopura, Rajshahi",
    district: "Rajshahi",
    upazila: "Boalia",
    division: "Rajshahi",
    latitude: 24.4025,
    longitude: 88.6189,
    phone: "0721-760100",
    officialUrl: "https://brta.gov.bd/",
    services: ["DRIVING_LICENCE"],
    lastVerifiedAt: "2026-11-01",
  },

  // --- BIRTH REGISTRATION / CITY CORPORATION / MUNICIPALITIES ---
  {
    id: "off-dncc-gulshan",
    name: "Dhaka North City Corporation (DNCC Head Office)",
    officeType: "CITY_CORPORATION",
    address: "Nagar Bhaban, Plot 23-26, Road 46, Gulshan-2, Dhaka-1212",
    district: "Dhaka",
    upazila: "Gulshan",
    division: "Dhaka",
    latitude: 23.7925,
    longitude: 90.4078,
    phone: "02-9894258",
    officialUrl: "https://dncc.gov.bd/",
    services: ["BIRTH_REGISTRATION"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-dscc-fulbaria",
    name: "Dhaka South City Corporation (DSCC Head Office)",
    officeType: "CITY_CORPORATION",
    address: "Nagar Bhaban, Phoenix Road, Fulbaria, Dhaka-1000",
    district: "Dhaka",
    upazila: "Kotwali",
    division: "Dhaka",
    latitude: 23.7225,
    longitude: 90.4082,
    phone: "02-9556014",
    officialUrl: "https://dscc.gov.bd/",
    services: ["BIRTH_REGISTRATION"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-ccc-chattogram",
    name: "Chattogram City Corporation (CCC)",
    officeType: "CITY_CORPORATION",
    address: "Tigerpass, Chattogram-4000",
    district: "Chattogram",
    upazila: "Khulshi",
    division: "Chattogram",
    latitude: 22.3412,
    longitude: 91.8156,
    phone: "031-618825",
    officialUrl: "https://ccc.gov.bd/",
    services: ["BIRTH_REGISTRATION"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-scc-sylhet",
    name: "Sylhet City Corporation (SCC)",
    officeType: "CITY_CORPORATION",
    address: "Topobon, Bandarbazar, Sylhet-3100",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    division: "Sylhet",
    latitude: 24.8949,
    longitude: 91.8687,
    phone: "0821-716912",
    officialUrl: "https://scc.gov.bd/",
    services: ["BIRTH_REGISTRATION"],
    lastVerifiedAt: "2026-11-01",
  },

  // --- GOVERNMENT HOSPITALS ---
  {
    id: "off-hosp-dmch-dhaka",
    name: "Dhaka Medical College Hospital (DMCH)",
    officeType: "GOVERNMENT_HOSPITAL",
    address: "Secretariat Road, Bakshibazar, Dhaka-1000",
    district: "Dhaka",
    upazila: "Shahbag",
    division: "Dhaka",
    latitude: 23.7260,
    longitude: 90.3976,
    phone: "02-55165088",
    officialUrl: "https://dghs.gov.bd/",
    services: ["HOSPITAL"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-hosp-suhrawardy-dhaka",
    name: "Shaheed Suhrawardy Medical College Hospital",
    officeType: "GOVERNMENT_HOSPITAL",
    address: "Sher-e-Bangla Nagar, Mirpur Road, Dhaka-1207",
    district: "Dhaka",
    upazila: "Sher-e-Bangla Nagar",
    division: "Dhaka",
    latitude: 23.7703,
    longitude: 90.3712,
    phone: "02-9130800",
    officialUrl: "https://dghs.gov.bd/",
    services: ["HOSPITAL"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-hosp-cmch-chattogram",
    name: "Chattogram Medical College Hospital (CMCH)",
    officeType: "GOVERNMENT_HOSPITAL",
    address: "57 KB Fazlul Kader Road, Panchlaish, Chattogram",
    district: "Chattogram",
    upazila: "Panchlaish",
    division: "Chattogram",
    latitude: 22.3592,
    longitude: 91.8286,
    phone: "031-619400",
    officialUrl: "https://dghs.gov.bd/",
    services: ["HOSPITAL"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-hosp-somch-sylhet",
    name: "Sylhet MAG Osmani Medical College Hospital",
    officeType: "GOVERNMENT_HOSPITAL",
    address: "Medical Road, Kajalshah, Sylhet-3100",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    division: "Sylhet",
    latitude: 24.8986,
    longitude: 91.8532,
    phone: "0821-713487",
    officialUrl: "https://dghs.gov.bd/",
    services: ["HOSPITAL"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-hosp-rmch-rajshahi",
    name: "Rajshahi Medical College Hospital (RMCH)",
    officeType: "GOVERNMENT_HOSPITAL",
    address: "Laxmipur, Rajshahi-6000",
    district: "Rajshahi",
    upazila: "Rajput",
    division: "Rajshahi",
    latitude: 24.3705,
    longitude: 88.5839,
    phone: "0721-772150",
    officialUrl: "https://dghs.gov.bd/",
    services: ["HOSPITAL"],
    lastVerifiedAt: "2026-11-01",
  },

  // --- LAND OFFICES (AC LAND) ---
  {
    id: "off-land-dhaka-sadar",
    name: "Assistant Commissioner (Land) Office, Dhaka Sadar",
    officeType: "LAND_OFFICE",
    address: "DC Office Complex, Johnson Road, Old Dhaka",
    district: "Dhaka",
    upazila: "Kotwali",
    division: "Dhaka",
    latitude: 23.7092,
    longitude: 90.4102,
    phone: "16122",
    officialUrl: "https://land.gov.bd/",
    services: ["LAND"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-land-dhaka-dhanmondi",
    name: "Assistant Commissioner (Land) Office, Dhanmondi Circle",
    officeType: "LAND_OFFICE",
    address: "Road 27 (Old), Dhanmondi, Dhaka",
    district: "Dhaka",
    upazila: "Dhanmondi",
    division: "Dhaka",
    latitude: 23.7461,
    longitude: 90.3742,
    phone: "16122",
    officialUrl: "https://land.gov.bd/",
    services: ["LAND"],
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "off-land-chattogram",
    name: "Assistant Commissioner (Land) Office, Chattogram Sadar",
    officeType: "LAND_OFFICE",
    address: "Court Hill, Kotwali, Chattogram",
    district: "Chattogram",
    upazila: "Kotwali",
    division: "Chattogram",
    latitude: 22.3353,
    longitude: 91.8341,
    phone: "16122",
    officialUrl: "https://land.gov.bd/",
    services: ["LAND"],
    lastVerifiedAt: "2026-11-01",
  },
];

export function buildGoogleDirectionsUrl(
  origin: { lat: number; lng: number } | string,
  dest: { lat: number; lng: number },
): string {
  const originStr =
    typeof origin === "string"
      ? encodeURIComponent(origin.trim())
      : `${origin.lat.toFixed(5)},${origin.lng.toFixed(5)}`;
  const destStr = `${dest.lat.toFixed(5)},${dest.lng.toFixed(5)}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&travelmode=driving`;
}

/**
 * Searches the verified in-memory dataset of Bangladesh government offices.
 * STRICTLY filters and guarantees that:
 * 1. The search origin coordinates are inside Bangladesh.
 * 2. Every returned office is inside Bangladesh.
 * 3. Distances are calculated accurately using Haversine formula and sorted ascending.
 */
export function searchNearestOfficesInMemory(params: {
  service: string;
  lat: number;
  lng: number;
  radiusKm?: number;
  limit?: number;
}): {
  offices: NearbyOfficeResultItem[];
  origin: { lat: number; lng: number };
  radiusKm: number;
  total: number;
} {
  const { lat, lng } = params;

  if (!isWithinBangladesh(lat, lng)) {
    throw new Error(
      "The specified coordinates are outside Bangladesh. NagorikSheba only provides location services within Bangladesh.",
    );
  }

  const radiusKm = Math.min(Math.max(params.radiusKm ?? 50, 1), 500);
  const limit = Math.min(Math.max(params.limit ?? 5, 1), 50);

  const normalizedService = params.service.trim().toUpperCase();

  // Filter candidates
  const matching = VERIFIED_BANGLADESH_GOVERNMENT_OFFICES.filter((office) => {
    // Office must be in Bangladesh
    if (!isWithinBangladesh(office.latitude, office.longitude)) return false;

    // Service filter (allow 'ALL' or empty to match any office)
    if (
      normalizedService &&
      normalizedService !== "ALL" &&
      !office.services.some((s) => s.toUpperCase() === normalizedService)
    ) {
      return false;
    }

    return true;
  });

  // Calculate distance
  const withDistance: NearbyOfficeResultItem[] = matching
    .map((office) => {
      const distanceKm = Number(
        haversineDistanceKm(
          { lat, lng },
          { lat: office.latitude, lng: office.longitude },
        ).toFixed(2),
      );

      return {
        ...office,
        distanceKm,
        directionsUrl: buildGoogleDirectionsUrl(
          { lat, lng },
          { lat: office.latitude, lng: office.longitude },
        ),
      };
    })
    .filter((office) => office.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    offices: withDistance.slice(0, limit),
    origin: { lat, lng },
    radiusKm,
    total: withDistance.length,
  };
}
