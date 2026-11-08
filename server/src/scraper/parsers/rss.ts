import Parser from "rss-parser";
import { parseDateSafely } from "../utils/date";
import type { ParsedNoticeItem } from "./html";

const parser = new Parser();

/**
 * Parses RSS or Atom XML content.
 */
export async function parseRssNotices(
  xmlContent: string,
  baseUrl: string,
  maxItems = 50
): Promise<ParsedNoticeItem[]> {
  const feed = await parser.parseString(xmlContent);
  const items: ParsedNoticeItem[] = [];

  for (const item of feed.items || []) {
    if (items.length >= maxItems) break;

    const title = item.title?.replace(/\s+/g, " ").trim();
    const rawLink = item.link?.trim();

    if (!title || !rawLink) continue;

    let absoluteUrl: string;
    try {
      absoluteUrl = new URL(rawLink, baseUrl).toString();
    } catch {
      continue;
    }

    const rawDate = item.isoDate || item.pubDate;
    const publishedAt = parseDateSafely(rawDate);

    items.push({
      title,
      url: absoluteUrl,
      publishedAt,
    });
  }

  return items;
}
