# Passport Nationwide Geographic Discovery Audit — NagorikSheba

## 1. Official reference office list

The official DIP directory pages could not be fetched during this audit. No official reference office list was extracted.

Attempted sources:

- https://dip.gov.bd/pages/static-pages/6922e11b933eb65569e2a3de — request timed out.
- https://dip.gov.bd/pages/static-pages/6922ddaf933eb65569e15e11 — not fetched.
- https://dip.gov.bd/pages/static-pages/6922dfa1933eb65569e231e4 — not fetched.
- https://www.epassport.gov.bd/landing/notices/33 — not fetched.

## 2. Source URLs

The source URLs above are preserved. No content was extracted.

## 3. Coordinates and confidence status

No coordinates were generated. No offices were geocoded.

## 4. Geocoding evidence

No geocoding evidence is available because no official office list was extracted.

## 5. Overpass query results by reference office and radius

No nationwide Overpass queries were run because no verified reference office list was available. Running broad searches without a reference list would not satisfy the research objective and could produce unverified candidates.

## 6. Duplicate and false-positive analysis

Not applicable without extracted official reference offices and coordinates.

## 7. Geographic coverage findings

Confirmed:

- The DIP directory could not be accessed.
- No official office records were extracted.
- No database or code changes were made.

Assumptions or unverified:

- The DIP directory likely contains divisional, regional, and Dhaka passport offices.
- Overpass may contain passport-named offices in some divisions, as shown in the earlier geographic validation.
- OSM coverage remains inconsistent and cannot establish service eligibility.

## 8. Recommendations for dynamic Passport discovery

1. Access the official DIP directory using a browser or an accessible export method.
2. Extract and preserve all office names, addresses, divisions, districts, and source URLs.
3. Geocode each office using exact address matching.
4. Run Overpass searches around each verified coordinate.
5. Keep candidates separate from verified offices.
6. Do not import static office data into PostgreSQL.

## Confirmed findings vs assumptions

Confirmed:

- Official DIP pages were inaccessible during this audit.
- No official reference records were extracted.
- No live Overpass nationwide queries were run.

Assumptions or unverified:

- The DIP directory contains useful office names and addresses.
- Some offices may have coordinates in OSM or other geocoding sources.
- Nationwide OSM coverage for passport offices is uneven.
