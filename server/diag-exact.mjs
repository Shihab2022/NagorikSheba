const lat = 24.87680;
const lng = 91.88646;
const radiusKm = 50;
const radiusM = Math.round(radiusKm * 1000);
const query = `[timeout:10];
[out:json][timeout:10];
(node[office=government](around:${radiusM},${lat},${lng});
 way[office=government](around:${radiusM},${lat},${lng});
 relation[office=government](around:${radiusM},${lat},${lng});
 node[amenity=passport](around:${radiusM},${lat},${lng});
 way[amenity=passport](around:${radiusM},${lat},${lng});
);
out center;`;

const url = new URL("https://overpass-api.de/api/interpreter");
url.searchParams.set("data", query);
console.log("URL:", url.toString());

fetch(url.toString(), {
  headers: { "User-Agent": "NagorikSheba-Diag/1.0" }
})
  .then(async (r) => {
    console.log("Status:", r.status);
    const text = await r.text();
    try {
      const data = JSON.parse(text);
      console.log("Element count:", data.elements?.length || 0);
      for (const e of data.elements || []) {
        console.log("Element:", e.type, e.id, e.tags?.name || "no name", "office=", e.tags?.office || "none", "amenity=", e.tags?.amenity || "none");
        console.log("  lat:", e.lat ?? e.center?.lat, "lon:", e.lon ?? e.center?.lon);
      }
    } catch (e) {
      console.log("Parse error:", e);
      console.log("Raw response (first 500 chars):", text.substring(0, 500));
    }
  })
  .catch((e) => console.error("Fetch error:", e));
