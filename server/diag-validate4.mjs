import "dotenv/config";
const url = process.env.OVERPASS_API_URL;
const userAgent = process.env.OVERPASS_USER_AGENT || "NagorikSheba/1.0";
const tests = [
  ["Sylhet office=government 5km node only", `[out:json][timeout:10];node["office"="government"](around:5000,24.87680,91.88646);out center tags;`],
  ["Rajshahi office=government 5km node only", `[out:json][timeout:10];node["office"="government"](around:5000,24.38227,88.60816);out center tags;`],
  ["Dhaka office=government 5km node only", `[out:json][timeout:10];node["office"="government"](around:5000,23.8103,90.4125);out center tags;`],
];
for (const [label, q] of tests) {
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain", "User-Agent": userAgent }, body: q });
    const text = await r.text();
    let json;
    try { json = JSON.parse(text); } catch {}
    const raw = Array.isArray(json?.elements) ? json.elements : [];
    console.log(`${label}: status=${r.status} raw=${raw.length}`);
    raw.slice(0, 5).forEach(e => console.log(`  ${e.type}/${e.id}: "${e.tags?.name}" gov=${e.tags?.government}`));
  } catch (e) { console.log(`${label}: error=${e.name}`); }
  await new Promise((r) => setTimeout(r, 1100));
}
