# Task 4.3 — Trade License (New)

> Group 4 · Police, Business & Agriculture
> Verify against the single-window business portal.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/trade-license` |
| Service ID | `svc-trade-license` |
| Category | `business` |
| Department / Authority | City Corporation / Municipality |
| Official portal | [https://www.businessone-stop.bd/](https://www.businessone-stop.bd/) |
| Fee | Varies by trade category and business size |
| Processing time | 7–30 days |
| Mode | 🌐 Online application · 🏢 Office visit required |
| Last verified (data) | `2026-09-10` |

## Documents needed

- [ ] NID card and photographs
- [ ] Rent agreement or ownership document of business premises
- [ ] Holding tax receipt
- [ ] Name clearance (for Ltd. / specific trades)

## Eligibility

- Business operating within the city/municipal boundary.
- Proprietor aged 18 or above with NID.
- No objection from neighbours where applicable.

## Process steps (as published in service data)

1. Apply through the single-window business portal or ward office.
2. Submit documents and pay the fee.
3. Inspection by the licensing inspector (if required).
4. Collect the trade license.

## Verification checklist

- [ ] Confirm the application route: single-window portal or ward office.
- [ ] Confirm eligibility: business inside city/municipal boundary, proprietor 18+ with NID, neighbour NOC where applicable.
- [ ] Confirm processing 7–30 days, possible inspection by the licensing inspector, and fee varies by trade category.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
