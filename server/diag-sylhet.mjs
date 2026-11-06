import "dotenv/config";
import fs from "node:fs";
const overpassUrl = process.env.OVERPASS_API_URL;
const valhallaUrl = process.env.VALHALLA_BASE_URL || "https://valhalla1.openstreetmap.de";
const clientId = process.env.VALHALLA_CLIENT_ID || "NagorikSheba";
const re = /\b(passport|immigration|visa)\b/i;
const bn = /পাসপোর্ট|ইমিগ্রেশন|ভিসা/;
const locations = [
  { name: "Sylhet", lat: 24.87680, lng: 91.88646 },
  { name: "Rajshahi", lat: 24.38227, lng: 88.60816 },
  { name: "Cumilla (control)", lat: 23.46803, lng: 91.15230 },
];
const results = [];
for (const loc of locations) {
  for (const radius of [50, 100]) {
    const q = `[out:json][timeout:10];(node["office"="government"]["government"="public_service"](around:${radius * 1000},${loc.lat},${loc.lng});way["office"="government"]["government"="public_service"](around:${radius * 1000},${loc.lat},${loc.lng});node["amenity"="passport"](around:${radius * 1000},${loc.lat},${loc.lng});way["amenity"="passport"](around:${radius * 1000},${loc.lat},${loc.lng}););out center tags;`;
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 20000);
    const st = Date.now();
    let raw = [];
    let status = null;
    let remark = null;
    let error = null;
    try {
      const r = await fetch(overpassUrl, { method: "POST", headers: { "Content-Type": "text/plain", "User-Agent": process.env.OVERPASS_USER_AGENT || "NagorikSheba/1.0" }, body: q, signal: ac.signal });
      status = r.status;
      const text = await r.text();
      let json;
      try { json = JSON.parse(text); } catch {}
      remark = json?.remark ?? null;
      raw = Array.isArray(json?.elements) ? json.elements : [];
    } catch (e) {
      error = e.name;
    } finally {
      clearTimeout(t);
    }
    const rawSummary = raw.map((e) => ({
      type: e.type,
      id: e.id,
      name: e.tags?.name ?? null,
      nameBn: e.tags?.["name:bn"] ?? null,
      lat: e.lat ?? e.center?.lat,
      lon: e.lon ?? e.center?.lon,
      tags: e.tags ?? {},
    }));
    const matched = rawSummary.filter((e) => e.name && (re.test(e.name) || (e.nameBn && bn.test(e.nameBn)) || bn.test(e.name)));
    const rejected = rawSummary.filter((e) => !(e.name && (re.test(e.name) || (e.nameBn && bn.test(e.nameBn)) || bn.test(e.name))));
    const routed = [];
    for (const c of matched) {
      const ac2 = new AbortController();
      const t2 = setTimeout(() => ac2.abort(), 15000);
      const st2 = Date.now();
      try {
        const r2 = await fetch(`${valhallaUrl}/route`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Client-Id": clientId },
          body: JSON.stringify({ locations: [{ lat: loc.lat, lon: loc.lng }, { lat: c.lat, lon: c.lon }], costing: "auto_shorter", units: "kilometers", alternates: 2, directions_type: "none", id: "diag" }),
          signal: ac2.signal,
        });
        const dur2 = Date.now() - st2;
        const text2 = await r2.text();
        let j2;
        try { j2 = JSON.parse(text2); } catch {}
        const dists = [];
        const p = j2?.trip?.summary?.length;
        if (typeof p === "number") dists.push(p);
        const alts = Array.isArray(j2?.alternatives) ? j2.alternatives : [];
        for (const a of alts) {
          const d = a?.trip?.summary?.length;
          if (typeof d === "number") dists.push(d);
        }
        routed.push({ candidate: c, httpStatus: r2.status, durationMs: dur2, remark: j2?.trip?.status_message ?? null, primary: p ?? null, alternatives: alts.map((a) => a?.trip?.summary?.length ?? null), selected: dists.length ? Math.min(...dists) : null, error: r2.ok ? null : `HTTP ${r2.status}` });
      } catch (e) {
        routed.push({ candidate: c, error: e.name, durationMs: Date.now() - st2 });
      } finally {
        clearTimeout(t2);
      }
      await new Promise((r) => setTimeout(r, 1100));
    }
    const final = routed.filter((r) => r.selected == null || r.selected <= radius).map((r) => ({ name: r.candidate.name, drivingDistanceKm: r.selected }));
    results.push({ location: loc.name, lat: loc.lat, lng: loc.lng, radiusKm: radius, httpStatus: status, durationMs: Date.now() - st, remark, error, rawCount: raw.length, raw: rawSummary, matchedCount: matched.length, matched: matched.map((m) => m.name), rejectedCount: rejected.length, rejected: rejected.map((r) => ({ name: r.name, reason: "name does not match passport/immigration/visa regex" })), routing: routed, finalCount: final.length, final });
    await new Promise((r) => setTimeout(r, 2000));
  }
}
fs.writeFileSync("passport-sylhet-rajshahi-diagnostic.json", JSON.stringify(results, null, 2));
console.log("DONE");
for (const r of results) console.log(r.location, r.radiusKm, "raw", r.rawCount, "matched", r.matchedCount, "final", r.finalCount, r.remark || r.error || "");
