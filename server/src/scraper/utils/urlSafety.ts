import dns from "dns/promises";
import net from "net";

/**
 * Checks if an IP address belongs to private, loopback, link-local, or multicast ranges.
 */
function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return true;

    const [a, b] = parts;
    if (a === undefined || b === undefined) return true;

    // 0.0.0.0/8 (current network)
    if (a === 0) return true;
    // 127.0.0.0/8 (loopback)
    if (a === 127) return true;
    // 10.0.0.0/8 (private)
    if (a === 10) return true;
    // 172.16.0.0/12 (private 172.16.0.0 - 172.31.255.255)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (private)
    if (a === 192 && b === 168) return true;
    // 169.254.0.0/16 (link-local, cloud metadata)
    if (a === 169 && b === 254) return true;
    // 224.0.0.0/4 (multicast) & 240.0.0.0/4 (reserved)
    if (a >= 224) return true;

    return false;
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    // Loopback
    if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;
    // Unspecified
    if (normalized === "::" || normalized === "0:0:0:0:0:0:0:0") return true;
    // Unique Local Address (fc00::/7 -> fc00 to fdff)
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
    // Link-Local (fe80::/10)
    if (
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb")
    ) {
      return true;
    }
    // IPv4-mapped IPv6 (::ffff:x.x.x.x)
    if (normalized.includes("::ffff:")) {
      const v4Part = normalized.split("::ffff:")[1];
      if (v4Part && net.isIPv4(v4Part)) {
        return isPrivateIp(v4Part);
      }
    }
    return false;
  }

  return true;
}

/**
 * Validates a URL against SSRF vulnerabilities.
 * Allows only http and https protocols, resolves DNS, and blocks private/local IP destinations.
 */
export async function isSafeUrl(urlString: string): Promise<{ safe: boolean; reason?: string }> {
  try {
    const parsed = new URL(urlString);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { safe: false, reason: `Disallowed protocol: ${parsed.protocol}` };
    }

    const hostname = parsed.hostname;
    if (!hostname) {
      return { safe: false, reason: "Missing hostname" };
    }

    // Direct check for 'localhost' or numeric formats
    if (hostname.toLowerCase() === "localhost") {
      return { safe: false, reason: "Localhost is blocked" };
    }

    // If hostname is already an IP literal
    if (net.isIP(hostname)) {
      if (isPrivateIp(hostname)) {
        return { safe: false, reason: `Private/reserved IP address is blocked: ${hostname}` };
      }
      return { safe: true };
    }

    // Resolve DNS records
    const lookupResult = await dns.lookup(hostname, { all: true });
    if (!lookupResult || lookupResult.length === 0) {
      return { safe: false, reason: `Could not resolve hostname: ${hostname}` };
    }

    for (const record of lookupResult) {
      if (isPrivateIp(record.address)) {
        return {
          safe: false,
          reason: `Hostname ${hostname} resolves to private/reserved IP: ${record.address}`,
        };
      }
    }

    return { safe: true };
  } catch (error: any) {
    return { safe: false, reason: error.message || "Invalid URL" };
  }
}

/**
 * Throws an Error if the URL is not safe.
 */
export async function assertSafeUrl(urlString: string): Promise<void> {
  const result = await isSafeUrl(urlString);
  if (!result.safe) {
    throw new Error(`SSRF Validation Failed: ${result.reason}`);
  }
}
