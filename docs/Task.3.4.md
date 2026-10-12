# Task 3.4 — Land Development Tax (খাজনা)

> Group 3 · Tax, Land & Local Services
> Same portal as Task 3.3 — do them together.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/land-development-tax` |
| Service ID | `svc-land-tax` |
| Category | `land-property` |
| Department / Authority | Ministry of Land / District Commissioner Office |
| Official portal | [https://land.gov.bd/](https://land.gov.bd/) — also check the dedicated portal [https://ldtax.gov.bd/](https://ldtax.gov.bd/) (confirm during verification) |
| Fee | Based on land type and area (mouja schedule) |
| Processing time | Same day at the land office |
| Mode | 🌐 Online payment available · 🏢 No office visit required |
| Last verified (data) | `2026-09-15` |

## Documents needed

- [ ] Khatian / dag information
- [ ] NID card
- [ ] Previous tax receipt (if any)

## Eligibility

- Recorded land owner of the relevant mouja.
- Tax must be paid within the government's fiscal schedule.

## Process steps (as published in service data)

1. Download the khatian or dag details from the land service portal.
2. Calculate the tax at the land office or online.
3. Pay at the designated bank / online channel.
4. Collect the electronic TTR receipt.

## Verification checklist

- [ ] Confirm tax can be paid at a designated bank / online and that an electronic TTR receipt is issued.
- [ ] Confirm same-day processing and payment within the government fiscal schedule.
- [ ] Confirm whether `ldtax.gov.bd` is the live dedicated land-development-tax portal and update `officialUrl` if appropriate.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
