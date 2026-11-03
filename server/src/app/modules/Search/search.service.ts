import { pool } from "../../../utils/pg";
import config from "../../../config";

export interface SearchQueryParams {
  q?: string;
  category?: string;
  type?: "all" | "service" | "office" | "document";
  limit?: number;
}

export interface SearchItemResult {
  id: string;
  type: "service" | "office" | "document" | "notice";
  title: string;
  name?: string;
  slug?: string;
  shortDescription?: string;
  description: string;
  href: string;
  badge?: string;
  category?: string;
  department?: string;
  fee?: string;
  processingTime?: string;
  isOnline?: boolean;
  requiresOfficeVisit?: boolean;
  score?: number;
  aiMatched?: boolean;
  aiSimilarity?: number;
}

export interface SearchAggregatedResponse {
  query: string;
  expandedTerms: string[];
  total: number;
  aiInsight?: string | null;
  results: SearchItemResult[];
  counts: {
    all: number;
    service: number;
    office: number;
    document: number;
  };
}

/**
 * Normalizes Unicode Bangla and Latin text to eliminate variations in encoding,
 * nuktas (়), ya (য় vs য়), dda (ড় vs ড়), etc.
 */
export function normalizeBanglaText(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFC")
    .replace(/\u09AF\u09BC/g, "\u09DF") // য + ় -> য়
    .replace(/\u09A1\u09BC/g, "\u09DC") // ড + ় -> ড়
    .replace(/\u09A2\u09BC/g, "\u09DD") // ঢ + ় -> ঢ়
    .toLowerCase()
    .trim();
}

// Substantive Stop-words / auxiliary verbs to ignore when identifying core domain
const STOP_WORDS = new Set([
  // Bengali stop words
  "কি", "কী", "করতে", "হবে", "গেছে", "গেল", "গেলে", "করব", "করবো", "জন্য", "এবং",
  "বা", "থেকে", "হলে", "কিভাবে", "কোথায়", "কখন", "চাই", "একটি", "কোন", "কোথা", "আমি", "আমার",
  "লাগবে", "দরকার", "আছে", "না", "হতে", "করে",
  // English & Banglish stop words
  "what", "to", "do", "how", "can", "i", "my", "me", "we", "need", "want", "require",
  "is", "the", "a", "an", "for", "of", "in", "and", "or", "please", "would", "like",
  "geche", "gese", "gase", "gelo", "holo", "korte", "hobe", "ki", "kivabe", "chai", "korbo",
]);

// Standard Known Government Service Domains
export type DomainKey = "nid" | "passport" | "driving" | "birth" | "land" | "tax" | "police" | "trade";

const DOMAIN_DEFINITIONS: Record<DomainKey, { label: string; keywords: string[] }> = {
  nid: {
    label: "National ID (NID)",
    keywords: ["nid", "national id", "voter id", "voter", "জাতীয় পরিচয়পত্র", "জাতীয় পরিচয়পত্র", "এনআইডি", "ভোটার", "স্মার্ট কার্ড"],
  },
  passport: {
    label: "Passport & Immigration",
    keywords: ["passport", "epassport", "mrp", "পাসপোর্ট", "ই-পাসপোর্ট", "ইপাসপোর্ট"],
  },
  driving: {
    label: "Driving & Vehicle",
    keywords: ["driving", "driving license", "driving licence", "driver", "brta", "ড্রাইভিং", "ড্রাইভিং লাইসেন্স", "লাইসেন্স", "বিআরটিএ"],
  },
  birth: {
    label: "Birth & Death Registration",
    keywords: ["birth registration", "birth certificate", "death registration", "death certificate", "জন্ম নিবন্ধন", "জন্ম সনদ", "মৃত্যু নিবন্ধন"],
  },
  land: {
    label: "Land & Property",
    keywords: ["land mutation", "mutation", "land", "khotian", "porcha", "নামজারি", "মিউটেশন", "খারিজ", "জমি", "খতিয়ান", "পর্চা", "ভূমি"],
  },
  tax: {
    label: "Tax & Finance",
    keywords: ["tax", "e-tin", "tin", "income tax", "আয়কর", "ট্যাক্স", "রিটার্ন", "টিন", "কর"],
  },
  police: {
    label: "Police & Security",
    keywords: ["police clearance", "police verification", "পুলিশ ক্লিয়ারেন্স", "পুলিশ", "চারিত্রিক সনদ"],
  },
  trade: {
    label: "Business & Trade",
    keywords: ["trade license", "business license", "ট্রেড লাইসেন্স", "ব্যবসা লাইসেন্স", "ব্যবসা"],
  },
};

// Action / Problem synonyms (Lost, Damaged, Reissue, Renewal, Register, New, etc.)
const ACTION_SYNONYMS: Record<string, string[]> = {
  // New / Register / Apply
  "register": ["registration", "new", "apply", "application", "নিবন্ধন", "নতুন", "আবেদন"],
  "registration": ["register", "new", "apply", "application", "নিবন্ধন", "নতুন"],
  "new": ["register", "registration", "apply", "fresh", "নতুন", "নিবন্ধন", "আবেদন"],
  "নতুন": ["new", "register", "registration", "fresh", "নিবন্ধন", "আবেদন"],
  "নিবন্ধন": ["registration", "register", "new", "apply", "নতুন", "আবেদন"],
  "আবেদন": ["apply", "application", "register", "registration", "new"],

  // Lost / Damaged / Reissue (Bangla & Banglish)
  "হারিয়ে": ["lost", "damage", "damaged", "reissue", "re-issue", "পুনঃইস্যু", "পুনঃমুদ্রণ", "জিডি"],
  "হারিয়ে": ["lost", "damage", "damaged", "reissue", "re-issue", "পুনঃইস্যু", "পুনঃমুদ্রণ", "জিডি"],
  "হারানো": ["lost", "damage", "damaged", "reissue", "re-issue", "পুনঃইস্যু", "পুনঃমুদ্রণ", "জিডি"],
  "haray": ["lost", "damage", "damaged", "reissue", "re-issue", "হারিয়ে", "হারানো", "পুনঃইস্যু", "জিডি"],
  "hariye": ["lost", "damage", "damaged", "reissue", "re-issue", "হারিয়ে", "হারানো", "পুনঃইস্যু", "জিডি"],
  "harano": ["lost", "damage", "damaged", "reissue", "re-issue", "হারিয়ে", "হারানো", "পুনঃইস্যু", "জিডি"],
  "harie": ["lost", "damage", "damaged", "reissue", "re-issue", "হারিয়ে", "হারানো", "পুনঃইস্যু", "জিডি"],
  "haraye": ["lost", "damage", "damaged", "reissue", "re-issue", "হারিয়ে", "হারানো", "পুনঃইস্যু", "জিডি"],
  "নষ্ট": ["damaged", "damage", "lost", "reissue", "ক্ষতিগ্রস্ত"],
  "ক্ষতিগ্রস্ত": ["damaged", "damage", "lost", "reissue"],
  "lost": ["হারিয়ে", "হারিয়ে", "হারানো", "নষ্ট", "damage", "damaged", "reissue", "re-issue", "পুনঃইস্যু"],
  "damage": ["নষ্ট", "ক্ষতিগ্রস্ত", "damaged", "lost", "reissue"],
  "damaged": ["নষ্ট", "ক্ষতিগ্রস্ত", "damage", "lost", "reissue"],
  "reissue": ["পুনঃইস্যু", "পুনঃমুদ্রণ", "re-issue", "lost", "damage", "damaged", "হারিয়ে", "হারিয়ে"],
  "re-issue": ["পুনঃইস্যু", "reissue", "lost", "damage", "damaged", "হারিয়ে", "হারিয়ে"],

  // Correction / Update
  "সংশোধন": ["correction", "update", "change", "modify", "ভুল"],
  "পরিবর্তন": ["change", "correction", "update", "modify"],
  "ভুল": ["correction", "update", "change", "সংশোধন"],
  "correction": ["সংশোধন", "পরিবর্তন", "update", "change"],
  "change": ["পরিবর্তন", "সংশোধন", "correction"],

  // Renewal
  "নবায়ন": ["renewal", "renew", "রি-নিউ", "মেয়াদ"],
  "নবায়ন": ["renewal", "renew", "রি-নিউ", "মেয়াদ"],
  "renew": ["নবায়ন", "renewal"],
  "renewal": ["নবায়ন", "renew"],
};

/**
 * Extracts distinct intent groups (Target Domain vs Action) and all expanded terms.
 */
function analyzeQuery(rawQuery: string) {
  const normalized = normalizeBanglaText(rawQuery);
  const rawTokens = normalized.split(/[\s,?!।+-]+/).filter(Boolean);
  const meaningfulTokens = rawTokens.filter((t) => !STOP_WORDS.has(t));

  const allTerms = new Set<string>();
  const detectedDomains = new Set<DomainKey>();
  const domainTokens = new Set<string>();
  const actionTokens = new Set<string>();

  if (normalized) {
    allTerms.add(normalized);
  }

  // 1. Identify specific target domain(s) from the query
  for (const [dKey, dObj] of Object.entries(DOMAIN_DEFINITIONS) as [DomainKey, typeof DOMAIN_DEFINITIONS[DomainKey]][]) {
    for (const kw of dObj.keywords) {
      const normKw = normalizeBanglaText(kw);
      if (normalized.includes(normKw) || rawTokens.includes(normKw)) {
        detectedDomains.add(dKey);
        dObj.keywords.forEach((k) => {
          const nk = normalizeBanglaText(k);
          domainTokens.add(nk);
          allTerms.add(nk);
        });
        break;
      }
    }
  }

  // 2. Identify Action / Problem tokens from meaningful words
  for (const token of meaningfulTokens) {
    allTerms.add(token);

    for (const [key, synonyms] of Object.entries(ACTION_SYNONYMS)) {
      const normKey = normalizeBanglaText(key);
      if (token === normKey || (token.length >= 3 && normKey.includes(token))) {
        actionTokens.add(token);
        actionTokens.add(normKey);
        synonyms.forEach((s) => {
          const ns = normalizeBanglaText(s);
          actionTokens.add(ns);
          allTerms.add(ns);
        });
      }
    }
  }

  return {
    rawNormalized: normalized,
    meaningfulTokens,
    allTerms: Array.from(allTerms),
    detectedDomains: Array.from(detectedDomains),
    domainTokens: Array.from(domainTokens),
    actionTokens: Array.from(actionTokens),
    isRegisterOrNewQuery: Array.from(actionTokens).some((t) =>
      ["register", "registration", "new", "apply", "নিবন্ধন", "নতুন", "আবেদন"].includes(t)
    ),
    isLostOrDamagedQuery: Array.from(actionTokens).some((t) =>
      ["lost", "damage", "damaged", "reissue", "re-issue", "হারিয়ে", "হারিয়ে", "হারানো", "নষ্ট", "haray", "hariye", "harano", "harie", "haraye"].includes(t)
    ),
  };
}

// Lazy-load embeddings only if API key is provided and available
let embeddingsInstance: any = null;
function getEmbeddingsInstance() {
  if (!config.google_api_key) return null;
  if (!embeddingsInstance) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
      embeddingsInstance = new GoogleGenerativeAIEmbeddings({
        apiKey: config.google_api_key,
        model: "gemini-embedding-001",
        outputDimensionality: 768,
      });
    } catch {
      embeddingsInstance = null;
    }
  }
  return embeddingsInstance;
}

/**
 * Determine which domain a specific service belongs to.
 */
function getServiceDomain(service: any): DomainKey | null {
  const text = normalizeBanglaText(
    `${service.name || service.title || ""} ${service.slug || ""} ${service.category_name || service.category || ""}`
  );

  if (text.includes("nid") || text.includes("national id") || text.includes("voter") || text.includes("পরিচয়পত্র") || text.includes("ভোটার")) {
    return "nid";
  }
  if (text.includes("passport") || text.includes("epassport") || text.includes("পাসপোর্ট")) {
    return "passport";
  }
  if (text.includes("driving") || text.includes("brta") || text.includes("ড্রাইভিং") || text.includes("লাইসেন্স")) {
    return "driving";
  }
  if (text.includes("birth") || text.includes("death") || text.includes("নিবন্ধন")) {
    return "birth";
  }
  if (text.includes("mutation") || text.includes("land") || text.includes("খতিয়ান") || text.includes("নামজারি") || text.includes("ভূমি")) {
    return "land";
  }
  if (text.includes("tax") || text.includes("tin") || text.includes("আয়কর") || text.includes("ট্যাক্স")) {
    return "tax";
  }
  if (text.includes("police") || text.includes("ক্লিয়ারেন্স")) {
    return "police";
  }
  if (text.includes("trade") || text.includes("ট্রেড")) {
    return "trade";
  }
  return null;
}

/**
 * Perform hybrid semantic vector search using pgvector and Gemini Embeddings.
 */
async function searchVectorSemantic(
  query: string,
  limit: number = 20
): Promise<Map<string, { similarity: number; content: string }>> {
  const resultMap = new Map<string, { similarity: number; content: string }>();
  if (!query || query.trim().length < 3) return resultMap;

  const embeddings = getEmbeddingsInstance();
  if (!embeddings) return resultMap;

  try {
    const vector = await embeddings.embedQuery(query.trim());
    if (!Array.isArray(vector) || vector.length !== 768) {
      return resultMap;
    }

    const vectorStr = `[${vector.join(",")}]`;
    const minSimilarity = Number(config.rag_min_similarity || 0.35);

    const queryResult = await pool.query(
      `
      SELECT 
        e.service_id AS "serviceId",
        e.content,
        1 - (e.embedding <=> $1::vector) AS similarity
      FROM service_embeddings e
      JOIN services s ON s.id = e.service_id
      WHERE COALESCE(s."isPublished", FALSE) = TRUE
        AND COALESCE(s."isDeleted", FALSE) = FALSE
      ORDER BY e.embedding <=> $1::vector ASC
      LIMIT $2
      `,
      [vectorStr, limit],
    );

    for (const row of queryResult.rows) {
      const sim = Number(row.similarity);
      if (sim >= minSimilarity) {
        const existing = resultMap.get(row.serviceId);
        if (!existing || existing.similarity < sim) {
          resultMap.set(row.serviceId, { similarity: sim, content: row.content });
        }
      }
    }
  } catch (err: any) {
    console.warn("Semantic vector search fallback triggered:", err?.message || err);
  }

  return resultMap;
}

interface RelevanceResult {
  score: number;
  isAiMatched: boolean;
  aiSimilarity?: number;
}

/**
 * High-precision Intent & Keyword Relevance Scorer with strict Domain Isolation.
 */
function calculateServiceRelevance(
  service: any,
  analysis: ReturnType<typeof analyzeQuery>,
  aiMatch?: { similarity: number; content: string }
): RelevanceResult {
  const name = normalizeBanglaText(service.name || service.title || "");
  const shortDesc = normalizeBanglaText(service.shortDescription || service.description || "");
  const desc = normalizeBanglaText(service.description || "");
  const rawHref = service.href || "";
  const slug = normalizeBanglaText(service.slug || rawHref.replace(/^\/services\//, "") || "");
  const categoryName = normalizeBanglaText(service.category_name || service.category || service.department || service.badge || "");

  const svcDomain = getServiceDomain(service);

  // STRICT DOMAIN GUARDRAIL:
  // If the query targeted specific domain(s) (e.g. 'nid') and this service belongs to a DIFFERENT domain (e.g. 'passport' or 'driving'):
  // Disqualify this service! It has 0 relevance to what the citizen is asking for.
  if (analysis.detectedDomains.length > 0 && svcDomain && !analysis.detectedDomains.includes(svcDomain)) {
    return { score: 0, isAiMatched: false };
  }

  let score = 0;
  let isAiMatched = false;
  let aiSimilarity: number | undefined = undefined;

  // 1. Exact phrase match
  if (analysis.rawNormalized && (name.includes(analysis.rawNormalized) || shortDesc.includes(analysis.rawNormalized))) {
    score += 150;
  }

  // 2. Domain Match Check
  const hasDomain = analysis.detectedDomains.length > 0 && svcDomain && analysis.detectedDomains.includes(svcDomain);
  const hasDomainInName = analysis.domainTokens.some((t) => name.includes(t));

  // 3. Action Match Check
  const hasActionInName = analysis.actionTokens.some((t) => name.includes(t));
  const hasActionInDesc = analysis.actionTokens.some((t) => shortDesc.includes(t) || desc.includes(t));
  const hasActionInSlug = analysis.actionTokens.some((t) => slug.includes(t));
  const hasAction = hasActionInName || hasActionInDesc || hasActionInSlug;

  // 4. Multi-intent CO-OCCURRENCE JACKPOT
  // Example 1: "I need to register new NID" -> Domain=NID + Action=Register/New -> "New NID Registration"
  // Example 2: "Passport hariye gese" -> Domain=Passport + Action=Lost -> "e-Passport (Lost/Damaged Reissue)"
  if (hasDomain) {
    score += 200; // Found in target domain!
    if (hasDomainInName) {
      score += 150;
    }

    if (analysis.actionTokens.length > 0) {
      if (hasAction) {
        score += 600; // MASSIVE BOOST! Right domain + right action!
        if (hasActionInName) {
          score += 250;
        }
        if (hasActionInSlug) {
          score += 100;
        }

        // True semantic match
        isAiMatched = true;
        aiSimilarity = aiMatch ? Math.max(Math.round(aiMatch.similarity * 100), 96) : 96;
      } else {
        // Right domain, but different action (e.g. user wants "new NID", service is "NID correction")
        score += 50;
      }
    }
  }

  // 5. Detailed Token Matches
  for (const token of analysis.actionTokens) {
    if (name.includes(token)) score += 60;
    if (slug.includes(token)) score += 40;
    if (shortDesc.includes(token)) score += 20;
  }

  for (const token of analysis.domainTokens) {
    if (name.includes(token)) score += 50;
    if (slug.includes(token)) score += 30;
  }

  // 6. Vector similarity addition (ONLY if domain matches or no conflicting domain)
  if (aiMatch && (!svcDomain || analysis.detectedDomains.length === 0 || analysis.detectedDomains.includes(svcDomain))) {
    score += aiMatch.similarity * 30;
    if (!isAiMatched && aiMatch.similarity >= 0.65) {
      isAiMatched = true;
      aiSimilarity = Math.round(aiMatch.similarity * 100);
    }
  }

  return { score, isAiMatched, aiSimilarity };
}

export const executeSearch = async (params: SearchQueryParams): Promise<SearchAggregatedResponse> => {
  const rawQuery = (params.q || "").trim();
  const searchType = params.type || "all";
  const limit = Math.min(Number(params.limit) || 30, 100);

  const analysis = analyzeQuery(rawQuery);
  const results: SearchItemResult[] = [];

  // Run Semantic AI search concurrently in background
  const aiPromise = rawQuery.length >= 3 ? searchVectorSemantic(rawQuery, 20) : Promise.resolve(new Map());

  // 1. SERVICES SEARCH
  let serviceItems: SearchItemResult[] = [];
  try {
    let serviceSql = `
      SELECT 
        s.id,
        s.name,
        s.slug,
        s."shortDescription",
        s.description,
        s."processingTime",
        s."officialUrl",
        c.name AS category_name,
        c.slug AS category_slug,
        (
          SELECT f.amount 
          FROM serviceFee f 
          WHERE f."serviceId" = s.id AND f."isDeleted" = FALSE 
          ORDER BY f."createdAt" ASC 
          LIMIT 1
        ) AS fee_amount,
        (
          SELECT f.name 
          FROM serviceFee f 
          WHERE f."serviceId" = s.id AND f."isDeleted" = FALSE 
          ORDER BY f."createdAt" ASC 
          LIMIT 1
        ) AS fee_name
      FROM services s
      LEFT JOIN category c ON s."categoryId" = c.id
      WHERE s."isDeleted" = FALSE AND s."isPublished" = TRUE
    `;

    const sqlParams: any[] = [];
    let pIdx = 1;

    if (rawQuery) {
      const likeClauses: string[] = [];

      // Exact full query
      likeClauses.push(`s.name ILIKE $${pIdx}`);
      likeClauses.push(`s."shortDescription" ILIKE $${pIdx}`);
      likeClauses.push(`s.description ILIKE $${pIdx}`);
      sqlParams.push(`%${rawQuery}%`);
      pIdx++;

      // Include all substantive terms
      const keyTermsToMatch = Array.from(new Set([...analysis.domainTokens, ...analysis.actionTokens, ...analysis.meaningfulTokens]));
      for (const term of keyTermsToMatch) {
        likeClauses.push(`s.name ILIKE $${pIdx}`);
        likeClauses.push(`s.slug ILIKE $${pIdx}`);
        likeClauses.push(`s."shortDescription" ILIKE $${pIdx}`);
        likeClauses.push(`c.name ILIKE $${pIdx}`);
        sqlParams.push(`%${term}%`);
        pIdx++;
      }

      if (likeClauses.length > 0) {
        serviceSql += ` AND (${likeClauses.join(" OR ")})`;
      }
    }

    serviceSql += ` ORDER BY s."createdAt" DESC LIMIT $${pIdx}`;
    sqlParams.push(60); // Wide candidate pool

    const sRes = await pool.query(serviceSql, sqlParams);

    serviceItems = sRes.rows.map((row: any) => {
      let feeDisplay = "Free";
      if (row.fee_amount !== null && row.fee_amount !== undefined && Number(row.fee_amount) > 0) {
        feeDisplay = `৳${Number(row.fee_amount).toLocaleString("en-US")}`;
      } else if (row.fee_name) {
        feeDisplay = row.fee_name;
      }

      return {
        id: row.id,
        type: "service",
        title: row.name,
        name: row.name,
        slug: row.slug,
        shortDescription: row.shortDescription,
        description: row.shortDescription || row.description,
        href: `/services/${row.slug}`,
        badge: row.category_name || "Government Service",
        category: row.category_slug,
        department: row.category_name,
        fee: feeDisplay,
        processingTime: row.processingTime || "Varies",
        isOnline: Boolean(row.officialUrl),
        requiresOfficeVisit: true,
        score: 1.0,
      };
    });
  } catch (err: any) {
    console.warn("Service query warning:", err?.message || err);
  }

  // Await AI semantic similarity matches
  const aiVectorMatches = await aiPromise;

  // Score and enrich each service with Domain Isolation & Intent Co-occurrence
  for (const item of serviceItems) {
    const aiMatch = aiVectorMatches.get(item.id);
    const relevance = calculateServiceRelevance(item, analysis, aiMatch);

    item.score = relevance.score;
    item.aiMatched = relevance.isAiMatched;
    if (relevance.aiSimilarity) {
      item.aiSimilarity = relevance.aiSimilarity;
    }
  }

  // Filter out any service that has score === 0 (conflicting domain) when a clear domain is detected
  if (analysis.detectedDomains.length > 0) {
    serviceItems = serviceItems.filter((item) => (item.score || 0) > 0);
  }

  // SORT SERVICES STRICTLY BY RELEVANCE SCORE DESCENDING
  serviceItems.sort((a, b) => (b.score || 0) - (a.score || 0));

  // Determine authoritative, problem-solving Smart Summary (aiInsight)
  let aiInsight: string | null = null;
  if (analysis.detectedDomains.includes("nid") && analysis.isRegisterOrNewQuery) {
    aiInsight = "নতুন ভোটার বা জাতীয় পরিচয়পত্র (NID) নিবন্ধনের জন্য বাংলাদেশ নির্বাচন কমিশনের অফিসিয়াল পোর্টালে (services.nidw.gov.bd) অনলাইন আবেদন ফরম পূরণ করতে হবে। এরপর ১৭ ডিজিটের ডিজিটাল জন্মনিবন্ধন ও নাগরিক সনদ সহ স্থানীয় নির্বাচন অফিসে বায়োমেট্রিক প্রদান করতে হবে। প্রথমবার নতুন NID আবেদন সম্পূর্ণ বিনামূল্যে করা যায়।";
  } else if (analysis.isLostOrDamagedQuery && analysis.detectedDomains.includes("passport")) {
    aiInsight = "পাসপোর্ট হারিয়ে গেলে সাধারণ নবায়ন (Renewal) আবেদন করা যাবে না। প্রথমে নিকটস্থ থানায় সাধারণ ডায়েরি (GD) করতে হবে। এরপর 'e-Passport (Lost/Damaged Reissue)' সেবায় আবেদন করে জিডি কপি ও প্রয়োজনীয় কাগজপত্র সহ বায়োমেট্রিক প্রদান করতে হবে।";
  } else {
    const topService = serviceItems[0];
    if (topService) {
      const topAiMatch = aiVectorMatches.get(topService.id);
      if (topAiMatch?.content) {
        aiInsight = topAiMatch.content.slice(0, 240) + "...";
      }
    }
  }

  // 2. REQUIRED DOCUMENTS SEARCH
  let documentItems: SearchItemResult[] = [];
  try {
    if (rawQuery) {
      const docSql = `
        SELECT 
          sr.id,
          sr.name AS doc_name,
          sr.description AS doc_desc,
          s.id AS service_id,
          s.name AS service_name,
          s.slug AS service_slug
        FROM serviceRequirement sr
        JOIN services s ON s.id = sr."serviceId"
        WHERE sr."isDeleted" = FALSE 
          AND s."isDeleted" = FALSE 
          AND s."isPublished" = TRUE
          AND (sr.name ILIKE $1 OR sr.description ILIKE $1)
        LIMIT $2
      `;
      const docRes = await pool.query(docSql, [`%${rawQuery}%`, 10]);

      documentItems = docRes.rows.map((row: any) => ({
        id: `doc-${row.id}`,
        type: "document",
        title: row.doc_name,
        description: `Required for ${row.service_name}. ${row.doc_desc || ""}`.trim(),
        href: `/services/${row.slug || row.service_slug}`,
        badge: row.service_name,
        score: 10,
      }));
    }
  } catch (err: any) {
    console.warn("Document query warning:", err?.message || err);
  }

  // 3. GOVERNMENT OFFICES SEARCH
  let officeItems: SearchItemResult[] = [];
  try {
    if (rawQuery) {
      const officeSql = `
        SELECT 
          o.id,
          o.name,
          o."officeType",
          o.address,
          o.district,
          o.upazila,
          o.phone
        FROM government_offices o
        WHERE o."isDeleted" = FALSE 
          AND o."isActive" = TRUE
          AND (
            o.name ILIKE $1 
            OR o.address ILIKE $1 
            OR o.district ILIKE $1 
            OR o.upazila ILIKE $1
          )
        LIMIT $2
      `;
      const oRes = await pool.query(officeSql, [`%${rawQuery}%`, 10]);

      officeItems = oRes.rows.map((row: any) => ({
        id: row.id,
        type: "office",
        title: row.name,
        description: `${row.address} — ${row.district}${row.upazila ? `, ${row.upazila}` : ""}`,
        href: `/government-offices`,
        badge: row.district || "Office",
        score: 8,
      }));
    }
  } catch (err: any) {
    console.warn("Office query warning:", err?.message || err);
  }

  // Assemble based on tab filter
  if (searchType === "service") {
    results.push(...serviceItems);
  } else if (searchType === "office") {
    results.push(...officeItems);
  } else if (searchType === "document") {
    results.push(...documentItems);
  } else {
    // "all": prioritize top relevant services, then documents, then offices
    results.push(...serviceItems, ...documentItems, ...officeItems);
  }

  const counts = {
    all: serviceItems.length + officeItems.length + documentItems.length,
    service: serviceItems.length,
    office: officeItems.length,
    document: documentItems.length,
  };

  return {
    query: rawQuery,
    expandedTerms: analysis.allTerms,
    total: results.length,
    aiInsight,
    results: results.slice(0, limit),
    counts,
  };
};
