# Task 1.6 — Government Hospital Services

> Group 1 · Identity, Civil Registration & Citizen Welfare
> No official link in the service data — confirming the DGHS portal is part of this task.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/government-hospital-services` |
| Service ID | `svc-hospital-services` |
| Category | `health` |
| Department / Authority | Ministry of Health & Family Welfare — Directorate General of Health Services (DGHS) |
| Official portal | ⚠️ Not set in data — **proposed:** [https://dghs.gov.bd/](https://dghs.gov.bd/) (DGHS, confirmed live) |
| Fee | Free or nominal fee at government hospitals |
| Processing time | Same day (OPD) |
| Mode | 🏢 Offline — office visit required (`isOnline: false`) |
| Last verified (data) | ⚠️ Not set |

## Documents needed

- [ ] NID card (for admission / discount schemes)

## Eligibility

- Open to all citizens.
- Some specialized services require referral.

## Process steps (as published in service data)

1. Find the nearest government hospital.
2. Visit the OPD counter with your NID.
3. Collect a token and consult the duty doctor.
4. Collect medicine from the hospital pharmacy.

## Verification checklist

- [ ] Find the official DGHS website, confirm the `.gov.bd` domain, and propose it as `officialUrl` (candidate above — verify before adding).
- [ ] Confirm hospitals are free/nominal fee and OPD is same-day.
- [ ] Confirm the step flow: find hospital → OPD counter with NID → token → duty doctor → pharmacy.
- [ ] Confirm some specialised services need a referral.
- [ ] Update `lastVerifiedAt` → today's date once `officialUrl` is set.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
