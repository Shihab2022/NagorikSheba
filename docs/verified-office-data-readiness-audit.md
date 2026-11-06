# Verified Office Data Readiness Audit — NagorikSheba

## 1. Executive summary

The PostgreSQL database contains 75 verified government office records and 75 service-office mappings. All 75 records have valid coordinates and no duplicate office names were found. Four records are missing phone numbers and two are missing official URLs.

Only 4 of the 22 NagorikSheba services currently have usable verified office discovery support:

## 2. Current database statistics

- Total office records: 75
- Total service-office mappings: 75
- Records with missing or invalid coordinates: 0
- Records with missing phone numbers: 4
- Records with missing official URLs: 2
- Duplicate office names: 0
- District coverage: 64 districts, with multiple offices in Chattogram, Dhaka, Gaibandha, Gazipur, and Rajshahi.

## 3. Service-wise readiness table

| Service name | Service slug | OfficeServiceKey | Mapped verified offices | Readiness | Missing data requirements |
|---|---|---|---|---|---|
| NID Correction | nid-correction | NID | 69 | READY | Broader upazila-level coverage and phone/URL completeness |
| Birth Registration | birth-registration | BIRTH_REGISTRATION | 1 | PARTIALLY READY | National district/upazila coverage |
| Death Registration | death-registration | None | 0 | DATA MISSING | Authority office network and verified locations |
| e-Passport (New Application) | epassport-new | PASSPORT | 3 | PARTIALLY READY | More divisional, regional, and district passport offices |
| Passport Renewal (Re-issue) | passport-renewal | PASSPORT | 3 | PARTIALLY READY | Same passport office network as above |
| Vehicle Registration | vehicle-registration | None | 0 | DATA MISSING | BRTA office network and service mappings |
| e-TIN | e-tin | None | 0 | DATA MISSING | NBR tax office network and verified locations |
| Income Tax Return | income-tax-return | None | 0 | DATA MISSING | NBR tax office network and verified locations |
| Land Mutation | land-mutation | None | 0 | DATA MISSING | Land office and sub-registrar office network |
| Land Development Tax | land-development-tax | None | 0 | DATA MISSING | Land office network and service mappings |
| Police Clearance | police-clearance | None | 0 | DATA MISSING | Police office network and service mappings |
| General Diary | general-diary | None | 0 | DATA MISSING | Police station network and service mappings |
| Trade License | trade-license | None | 0 | DATA MISSING | City corporation, municipality, and union parishad office data |
| Company Registration | company-registration | None | 0 | DATA MISSING | RJSC office network and verified locations |
| Education Board Results | education-board-results | None | 0 | NOT APPLICABLE | No office-based service delivery requirement |
| Old Age Allowance | old-age-allowance | None | 0 | DATA MISSING | Social services office network and service mappings |
| Government Hospital Services | government-hospital-services | None | 0 | DATA MISSING | Hospital and health office network |
| Union Parishad Certificates | union-parishad-certificates | None | 0 | DATA MISSING | Union parishad office network |
| Holding Tax | holding-tax | None | 0 | DATA MISSING | City corporation, municipality, and union parishad office data |
| Farmer Subsidy | farmer-subsidy | None | 0 | DATA MISSING | Agricultural extension office network |
| Birth Certificate Copy | birth-certificate-copy | BIRTH_REGISTRATION | 1 | PARTIALLY READY | Same birth registration office network as above |

| Driving License | driving-license | DRIVING_LICENCE | 2 | PARTIALLY READY | Additional BRTA zonal and circle offices |

## 4. Existing verified office records grouped by service

### NID

- 69 verified offices.
- Coverage includes most districts, with multiple offices in Chattogram, Dhaka, Gaibandha, Gazipur, and Rajshahi.
- Suitable for nearby discovery, although some records may need upazila-level refinement.

### PASSPORT

- 3 verified offices:
  - Divisional Passport and Visa Office, Mansurabad, Chattogram
  - Regional Passport Office, Dhaka
  - District Passport Office, Chattogram
- Coverage is limited and should be expanded before broader rollout.

### BIRTH_REGISTRATION

- 1 verified office:
  - Dhaka North City Corporation (DNCC)
- Coverage is insufficient for national nearby discovery.

### DRIVING_LICENCE

- 2 verified offices:
  - BRTA Zonal Office, Dhaka (Tejgaon)
  - BRTA Zonal Office, Rajshahi
- Coverage is insufficient for national nearby discovery.

## 5. Missing data analysis

- 18 services have no verified office mappings.
- 15 services are classified as DATA MISSING.
- 4 services are PARTIALLY READY.
- 1 service is READY.
- 1 service is NOT APPLICABLE.
- Missing fields are limited but include phone numbers for 4 records and official URLs for 2 records.
- No records have missing or invalid coordinates.
- No duplicate office names were found.

## 6. Data collection strategy

- Use verified PostgreSQL records as the trusted source.
- Collect official office lists from responsible authorities.
- Manually verify names, addresses, districts, upazilas, coordinates, phone numbers, and official URLs.
- Add service-office mappings only after verification.
- Use Overpass only for candidate discovery, never as verified data.
- Do not seed unverified OSM candidates into the verified office table.

## 7. Recommended implementation priority

1. NID
2. PASSPORT
3. BIRTH_REGISTRATION
4. DRIVING_LICENCE
5. Vehicle Registration
6. Land Mutation
7. Land Development Tax
8. Police Clearance
9. General Diary
10. Trade License
11. Holding Tax
12. Union Parishad Certificates
13. Government Hospital Services
14. e-TIN
15. Income Tax Return
16. Company Registration
17. Old Age Allowance
18. Farmer Subsidy
19. Death Registration
20. Education Board Results (not applicable)

## 8. Confirmed findings vs assumptions

Confirmed:

- Database contains 75 office records and 75 service mappings.
- All coordinates are present and valid.
- No duplicate office names were found.
- Only NID, PASSPORT, BIRTH_REGISTRATION, and DRIVING_LICENCE have verified office mappings.

Assumptions or unverified:

- Official directory availability varies by authority and was not fully verified in this audit.
- OSM suitability ratings are based on known tag patterns and limited diagnostics.
- Some service slugs may share office networks, but this requires verification before implementation.

- NID: 69 offices
- PASSPORT: 3 offices
- BIRTH_REGISTRATION: 1 office
- DRIVING_LICENCE: 2 offices

The remaining 18 services have no verified office mappings. Most lack official office-network data in the database.
