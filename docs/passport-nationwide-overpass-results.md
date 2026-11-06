# Nationwide Passport Office Overpass Results — NagorikSheba

## Summary

- Reference coordinates processed: 50
- Query combinations: 100 (50 km and 100 km for each reference)
- Successful queries: 100
- Failed queries: 0
- Raw OSM result rows: 133
- Unique OSM candidate objects: 6
- Locations with no filtered passport candidate: 43

## Unique OSM candidates

1. Regional Passport Office, Uttara — node 9622451098 — https://www.openstreetmap.org/node/9622451098
2. Regional Passport Office Manikganj — way 1135028165 — https://www.openstreetmap.org/way/1135028165
3. Regional Passport office Rajbari — node 12086106367 — https://www.openstreetmap.org/node/12086106367
4. Regional Passport Office, Magura — way 1242753139 — https://www.openstreetmap.org/way/1242753139
5. Noakhali Passport Office — node 8344170817 — https://www.openstreetmap.org/node/8344170817
6. Passport Office — way 1267373532 — https://www.openstreetmap.org/way/1267373532

## Candidate details

All six candidates are tagged as `office=government` and `government=public_service`. Some include additional address, phone, website, opening hours, or source tags. None should be treated as verified passport service locations.

## Duplicate analysis

The same six OSM objects appeared across multiple overlapping 50 km and 100 km searches. They were deduplicated by OSM type and ID.

## Empty-result locations

43 of the 100 query combinations returned no passport-named candidate. This indicates sparse and uneven OSM coverage across Bangladesh.

## Limitations

- Candidate names alone do not prove passport service eligibility.
- OSM coverage is inconsistent.
- No official directory reconciliation was performed in this task.
- No database or code changes were made.

## Raw data

Full per-query results are stored in `docs/passport-nationwide-overpass-results.json`.
