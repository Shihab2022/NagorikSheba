/**
 * Utilities for date normalization and parsing, supporting Bangla digits and month names.
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

/**
 * Replaces Bangla numeral characters with standard ASCII digits.
 */
export function banglaToEnglishDigits(str: string): string {
  if (!str) return "";
  return str.replace(/[০-৯]/g, (ch) => BANGLA_DIGITS[ch] ?? ch);
}

/**
 * Safely parses a date string in various Bangla / English / ISO formats.
 * Returns Date or null. Never throws.
 */
export function parseDateSafely(raw: string | undefined | null): Date | null {
  if (!raw || typeof raw !== "string") return null;

  try {
    const cleaned = banglaToEnglishDigits(raw.trim());
    if (!cleaned) return null;

    // 1. Check for Bangla month names: e.g. "১২ জানুয়ারি ২০২৫" or "12 জানুয়ারি 2025"
    for (const [bMonth, monthIdx] of Object.entries(BANGLA_MONTHS)) {
      if (cleaned.includes(bMonth)) {
        const regex = new RegExp(`(\\d{1,2})\\s*${bMonth}\\s*,?\\s*(\\d{4})`);
        const match = cleaned.match(regex);
        if (match && match[1] && match[2]) {
          const day = parseInt(match[1], 10);
          const year = parseInt(match[2], 10);
          const date = new Date(Date.UTC(year, monthIdx, day));
          if (!isNaN(date.getTime())) return date;
        }
      }
    }

    // 2. Standard ISO 8601 / RFC2822 or strings supported by Date.parse
    const directParsed = new Date(cleaned);
    if (!isNaN(directParsed.getTime()) && directParsed.getFullYear() > 1990 && directParsed.getFullYear() < 2100) {
      return directParsed;
    }

    // 3. DD-MM-YYYY or DD/MM/YYYY
    const dmyMatch = cleaned.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
    if (dmyMatch && dmyMatch[1] && dmyMatch[2] && dmyMatch[3]) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      const date = new Date(Date.UTC(year, month, day));
      if (!isNaN(date.getTime())) return date;
    }

    // 4. YYYY-MM-DD or YYYY/MM/DD
    const ymdMatch = cleaned.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (ymdMatch && ymdMatch[1] && ymdMatch[2] && ymdMatch[3]) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);
      const date = new Date(Date.UTC(year, month, day));
      if (!isNaN(date.getTime())) return date;
    }

    return null;
  } catch {
    return null;
  }
}
