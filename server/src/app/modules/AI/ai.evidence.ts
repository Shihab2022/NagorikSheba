export type AISourceLink = {
  title: string;
  url: string;
  kind: "internal" | "external";
};

export type AIJsonRecord = Record<string, unknown>;

export type ToolEvidence = {
  toolName: string;
  payload: unknown;
};

export type EvidenceAssessment = {
  sufficient: boolean;
  reason:
    | "available"
    | "missing"
    | "insufficient"
    | "stale"
    | "contradictory";
};

const DEFAULT_MAX_EVIDENCE_AGE_DAYS = 365;

export function getServicePagePath(slug: string): string {
  return `/services/${encodeURIComponent(slug)}`;
}

export function asAIRecord(value: unknown): AIJsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as AIJsonRecord;
}

export function getAIString(
  record: AIJsonRecord,
  key: string,
): string | undefined {
  const value = record[key];

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function getAIRecords(value: unknown): AIJsonRecord[] {
  if (!Array.isArray(value)) return [];

  return value
    .map(asAIRecord)
    .filter((item): item is AIJsonRecord => item !== null);
}

function getSourceKey(url: string): string {
  if (url.startsWith("/")) {
    return url.replace(/\/+$/, "").toLowerCase();
  }

  try {
    const parsed = new URL(url);
    parsed.hash = "";

    for (const key of [...parsed.searchParams.keys()]) {
      if (key.toLowerCase().startsWith("utm_")) {
        parsed.searchParams.delete(key);
      }
    }

    parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";

    return parsed.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

function isLocalHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase();

  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "0.0.0.0" ||
    normalized === "::1"
  );
}

export function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    return (
      ["https:", "http:"].includes(parsed.protocol) &&
      !isLocalHost(parsed.hostname)
    );
  } catch {
    return false;
  }
}

export function isAllowedGovernmentUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    return (
      parsed.protocol === "https:" &&
      !isLocalHost(hostname) &&
      (hostname === "gov.bd" || hostname.endsWith(".gov.bd"))
    );
  } catch {
    return false;
  }
}

export function normalizeInternalServicePath(rawPath: string): string | null {
  if (rawPath.startsWith("/services/") && !rawPath.startsWith("//")) {
    return rawPath;
  }

  // Older tool payloads may contain a local absolute URL. Convert it to the
  // safe relative path rather than ever exposing the local host to users.
  try {
    const parsed = new URL(rawPath);

    if (
      isLocalHost(parsed.hostname) &&
      parsed.pathname.startsWith("/services/")
    ) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // Invalid source paths are ignored.
  }

  return null;
}

function isInternalChunkTitle(title: string): boolean {
  return (
    /\(\s*(?:database|ডাটাবেস)\s*\)/i.test(title) ||
    /^.{1,100}\s*[–—-]\s*(?:steps?|description|overview|eligibility|requirements?|documents?|ধাপসমূহ|ধাপ|বিবরণ|যোগ্যতা|কাগজপত্র)\s*$/i.test(
      title.trim(),
    )
  );
}

function cleanSourceTitle(title: string): string {
  return title
    .replace(/\bdatabases?\b|ডাটাবেস/gi, "")
    .replace(/[【】]/g, "")
    .replace(/\s*\(\s*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function addSource(
  sources: AISourceLink[],
  rawTitle: string,
  rawUrl: string,
  kind: AISourceLink["kind"],
): void {
  const url = rawUrl.trim();

  if (kind === "internal") {
    if (!normalizeInternalServicePath(url)) return;
  } else if (!isValidExternalUrl(url)) {
    return;
  }

  const title = cleanSourceTitle(rawTitle);
  if (!title) return;

  const key = getSourceKey(url);
  if (sources.some((source) => getSourceKey(source.url) === key)) return;

  sources.push({
    title,
    url: kind === "internal" ? normalizeInternalServicePath(url)! : url,
    kind,
  });
}

function addInternalServiceSource(
  record: AIJsonRecord,
  sources: AISourceLink[],
  isBangla: boolean,
): void {
  const rawPath = getAIString(record, "servicePagePath");
  if (!rawPath) return;

  const path = normalizeInternalServicePath(rawPath);
  if (!path) return;

  const serviceName =
    getAIString(record, "serviceName") ??
    getAIString(record, "name") ??
    getAIString(record, "serviceSlug") ??
    getAIString(record, "slug");

  if (!serviceName) return;

  addSource(
    sources,
    isBangla ? `${serviceName} – সেবা নির্দেশিকা` : `${serviceName} – Service guide`,
    path,
    "internal",
  );
}

function collectDatabaseSources(
  payload: unknown,
  sources: AISourceLink[],
  isBangla: boolean,
): void {
  const record = asAIRecord(payload);
  if (!record) return;

  addInternalServiceSource(record, sources, isBangla);

  const serviceName =
    getAIString(record, "serviceName") ??
    getAIString(record, "name") ??
    getAIString(record, "serviceSlug") ??
    getAIString(record, "slug") ??
    "Official service source";

  const officialUrl = getAIString(record, "officialUrl");
  if (officialUrl) {
    addSource(sources, `${serviceName} – Official website`, officialUrl, "external");
  }

  for (const source of getAIRecords(record.sources)) {
    const title = getAIString(source, "title");
    const url = getAIString(source, "url");

    if (title && url && !isInternalChunkTitle(title)) {
      addSource(sources, title, url, "external");
    }
  }

  for (const step of getAIRecords(record.steps)) {
    const url = getAIString(step, "officialUrl");
    if (url) {
      addSource(
        sources,
        `${serviceName} – ${getAIString(step, "title") ?? "Official step"}`,
        url,
        "external",
      );
    }
  }

  const nestedService = asAIRecord(record.service);
  if (nestedService) collectDatabaseSources(nestedService, sources, isBangla);

  const metadata = asAIRecord(record.metadata);
  if (metadata) collectDatabaseSources(metadata, sources, isBangla);

  for (const result of getAIRecords(record.results)) {
    collectDatabaseSources(result, sources, isBangla);
  }
}

function collectOfficialWebSources(
  payload: unknown,
  sources: AISourceLink[],
): void {
  const record = asAIRecord(payload);
  if (!record) return;

  for (const result of getAIRecords(record.results)) {
    const title = getAIString(result, "title");
    const url = getAIString(result, "url");

    if (title && url && isAllowedGovernmentUrl(url)) {
      addSource(sources, title, url, "external");
    }
  }
}

export function collectSources(
  toolResults: ToolEvidence[],
  isBangla: boolean,
): AISourceLink[] {
  const sources: AISourceLink[] = [];

  for (const result of toolResults) {
    if (result.toolName === "search_official_web") {
      collectOfficialWebSources(result.payload, sources);
    } else {
      collectDatabaseSources(result.payload, sources, isBangla);
    }
  }

  return [
    ...sources.filter((source) => source.kind === "internal"),
    ...sources.filter((source) => source.kind === "external"),
  ];
}

type RequestedField =
  | "overview"
  | "eligibility"
  | "requirements"
  | "steps"
  | "fees"
  | "processingTime"
  | "sources";

function requestedFields(question: string): RequestedField[] {
  const fields = new Set<RequestedField>();
  const text = question.toLowerCase();

  if (/fee|cost|price|charge|ফি|খরচ|মূল্য|চার্জ/.test(text)) fields.add("fees");
  if (/document|requirement|paper|কাগজ|ডকুমেন্ট|প্রয়োজনীয়/.test(text)) {
    fields.add("requirements");
  }
  if (/eligib|who can|যোগ্য|কারা আবেদন/.test(text)) fields.add("eligibility");
  if (/how|apply|procedure|process|step|আবেদন|প্রক্রিয়া|ধাপ/.test(text)) {
    fields.add("steps");
  }
  if (/time|long|deadline|দিন|সময়|কতদিন|শেষ তারিখ/.test(text)) {
    fields.add("processingTime");
  }
  if (/official|website|portal|contact|helpline|ওয়েবসাইট|পোর্টাল|যোগাযোগ|হেল্পলাইন/.test(text)) {
    fields.add("sources");
  }

  return [...fields];
}

function hasValue(value: unknown): boolean {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function hasRequestedField(
  payload: AIJsonRecord,
  field: RequestedField,
): boolean {
  const service = asAIRecord(payload.service) ?? payload;

  const fieldValue = service[field];
  if (field === "processingTime" || field === "eligibility" || field === "overview") {
    return hasValue(fieldValue);
  }

  if (field === "sources") {
    return getAIRecords(service.sources).some((source) => hasValue(source.url)) ||
      hasValue(service.officialUrl);
  }

  if (field === "fees") return getAIRecords(service.fees).length > 0;
  if (field === "requirements") {
    return getAIRecords(service.requirements).length > 0;
  }
  if (field === "steps") return getAIRecords(service.steps).length > 0;

  return false;
}

function hasRelevantKnowledgeResult(payload: AIJsonRecord, question: string): boolean {
  const results = getAIRecords(payload.results);
  if (!results.length || payload.found === false) return false;

  const fields = requestedFields(question);
  if (!fields.length) return true;

  return fields.some((field) =>
    results.some((result) => {
      const chunkType = getAIString(result, "chunkType");
      const content = getAIString(result, "content")?.toLowerCase() ?? "";

      return (
        (field === "fees" && chunkType === "fee") ||
        (field === "requirements" && chunkType === "requirement") ||
        (field === "steps" && chunkType === "step") ||
        (field === "eligibility" && chunkType === "eligibility") ||
        (field === "processingTime" && /processing|time|সময়|দিন/.test(content)) ||
        (field === "sources" && chunkType === "source")
      );
    }),
  );
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isStaleRecord(record: AIJsonRecord, now: Date, maxAgeDays: number): boolean {
  const dates = [
    parseDate(record.lastVerifiedAt),
    parseDate(record.lastCheckedAt),
    ...getAIRecords(record.sources).map((source) => parseDate(source.lastCheckedAt)),
  ].filter((date): date is Date => date !== null);

  if (!dates.length) return false;

  return dates.some(
    (date) => now.getTime() - date.getTime() > maxAgeDays * 24 * 60 * 60 * 1000,
  );
}

function collectServiceRecords(payload: unknown): AIJsonRecord[] {
  const record = asAIRecord(payload);
  if (!record) return [];

  const records: AIJsonRecord[] = [];
  const service = asAIRecord(record.service);

  if (service) records.push(service);
  if (record.slug || record.serviceSlug) records.push(record);

  for (const result of getAIRecords(record.results)) {
    records.push(...collectServiceRecords(result));
  }

  return records;
}

function hasContradictoryServiceFacts(toolResults: ToolEvidence[]): boolean {
  const byService = new Map<string, Map<string, Set<string>>>();

  for (const result of toolResults) {
    if (result.toolName === "search_official_web") continue;

    for (const record of collectServiceRecords(result.payload)) {
      const slug = getAIString(record, "slug") ?? getAIString(record, "serviceSlug");
      if (!slug) continue;

      const facts = byService.get(slug) ?? new Map<string, Set<string>>();
      byService.set(slug, facts);

      for (const field of ["eligibility", "processingTime", "officialUrl"]) {
        const value = getAIString(record, field);
        if (!value) continue;
        const values = facts.get(field) ?? new Set<string>();
        values.add(value.trim().toLowerCase());
        facts.set(field, values);
      }
    }
  }

  return [...byService.values()].some((facts) =>
    [...facts.values()].some((values) => values.size > 1),
  );
}

function hasUsableOfficialEvidence(toolResults: ToolEvidence[]): boolean {
  return toolResults.some((result) => {
    if (result.toolName !== "search_official_web") return false;

    const payload = asAIRecord(result.payload);

    return (
      payload?.success !== false &&
      payload?.found !== false &&
      getAIRecords(payload?.results).some(
        (item) =>
          Boolean(getAIString(item, "url")) &&
          isAllowedGovernmentUrl(getAIString(item, "url")!) &&
          Boolean(getAIString(item, "content")),
      )
    );
  });
}

export function assessEvidence(
  toolResults: ToolEvidence[],
  question: string,
  options: { now?: Date; maxAgeDays?: number } = {},
): EvidenceAssessment {
  const databaseResults = toolResults.filter(
    (result) => result.toolName !== "search_official_web",
  );

  if (hasContradictoryServiceFacts(databaseResults)) {
    return { sufficient: false, reason: "contradictory" };
  }

  if (hasUsableOfficialEvidence(toolResults)) {
    return { sufficient: true, reason: "available" };
  }

  const maxAgeDays = options.maxAgeDays ?? DEFAULT_MAX_EVIDENCE_AGE_DAYS;
  const now = options.now ?? new Date();

  for (const result of databaseResults) {
    const payload = asAIRecord(result.payload);
    if (!payload || payload.success === false || payload.found === false) continue;

    const service = asAIRecord(payload.service);

    if (
      isStaleRecord(payload, now, maxAgeDays) ||
      (service !== null && isStaleRecord(service, now, maxAgeDays))
    ) {
      return { sufficient: false, reason: "stale" };
    }

    if (service) {
      const fields = requestedFields(question);
      if (fields.every((field) => hasRequestedField(payload, field))) {
        return { sufficient: true, reason: "available" };
      }

      if (!fields.length && hasValue(service.name)) {
        return { sufficient: true, reason: "available" };
      }
    }

    if (result.toolName === "search_knowledge_base" && hasRelevantKnowledgeResult(payload, question)) {
      return { sufficient: true, reason: "available" };
    }
  }

  if (!databaseResults.length) return { sufficient: false, reason: "missing" };

  return { sufficient: false, reason: "insufficient" };
}

export function shouldUseOfficialWebFallback(
  toolResults: ToolEvidence[],
  question: string,
): boolean {
  if (toolResults.some((result) => result.toolName === "search_official_web")) {
    return false;
  }

  const last = toolResults.at(-1);
  const lastPayload = asAIRecord(last?.payload);

  // A service match is only a discovery result. Let the model call
  // get_service_details before falling back to the web.
  if (
    last?.toolName === "search_services" &&
    lastPayload !== null &&
    lastPayload.success !== false &&
    getAIRecords(lastPayload.results).length > 0
  ) {
    return false;
  }

  return !assessEvidence(toolResults, question).sufficient;
}
