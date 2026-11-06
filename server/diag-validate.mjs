import "dotenv/config";
const url = process.env.OVERPASS_API_URL;
const userAgent = process.env.OVERPASS_USER_AGENT || "NagorikSheba/1.0";
const locations = [
  { name: "Sylhet", lat: 24.87680, lng: 91.88646 },
  { name: "Rajshahi", lat: 24.38227, lng: 88.60816 },
];
const qEn = (lat, lng, radius) =>
  `[out:json][timeout:10];(node["office"="government"]["name"~"passport|pasport|immigration|visa",i](around:${radius * 1000},${lat},${lng});way["office"="government"]["name"~"passport|pasport|immigration|visa",i](around:${radius * 1000},${lat},${lng});node["amenity"="passport"](around:${radius * 1000},${lat},${lng});way["amenity"="passport"](around:${radius * 1000},${lat},${lng}););out center tags;`;
const qAllGov = (lat, lng, radius) =>
  `[out:json][timeout:10];(node["office"="government"](around:${radius * 1000},${lat},${lng});way["office"="government"](around:${radius * 1000},${lat},${lng}));out center tags;`;
async function run(label, q) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 20000);
  const st = Date.now();
  let status = null, remark = null, error = null, raw = [];
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain", "User-Agent": userAgent }, body: q, signal: ac.signal });
    status = r.status;
    const text = await r.text();
    let json;
    try { json = JSON.parse(text); } catch {}
    remark = json?.remark ?? null;
    raw = Array.isArray(json?.elements) ? json.elements : [];
  } catch (e) { error = e.name; } finally { clearTimeout(t); }
  console.log(`${label}: status=${status} raw=${raw.length} remark=${remark || error || "-"}`);
  raw.forEach(e => console.log(`  ${e.type}/${e.id}: "${e.tags?.name}" (gov=${e.tags?.government})`));
  await new Promise((r) => setTimeout(r, 2000));
}
for (const loc of locations) {
  await run(`${loc.name} English-name-filter 50km`, qEn(loc.lat, loc.lng, 50));
  await run(`${loc.name} English-name-filter 100km`, qEn(loc.lat, loc.lng, 100));
  await run(`${loc.name} all-office=government 50km`, qAllGov(loc.lat, loc.lng, 50));
}
