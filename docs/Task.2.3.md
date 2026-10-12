# Task 2.3 — Driving License

> Group 2 · Passport, Transport & Education (Member 2 — 5 tasks)
> Verify against the BRTA BSP portal (do together with Task 2.4 — same portal).

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/driving-license` |
| Service ID | `svc-driving-license` |
| Category | `transport` |
| Department / Authority | Bangladesh Road Transport Authority (BRTA) |
| Official portal | [https://bsp.brta.gov.bd/](https://bsp.brta.gov.bd/) |
| Fee | ৳345 for one vehicle category; ৳518 for two categories |
| Processing time | 7–30 days (test scheduling dependent) |
| Mode | 🌐 Online application · 🏢 Office visit required |
| Last verified (data) | `2026-10-01` |

## Documents needed

- [ ] NID card
- [ ] Learner licence certificate
- [ ] Bank payment receipt (BSP challan)
- [ ] Certificate from a registered doctor (fitness)
- [ ] Passport-size photographs

## Eligibility

- Minimum age 18 for motorcycle and light vehicle.
- Valid learner licence (where required).
- NID card as identity proof.

## Process steps (as published in service data)

1. Apply on the BRTA BSP portal and generate the fee challan.
2. Pay the fee at a designated bank and keep the receipt.
3. Upload the receipt and book a test slot.
4. Attend the BRTA office for written and traffic tests.
5. Collect the smart-card licence after approval.

## Verification checklist

- [ ] Confirm fee ৳345 (one category) / ৳518 (two categories) on the portal.
- [ ] Confirm the flow: BSP form → challan → upload receipt → book test slot → written/traffic test → smart card.
- [ ] Confirm minimum age rules (18 for motorcycle/light vehicle) and processing 7–30 days.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
