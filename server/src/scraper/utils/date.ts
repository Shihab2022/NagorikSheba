/**
 * Utilities for date normalization and parsing, supporting Bangla digits, Bangla month names,
 * English month names, and DD-MM-YYYY formats standard across Bangladesh government portals.
 */

const BANGLA_DIGITS: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

const BANGLA_MONTHS: Record<string, number> = {
  // Gregorian Bangla names
  "জানুয়ারি": 0,
  "জানুয়ারি": 0,
  "ফেব্রুয়ারি": 1,
  "ফেব্রুয়ারি": 1,
  "মার্চ": 2,
  "এপ্রিল": 3,
  "মে": 4,
  "জুন": 5,
  "জুলাই": 6,
  "আগস্ট": 7,
  "সেপ্টেম্বর": 8,
  "অক্টোবর": 9,
  "নভেম্বর": 10,
  "ডিসেম্বর": 11,
};

const ENGLISH_MONTHS: Record<string, number> = {
  january: 0,
  jan: 0,
  february: 1,
  feb: 1,
  march: 2,
  mar: 2,
  april: 3,
  apr: 3,
  may: 4,
  june: 5,
  jun: 5,
  july: 6,
  jul: 6,
  august: 7,
  aug: 7,
  september: 8,
  sep: 8,
  sept: 8,
  october: 9,
  oct: 9,
  november: 10,
  nov: 10,
  december: 11,
  dec: 11,
};

/**
 * Replaces Bangla numeral characters with standard ASCII digits.
 */
export function banglaToEnglishDigits(str: string): string {
  if (!str) return "";
  return str.replace(/[০-৯]/g, (ch) => BANGLA_DIGITS[ch] ?? ch);
}

/**
 * Safely parses a date string in various Bangla / English / ISO formats.
 * Follows the Bangladesh administrative standard (Day first: DD-MM-YYYY).
 * Returns Date or null. Never throws.
 */
export function parseDateSafely(raw: string | undefined | null): Date | null {
  if (!raw || typeof raw !== "string") return null;

  try {
    const cleaned = banglaToEnglishDigits(raw.trim());
    if (!cleaned) return null;

    // 1. Check for Bangla month names: e.g. "১২ অক্টোবর ২০২৬", "12 অক্টোবর 2026", "১২ই অক্টোবর, ২০২৬"
    for (const [bMonth, monthIdx] of Object.entries(BANGLA_MONTHS)) {
      if (cleaned.includes(bMonth)) {
        const regex = new RegExp(`(\\d{1,2})(?:[\\s,.-]|(?:ই|শে|রা|ঠা|র্থ|তম))*${bMonth}(?:[\\s,.-])*(\\d{4})`);
        const match = cleaned.match(regex);
        if (match && match[1] && match[2]) {
          const day = parseInt(match[1], 10);
          const year = parseInt(match[2], 10);
          if (day >= 1 && day <= 31 && year >= 1990 && year <= 2100) {
            const date = new Date(Date.UTC(year, monthIdx, day));
            if (!isNaN(date.getTime()) && date.getUTCDate() === day) {
              return validateNotFuture(date);
            }
          }
        }
      }
    }

    // 2. Check for English month names: e.g. "12 October 2026", "12-Oct-2026", "Oct 12, 2026"
    for (const [eMonth, monthIdx] of Object.entries(ENGLISH_MONTHS)) {
      const eRegexDayFirst = new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?[\\s,.-]+${eMonth}[\\s,.-]+(\\d{4})\\b`, "i");
      const match1 = cleaned.match(eRegexDayFirst);
      if (match1 && match1[1] && match1[2]) {
        const day = parseInt(match1[1], 10);
        const year = parseInt(match1[2], 10);
        if (day >= 1 && day <= 31 && year >= 1990 && year <= 2100) {
          const date = new Date(Date.UTC(year, monthIdx, day));
          if (!isNaN(date.getTime()) && date.getUTCDate() === day) {
            return validateNotFuture(date);
          }
        }
      }

      const eRegexMonthFirst = new RegExp(`\\b${eMonth}[\\s,.-]+(\\d{1,2})(?:st|nd|rd|th)?[\\s,.-]+(\\d{4})\\b`, "i");
      const match2 = cleaned.match(eRegexMonthFirst);
      if (match2 && match2[1] && match2[2]) {
        const day = parseInt(match2[1], 10);
        const year = parseInt(match2[2], 10);
        if (day >= 1 && day <= 31 && year >= 1990 && year <= 2100) {
          const date = new Date(Date.UTC(year, monthIdx, day));
          if (!isNaN(date.getTime()) && date.getUTCDate() === day) {
            return validateNotFuture(date);
          }
        }
      }
    }

    // 3. Bangladesh Standard: DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
    // Priority check BEFORE any YYYY-MM-DD or generic Date.parse
    const dmyMatch = cleaned.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\b/);
    if (dmyMatch && dmyMatch[1] && dmyMatch[2] && dmyMatch[3]) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);

      if (month >= 0 && month <= 11 && day >= 1 && day <= 31 && year >= 1990 && year <= 2100) {
        const date = new Date(Date.UTC(year, month, day));
        if (!isNaN(date.getTime()) && date.getUTCDate() === day) {
          return validateNotFuture(date);
        }
      }
    }

    // 4. ISO format: YYYY-MM-DD or YYYY/MM/DD
    const ymdMatch = cleaned.match(/\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
    if (ymdMatch && ymdMatch[1] && ymdMatch[2] && ymdMatch[3]) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);

      if (month >= 0 && month <= 11 && day >= 1 && day <= 31 && year >= 1990 && year <= 2100) {
        const date = new Date(Date.UTC(year, month, day));
        if (!isNaN(date.getTime()) && date.getUTCDate() === day) {
          return validateNotFuture(date);
        }
      }
    }

    // 5. ISO-8601 with time: e.g. 2026-11-10T12:00:00Z
    if (cleaned.includes("T")) {
      const directParsed = new Date(cleaned);
      if (!isNaN(directParsed.getTime()) && directParsed.getUTCFullYear() >= 1990 && directParsed.getUTCFullYear() <= 2100) {
        return validateNotFuture(directParsed);
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Rejects dates that are unreasonably in the future (> 48h from now)
 * since published government notices are historical or current, not future.
 */
function validateNotFuture(date: Date): Date | null {
  const maxAllowedFuture = Date.now() + 48 * 60 * 60 * 1000;
  if (date.getTime() > maxAllowedFuture) {
    return null;
  }
  return date;
}
