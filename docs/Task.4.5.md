# Task 4.5 — Farmer Subsidy Services

> Group 4 · Police, Business & Agriculture
> Office-based service with no official link in the data — finding the official agriculture portal is part of this task.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/farmer-subsidy` |
| Service ID | `svc-agriculture-subsidy` |
| Category | `agriculture` |
| Department / Authority | Ministry of Agriculture / Department of Agricultural Extension (DAE) |
| Official portal | ⚠️ Not set in data — **proposed:** [https://dae.gov.bd/](https://dae.gov.bd/) (DAE; Ministry candidates to confirm: `moa.gov.bd` / `moagri.gov.bd`) — verify the live `.gov.bd` domain during verification |
| Fee | Free |
| Processing time | Program dependent |
| Mode | 🏢 Offline — office visit required (`isOnline: false`) |
| Last verified (data) | ⚠️ Not set |

## Documents needed

- [ ] NID card
- [ ] Land ownership or lease documents
- [ ] Passport-size photographs

## Eligibility

- Registered farmers with verifiable land/lease information.
- Program-specific criteria published by the department.

## Process steps (as published in service data)

1. Visit the upazila Agriculture Office.
2. Register as a farmer with supporting documents.
3. Apply for the relevant subsidy program.
4. Track approval through the office.

## Verification checklist

- [ ] Verify the official Ministry of Agriculture / DAE website, confirm the `.gov.bd` domain, and propose it as `officialUrl` (candidate above — verify before adding).
- [ ] Confirm current subsidy programs (seeds, inputs) published by the department.
- [ ] Confirm eligibility: registered farmer with verifiable land/lease information.
- [ ] Confirm the 4 steps: visit upazila Agriculture Office → register as farmer → apply for program → track approval.
- [ ] Update `lastVerifiedAt` → today's date once `officialUrl` is set.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
