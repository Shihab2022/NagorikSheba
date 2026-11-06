import "dotenv/config";
const url = process.env.OVERPASS_API_URL;
const userAgent = process.env.OVERPASS_USER_AGENT || "NagorikSheba/1.0";
const locations = [
  { name: "Sylhet", lat: 24.87680, lng: 91.88646 },
  { name: "Rajshahi", lat: 24.38227, lng: 88.60816 },
];
const qAllGov = (lat, lng, radius) =>
  `[out:json][timeout:10];(node["office"="government"](around:${radius * 1000},${lat},${lng});way["office"="government"](around:${radius * 1000},${lat},${lng}));out center tags;`;
async function run(label, q) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 20000);
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain", "User-Agent": userAgent }, body: q, signal: ac.signal });
    const text = await r.text();
    let json;
    try { json = JSON.parse(text); } catch {}
    const raw = Array.isArray(json?.elements) ? json.elements : [];
    const passportLike = raw.filter(e => e.tags?.name && /passport|pasport|visa|পাসপোর্ট|ইমigrেশন|ভিসা/i.test(e.tags.name));
    console.log(`${label}: status=${r.status} raw=${raw.length} passportLike=${passportLike.length}`);
    passportLike.forEach(e => console.log(`  ${e.type}/${e.id}: "${e.tags.name}" gov=${e.tags.government} lat=${e.lat ?? e.center?.lat} lon=${e.lon ?? e.center?.lon}`));
  } catch (e) {
    console.log(`${label}: error=${e.name}`);
  } finally { clearTimeout(t); }
  await new Promise((r) => setTimeout(r, 2000));
}
for (const loc of locations) {
  await run(`${loc.name} all-office=government 50km`, qAllGov(loc.lat, loc.lng, 50));
  await run(`${loc.name} all-office=government 100km`, qAllGov(loc.lat, loc.lng, 100));
}
