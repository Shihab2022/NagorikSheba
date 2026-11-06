const queries = [
  {
    name: "office=government only",
    query: `[timeout:10];[out:json][timeout:10];(node[office=government](around:50000,24.8768,91.88646);way[office=government](around:50000,24.8768,91.88646);relation[office=government](around:50000,24.8768,91.88646););out center;`
  },
  {
    name: "amenity=passport only",
    query: `[timeout:10];[out:json][timeout:10];(node[amenity=passport](around:50000,24.8768,91.88646);way[amenity=passport](around:50000,24.8768,91.88646););out center;`
  },
  {
    name: "combined",
    query: `[timeout:10];[out:json][timeout:10];(node[office=government](around:50000,24.8768,91.88646);way[office=government](around:50000,24.8768,91.88646);relation[office=government](around:50000,24.8768,91.88646);node[amenity=passport](around:50000,24.8768,91.88646);way[amenity=passport](around:50000,24.8768,91.88646););out center;`
  }
];

for (const { name, query } of queries) {
  const url = new URL("https://overpass-api.de/api/interpreter");
  url.searchParams.set("data", query);
  console.log(`\n=== ${name} ===`);
  console.log("Query:", url.toString());
  try {
    fetch(url.toString(), { headers: { "User-Agent": "NagorikSheba-Diag/1.0" } })
      .then(async (r) => {
        console.log("Status:", r.status);
        const text = await r.text();
        try {
          const data = JSON.parse(text);
          console.log("Element count:", data.elements?.length || 0);
          for (const e of data.elements || []) {
            console.log("  Element:", e.type, e.id, "name=", e.tags?.name || "none", "office=", e.tags?.office || "none", "amenity=", e.tags?.amenity || "none", "lat=", e.lat ?? e.center?.lat, "lon=", e.lon ?? e.center?.lon);
          }
        } catch (e) {
          console.log("Parse error:", e.message);
          console.log("Raw (first 200):", text.substring(0, 200));
        }
      })
      .catch((e) => console.error("Error:", e.message));
  } catch (e) {
    console.error("Fetch error:", e.message);
  }
}
