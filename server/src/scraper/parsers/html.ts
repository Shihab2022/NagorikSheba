import * as cheerio from "cheerio";
import { parseDateSafely } from "../utils/date";

export interface HtmlScraperConfig {
  itemSelector: string;
  titleSelector: string;
  linkSelector: string;
  linkAttr?: string;
  dateSelector?: string;
  dateFormat?: string;
  maxItems?: number;
  headers?: Record<string, string>;
}

export interface ParsedNoticeItem {
  title: string;
  url: string;
  publishedAt: Date | null;
}

/**
 * Parses an HTML string using CSS selectors defined in the source config.
 */
export function parseHtmlNotices(
  html: string,
  baseUrl: string,
  config: HtmlScraperConfig
): ParsedNoticeItem[] {
  const $ = cheerio.load(html);
  const items: ParsedNoticeItem[] = [];
  const maxItems = config.maxItems && config.maxItems > 0 ? config.maxItems : 50;

  const elements = $(config.itemSelector);

  elements.each((_idx, el) => {
    if (items.length >= maxItems) return false;

    const $el = $(el);

    // Skip header rows if table row has only <th> or no <td>
    if ($el.is("tr") && $el.find("td").length === 0) {
      return;
    }

    // Title
    const titleEl = config.titleSelector ? $el.find(config.titleSelector) : $el;
    const title = titleEl.text().replace(/\s+/g, " ").trim();
    if (!title || title.length < 3) return;

    // Link
    const linkAttr = config.linkAttr || "href";
    let linkEl = config.linkSelector ? $el.find(config.linkSelector) : $el;
    let rawLink = linkEl.attr(linkAttr)?.trim();

    // Fallback: If configured link selector did not find a valid href, look for any anchor in the element
    if (!rawLink || rawLink.startsWith("javascript:") || rawLink.startsWith("#")) {
      const fallbackAnchor = $el.find("a[href]").first();
      rawLink = fallbackAnchor.attr("href")?.trim();
    }

    if (!rawLink || rawLink.startsWith("javascript:") || rawLink.startsWith("#")) {
      return;
    }

    let absoluteUrl: string;
    try {
      absoluteUrl = new URL(rawLink, baseUrl).toString();
    } catch {
      return; // Invalid URL
    }

    // Published date (optional)
    let publishedAt: Date | null = null;
    if (config.dateSelector) {
      const dateText = $el.find(config.dateSelector).text().replace(/\s+/g, " ").trim();
      if (dateText) {
        publishedAt = parseDateSafely(dateText);
      }
    }

    items.push({
      title,
      url: absoluteUrl,
      publishedAt,
    });
  });

  return items;
}
