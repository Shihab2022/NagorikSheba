/**
 * Bilingual (Bangla ⇄ English ⇄ Banglish) synonyms dictionary
 * and search helper for NagorikSheba.
 */

export const BILINGUAL_SYNONYMS: Record<string, string[]> = {
  // Passport / ই-পাসপোর্ট
  "পাসপোর্ট": ["passport", "epassport", "mrp", "reissue"],
  "ই-পাসপোর্ট": ["epassport", "passport", "reissue", "পাসপোর্ট"],
  "ইপাসপোর্ট": ["epassport", "passport", "পাসপোর্ট"],
  "passport": ["পাসপোর্ট", "ই-পাসপোর্ট", "epassport", "mrp"],
  "epassport": ["ই-পাসপোর্ট", "পাসপোর্ট", "passport"],

  // NID / National ID
  "এনআইডি": ["nid", "national id", "voter id", "জাতীয় পরিচয়পত্র", "smart card"],
  "জাতীয় পরিচয়পত্র": ["nid", "national id", "voter", "স্মার্ট কার্ড", "ভোটার", "এনআইডি"],
  "জাতীয় পরিচয়পত্র": ["nid", "national id", "voter", "স্মার্ট কার্ড", "এনআইডি"],
  "ভোটার আইডি": ["nid", "voter", "জাতীয় পরিচয়পত্র", "national id"],
  "ভোটার": ["voter", "nid", "জাতীয় পরিচয়পত্র", "voter list"],
  "nid": ["জাতীয় পরিচয়পত্র", "এনআইডি", "স্মার্ট কার্ড", "ভোটার আইডি", "national id"],
  "national id": ["জাতীয় পরিচয়পত্র", "এনআইডি", "nid", "ভোটার"],
  "voter": ["ভোটার", "জাতীয় পরিচয়পত্র", "nid"],

  // Birth & Death Registration
  "জন্ম নিবন্ধন": ["birth registration", "birth certificate", "jonmo nibondhon", "জন্ম সনদ"],
  "জন্ম সনদ": ["birth certificate", "birth registration", "জন্ম নিবন্ধন"],
  "মৃত্যু নিবন্ধন": ["death certificate", "death registration"],
  "birth": ["জন্ম নিবন্ধন", "জন্ম সনদ", "নিবন্ধন"],
  "certificate": ["সনদ", "প্রত্যয়ন", "নিবন্ধন"],

  // Driving License / BRTA
  "ড্রাইভিং লাইসেন্স": ["driving license", "driving licence", "brta", "ড্রাইভিং", "লাইসেন্স"],
  "ড্রাইভিং": ["driving", "driving license", "লাইসেন্স", "brta"],
  "লাইসেন্স": ["license", "licence", "ড্রাইভিং লাইসেন্স"],
  "driving": ["ড্রাইভিং", "ড্রাইভিং লাইসেন্স", "brta"],
  "license": ["লাইসেন্স", "ড্রাইভিং", "অনুমতি"],
  "brta": ["বিআরটিএ", "ড্রাইভিং লাইসেন্স", "মোটরযান", "যানবাহন"],

  // Land / Mutation / Khotian
  "নামজারি": ["land mutation", "mutation", "খারিজ", "জমি", "খতিয়ান", "মিউটেশন"],
  "মিউটেশন": ["mutation", "land mutation", "নামজারি", "খারিজ"],
  "খতিয়ান": ["khotian", "porcha", "পর্চা", "ভূমি", "জমি", "রেকর্ড"],
  "পর্চা": ["porcha", "khotian", "খতিয়ান", "ভূমি"],
  "জমি": ["land", "নামজারি", "খতিয়ান", "ভূমি", "mutation"],
  "ভূমি": ["land", "নামজারি", "খতিয়ান", "ভূমি সেবা"],
  "mutation": ["নামজারি", "মিউটেশন", "খারিজ", "ভূমি", "land mutation"],
  "land": ["জমি", "ভূমি", "নামজারি", "খতিয়ান"],

  // Tax / e-TIN
  "টিন": ["e-tin", "tin certificate", "কর", "ট্যাক্স", "আয়কর"],
  "ই-টিন": ["e-tin", "tin", "কর", "ট্যাক্স"],
  "ট্যাক্স": ["tax", "income tax", "আয়কর", "রিটার্ন", "টিন"],
  "আয়কর": ["income tax", "tax", "রিটার্ন", "টিন", "কর"],
  "tax": ["আয়কর", "ট্যাক্স", "রিটার্ন", "e-tin"],
  "tin": ["e-tin", "টিন", "আয়কর"],

  // Police Clearance
  "পুলিশ ক্লিয়ারেন্স": ["police clearance", "verification", "চারিত্রিক সনদ", "পুলিশ"],
  "পুলিশ": ["police", "police clearance"],
  "police": ["পুলিশ ক্লিয়ারেন্স", "পুলিশ"],
  "clearance": ["ক্লিয়ারেন্স", "police clearance", "পুলিশ ক্লিয়ারেন্স"],

  // Trade License
  "ট্রেড লাইসেন্স": ["trade license", "ব্যবসা", "সিটি কর্পোরেশন"],
  "ব্যবসা": ["business", "trade license", "ট্রেড লাইসেন্স"],
  "trade": ["ট্রেড লাইসেন্স", "ব্যবসা"],

  // Common Citizen Problem / Action Keywords
  "হারিয়ে": ["lost", "reissue", "পুনঃমুদ্রণ", "জিডি"],
  "হারানো": ["lost", "reissue", "পুনঃমুদ্রণ"],
  "lost": ["হারিয়ে", "হারানো", "reissue", "পুনঃইস্যু"],
  "reissue": ["পুনঃইস্যু", "পুনঃমুদ্রণ", "re-issue", "হারিয়ে"],
  "সংশোধন": ["correction", "update", "change", "ভুল"],
  "correction": ["সংশোধন", "পরিবর্তন", "পরিমার্জন", "update"],
  "নবায়ন": ["renewal", "renew", "রি-নিউ"],
  "renew": ["নবায়ন", "renewal"],
  "renewal": ["নবায়ন", "renew"],
  "ফি": ["fee", "cost", "খরচ", "টাকা"],
  "fee": ["ফি", "খরচ", "চার্জ", "cost"],
};

/**
 * Expand a user search string into search tokens and synonyms.
 */
export function getExpandedSearchTerms(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const tokens = normalized.split(/[\s,+-]+/).filter(Boolean);
  const terms = new Set<string>();

  terms.add(normalized);

  for (const token of tokens) {
    terms.add(token);
    for (const [key, synonyms] of Object.entries(BILINGUAL_SYNONYMS)) {
      if (token === key.toLowerCase() || (token.length >= 3 && key.toLowerCase().includes(token))) {
        synonyms.forEach((s) => terms.add(s.toLowerCase()));
      }
    }
  }

  return Array.from(terms);
}

/**
 * Check if a text matches the query or any of its bilingual synonyms.
 */
export function matchesBilingualQuery(haystack: string, query: string): boolean {
  if (!query.trim()) return true;
  const hay = haystack.toLowerCase();
  const terms = getExpandedSearchTerms(query);
  return terms.some((term) => hay.includes(term));
}
