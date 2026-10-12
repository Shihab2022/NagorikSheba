# Task 3.5 — Holding Tax (উন্নয়ন কর)

> Group 3 · Tax, Land & Local Services
> No official link in the data (the service is marked online) — finding the correct city portal is part of this task.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/holding-tax` |
| Service ID | `svc-holding-tax` |
| Category | `local-government` |
| Department / Authority | City Corporation / Municipality |
| Official portal | ⚠️ Not set in data — there is **no single national portal**; find the official e-payment page of the relevant City Corporation / Municipality (e.g. Gazipur: [https://erevenue.gcc.gov.bd/](https://erevenue.gcc.gov.bd/)) and confirm the `.gov.bd` domain |
| Fee | Based on holding category and area |
| Processing time | Same day |
| Mode | 🌐 Online payment available (`isOnline: true`) · 🏢 No office visit required |
| Last verified (data) | ⚠️ Not set |

## Documents needed

- [ ] Holding number
- [ ] Previous tax receipt
- [ ] NID card

## Eligibility

- Owner of a recorded holding within the city/municipal area.

## Process steps (as published in service data)

1. Find your holding number at the zonal office.
2. Calculate dues for the fiscal year.
3. Pay at the designated bank or online channel.
4. Collect the receipt.

## Verification checklist

- [ ] Confirm how the holding number is found (zonal office) and how dues are calculated.
- [ ] Confirm the online payment channels that actually work today.
- [ ] Confirm same-day processing and fee "based on holding category and area".
- [ ] Propose an official `.gov.bd` e-payment URL as `officialUrl` (city-specific — confirm before adding).
- [ ] Update `lastVerifiedAt` → today's date once `officialUrl` is set.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
