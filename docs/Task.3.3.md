# Task 3.3 — Land Mutation (নামজারি)

> Group 3 · Tax, Land & Local Services
> Verify against the National Land Services portal (do together with Task 3.4 — same portal).

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/land-mutation` |
| Service ID | `svc-land-mutation` |
| Category | `land-property` |
| Department / Authority | Office of the Deputy Commissioner / SAC (Land), Ministry of Land |
| Official portal | [https://land.gov.bd/](https://land.gov.bd/) |
| Fee | Government fee based on land value and mouja schedule |
| Processing time | 15–60 days (hearing dependent) |
| Mode | 🏢 Office-based in data (`isOnline: false`) · 🏢 Office visit required |
| Last verified (data) | `2026-09-15` |

## Documents needed

- [ ] Registered deed (original and photocopy)
- [ ] Latest khatian (downloadable from the land portal)
- [ ] Tax clearance / khajna receipt
- [ ] NID card and photographs of the applicant
- [ ] Deed writer's information sheet (chalana)

## Eligibility

- Registered deed of sale / gift / inheritance (probate where applicable).
- Land taxes (khajna) up to date.
- Applicant recorded as the transferee in the deed.

## Process steps (as published in service data)

1. Collect the current khatian from the land service portal.
2. Apply at the SAC (Land) office with the registered deed.
3. Publish hearing notice and complete the hearing.
4. Get mutation citation and updated khatian.
5. Pay applicable land development tax.

## Verification checklist

- [ ] Confirm the mutation application route: land portal or SAC (Land) office of the upazila.
- [ ] Confirm pre-conditions: deed registered at Sub-Registrar, land taxes up to date, applicant recorded as transferee.
- [ ] Confirm processing 15–60 days (hearing dependent) and that the outcome is mutation citation + updated khatian.
- [ ] Resolve the mode discrepancy: data says `isOnline: false`, but an online application route may exist — update `isOnline` if confirmed.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Office locations: Upazila Land Office, Sub-Registrar Office.
- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
