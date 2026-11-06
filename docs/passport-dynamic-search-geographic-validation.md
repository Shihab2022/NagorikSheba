# Passport Dynamic Nearby Search — Geographic Validation

## 1. Existing implementation explanation

The Passport nearby search uses Overpass with generic government/public-service tags plus `amenity=passport`. Parsed results are filtered locally by passport-related English/Bangla name terms. Verified PostgreSQL offices are returned separately from candidates. Candidates are sorted by Haversine distance. The backend uses caching, in-flight deduplication, and failure cooldown. Overpass timeout remarks are treated as provider failures.

## 2. Geographic test matrix and results

Tests were run across Chattogram, Dhaka, Cumilla, Sylhet, Khulna, and Rajshahi at 5, 10, 25, and 50 km.

Key results:

- Chattogram: 1 raw office at all tested radii; 0 passport candidates.
- Dhaka: 3 raw offices at 5 km, 7 at 10/25 km, 11 at 50 km; 1 candidate at 10/25 km, 2 candidates at 50 km.
- Cumilla: 0 raw offices at 5–25 km; 5 raw offices at 50 km; 0 candidates.
- Sylhet: 0 raw offices at all tested radii; 0 candidates.
- Khulna: 2 raw offices at 5/10 km, 4 at 25 km, 14 at 50 km; 1 candidate at 50 km.
- Rajshahi: 0 raw offices at 5–25 km; 7 raw offices at 50 km; 0 candidates.

No request returned an Overpass timeout or HTTP error during this matrix.

## 3. Query accuracy analysis

- The generic `office=government` + `government=public_service` query is broad and returns many unrelated offices.
- Passport-related results depend entirely on office names.
- English and Bengali name variants are both handled by the local filter.
- False positives are possible because the filter only checks names.
- False negatives are likely because many passport offices may not contain the searched terms in OSM names.
- Some OSM records include useful address, phone, and website data, but others are minimal.
- The same physical office could appear as both a node and a way, but no duplicate node/way pair was observed in this matrix.

## 4. Radius behavior results

- The backend receives and applies the selected radius.
- Overpass searches within the requested radius.
- Candidate distances are calculated from the user's coordinates.
- Results outside the selected radius are excluded by Overpass.
- Results are sorted nearest first by the backend.

## 5. Coverage limitations

- OSM coverage is inconsistent across Bangladesh.
- Sylhet returned no public-service offices at any tested radius.
- Cumilla and Rajshahi returned no passport candidates at 50 km.
- Generic public-service tags do not prove passport service eligibility.
- Candidate data remains unverified.

## 6. Recommended improvements

- Keep the generic query but retain conservative name filtering.
- Consider adding service-specific OSM tag research before expanding filters.
- Monitor provider latency and errors in production.
- Keep verified PostgreSQL offices as the trusted source.
- Clearly label candidates as unverified in the UI.

## 7. GO / NO-GO recommendation

GO for continued controlled rollout of Passport nearby discovery, with the understanding that candidate availability depends on sparse and inconsistent OSM data.
