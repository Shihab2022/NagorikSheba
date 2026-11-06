# Nearby Office Discovery Audit

## Scope

This report audits the existing Nearby Office Discovery feature and all 22 services in NagorikSheba. It is an inspection and research document only. No code, database, configuration, or dependency changes were made.
## Existing implementation status

Only these service slugs currently resolve to an `OfficeServiceKey`:

- `nid-correction` -> `NID`
- `birth-registration` -> `BIRTH_REGISTRATION`
- `birth-certificate-copy` -> `BIRTH_REGISTRATION`
- `epassport-new` -> `PASSPORT`
- `passport-renewal` -> `PASSPORT`
- `driving-license` -> `DRIVING_LICENCE`

The backend `OFFICE_SERVICE_KEYS` are `NID`, `PASSPORT`, `BIRTH_REGISTRATION`, and `DRIVING_LICENCE`. All other service slugs currently have no office-service mapping and therefore no nearby office search support.

The current architecture is:

- PostgreSQL `government_offices` and `government_office_services` provide verified offices.
- Overpass provides dynamic, unverified candidates only.
- Backend separates `offices` and `candidates`.
- Frontend displays verified offices and candidates separately.
- Candidate data must never be treated as verified.


## Service-wise audit

| Service name | Service slug | OfficeServiceKey | Responsible authority | Official directory | Data availability | OSM suitability | Recommended strategy | Verification requirements | Implementation priority |
|---|---|---|---|---|---|---|---|---|---|
| NID Correction | nid-correction | NID | Election Commission / NID Wing | https://ecs.gov.bd/ | Structured/directory | Partial | DB + optional Overpass candidate discovery | Verify office name, address, service key, coordinates, active status | High |
| Birth Registration | birth-registration | BIRTH_REGISTRATION | Office of Registrar General, Birth & Death Registration | https://bdris.gov.bd/ | Structured/directory | Partial | DB + optional Overpass candidate discovery | Verify office name, address, service key, coordinates, active status | High |
| Death Registration | death-registration | None | Office of Registrar General, Birth & Death Registration | https://bdris.gov.bd/ | Partial/unverified | Partial | Official source -> DB; Overpass only candidate discovery if tags exist | Verify office name, address, service key, coordinates, active status | Medium |
| e-Passport (New Application) | epassport-new | PASSPORT | Department of Immigration & Passports | https://dip.gov.bd/ | Structured/directory | Partial | DB + Overpass candidate discovery with conservative name filtering | Verify office name, address, service key, coordinates, active status | High |
| Passport Renewal (Re-issue) | passport-renewal | PASSPORT | Department of Immigration & Passports | https://dip.gov.bd/ | Structured/directory | Partial | DB + Overpass candidate discovery with conservative name filtering | Verify office name, address, service key, coordinates, active status | High |
| Driving License | driving-license | DRIVING_LICENCE | BRTA | https://brta.gov.bd/ | Structured/directory | Partial | DB + optional Overpass candidate discovery | Verify office name, address, service key, coordinates, active status | High |

| Vehicle Registration | vehicle-registration | None | BRTA | https://brta.gov.bd/ | Partial/unverified | Partial | Official source -> DB; Overpass only candidate discovery if tags exist | Verify office name, address, service key, coordinates, active status | Medium |
| e-TIN | e-tin | None | National Board of Revenue | https://nbr.gov.bd/ | Unknown/unverified | Poor | Official source -> DB if office data is published; otherwise no nearby discovery | Verify office name, address, service key, coordinates, active status | Low |
| Income Tax Return | income-tax-return | None | National Board of Revenue | https://nbr.gov.bd/ | Unknown/unverified | Poor | Official source -> DB if office data is published; otherwise no nearby discovery | Verify office name, address, service key, coordinates, active status | Low |
| Land Mutation | land-mutation | None | Ministry of Land / Office of the Deputy Commissioner | https://land.gov.bd/ | Partial/unverified | Partial | Official source -> DB; Overpass only candidate discovery if tags exist | Verify office name, address, service key, coordinates, active status | Medium |
| Land Development Tax | land-development-tax | None | Ministry of Land / Office of the Deputy Commissioner | https://land.gov.bd/ | Partial/unverified | Partial | Official source -> DB; Overpass only candidate discovery if tags exist | Verify office name, address, service key, coordinates, active status | Medium |
| Police Clearance | police-clearance | None | Bangladesh Police | https://police.gov.bd/ | Unknown/unverified | Partial | Official source -> DB; Overpass only candidate discovery if tags exist | Verify office name, address, service key, coordinates, active status | Medium |
| General Diary | general-diary | None | Bangladesh Police | https://police.gov.bd/ | Unknown/unverified | Partial | Official source -> DB; Overpass only candidate discovery if tags exist | Verify office name, address, service key, coordinates, active status | Medium |
| Trade License | trade-license | None | City Corporation / Municipality / Union Parishad | https://bangladesh.gov.bd/ | Partial/unverified | Partial | Official source -> DB; Overpass only candidate discovery if tags exist | Verify office name, address, service key, coordinates, active status | Medium |
| Company Registration | company-registration | None | Registrar of Joint Stock Companies and Firms | https://rjsc.gov.bd/ | Unknown/unverified | Poor | Official source -> DB if office data is published; otherwise no nearby discovery | Verify office name, address, service key, coordinates, active status | Low |
| Education Board Results | education-board-results | None | Education Boards / Ministry of Education | https://bangladesh.gov.bd/ | Not applicable for office discovery | Poor | No nearby office discovery unless a specific office service is defined | Verify any future office data source before implementation | Low |
| Old Age Allowance | old-age-allowance | None | Department of Social Services | https://dss.gov.bd/ | Unknown/unverified | Poor | Official source -> DB if office data is published; otherwise no nearby discovery | Verify office name, address, service key, coordinates, active status | Low |
| Government Hospital Services | government-hospital-services | None | Ministry of Health and Family Welfare / DGHS | https://dghs.gov.bd/ | Partial/unverified | Partial | Official source -> DB; Overpass only candidate discovery if tags exist | Verify office name, address, service key, coordinates, active status | Medium |
| Union Parishad Certificates | union-parishad-certificates | None | Local Government Division / Union Parishad | https://bangladesh.gov.bd/ | Partial/unverified | Partial | Official source -> DB; Overpass only candidate discovery if tags exist | Verify office name, address, service key, coordinates, active status | Medium |
| Holding Tax | holding-tax | None | City Corporation / Municipality / Union Parishad | https://bangladesh.gov.bd/ | Partial/unverified | Partial | Official source -> DB; Overpass only candidate discovery if tags exist | Verify office name, address, service key, coordinates, active status | Medium |
| Farmer Subsidy | farmer-subsidy | None | Department of Agricultural Extension / Ministry of Agriculture | https://dae.gov.bd/ | Unknown/unverified | Poor | Official source -> DB if office data is published; otherwise no nearby discovery | Verify office name, address, service key, coordinates, active status | Low |
| Birth Certificate Copy | birth-certificate-copy | BIRTH_REGISTRATION | Office of Registrar General, Birth & Death Registration | https://bdris.gov.bd/ | Structured/directory | Partial | DB + optional Overpass candidate discovery | Verify office name, address, service key, coordinates, active status | High |

## OSM suitability notes

- Confirmed from live diagnostics: `amenity=passport` returned zero results around Chattogram.
- Confirmed from live diagnostics: generic `office=government` + `government=public_service` returned a small number of public-service offices.
- Confirmed from live diagnostics: a name-regex query for passport-related government offices timed out.
- OSM suitability is therefore `Partial` or `Poor` for most services because generic public-service tags do not establish service eligibility.
- Any OSM result must remain an unverified candidate unless matched to an authoritative source and manually verified.

## Recommended architecture

Use a common provider interface rather than one implementation per service.

Suggested interface:

- `findNearby(serviceKey, lat, lng, radiusKm)` returns verified offices and unverified candidates separately.
- `findNearbyCandidates(serviceKey, lat, lng, radiusKm)` returns candidate-only results.
- Provider implementations:
  - `VerifiedOfficeProvider`: PostgreSQL-backed, trusted source.
  - `OverpassCandidateProvider`: generic public-service discovery only, service-specific conservative filtering.
  - Future `OfficialDirectoryProvider`: imports or queries authoritative government directories.
- Service-specific configuration should define:
  - Allowed office types.
  - Candidate name filters.
  - Official source URLs.
  - Radius defaults and maximums.
  - Verification policy.

Recommended data flow:

1. Query PostgreSQL for verified offices.
2. Query Overpass only where the service strategy allows it.
3. Parse nodes and ways.
4. Apply conservative service-specific name filters.
5. Deduplicate candidates against verified offices using distance.
6. Calculate straight-line distance.
7. Sort candidates by distance.
8. Return verified offices and candidates separately.
9. Preserve provider timeout, caching, in-flight deduplication, and failure cooldown.
10. Never cache an Overpass error remark as a successful empty result.

## Risks and limitations

- OSM coverage in Bangladesh is sparse and inconsistent.
- Generic OSM tags do not prove service eligibility.
- Name-based filtering can produce false positives and false negatives.
- Overpass public endpoints can time out or return HTTP 502.
- Official directory data may be unavailable, unstructured, or outdated.
- Candidate coordinates may be inaccurate.
- No automated frontend tests currently exist.

## Prioritized implementation roadmap

1. Keep the existing PASSPORT implementation stable.
2. Add NID and BIRTH_REGISTRATION office discovery using the existing verified database pattern.
3. Add DRIVING_LICENCE office discovery using the existing verified database pattern.
4. Add official directory import workflows for police, land, health, and local government services.
5. Add Overpass candidate discovery only for services with known OSM tag patterns.
6. Add automated backend and frontend tests for all supported services.
7. Re-run live diagnostics before enabling any new candidate source.

## Confirmed findings vs assumptions

Confirmed:

- Existing OfficeServiceKey mappings and service slugs.
- Existing backend nearby endpoint behavior.
- Live Overpass diagnostics described in prior tasks.
- PostgreSQL-backed verified office discovery for NID, PASSPORT, BIRTH_REGISTRATION, and DRIVING_LICENCE.

Assumptions or unverified research:

- Many official directory URLs were inferred from common government authority names and are not individually verified in this audit.
- OSM suitability ratings are based on known tag patterns and limited diagnostics, not a complete national data audit.
- Service-specific office availability outside the already implemented services has not been verified.
- No database records were inspected beyond the documented schema and existing service mappings.
