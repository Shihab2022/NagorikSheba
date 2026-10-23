# Task 2.4 — Vehicle Registration

> Group 2 · Passport, Transport & Education (Member 2 — 5 tasks)
> Same portal as Task 2.3 — do them together.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/vehicle-registration` |
| Service ID | `svc-vehicle-registration` |
| Category | `transport` |
| Department / Authority | Bangladesh Road Transport Authority (BRTA) |
| Official portal | [https://bsp.brta.gov.bd/](https://bsp.brta.gov.bd/) |
| Fee | Varies by vehicle category and engine capacity |
| Processing time | 7–15 days |
| Mode | 🌐 Online application · 🏢 Office visit required |
| Last verified (data) | `2026-10-01` |

## Documents needed

- [ ] Sale invoice and vehicle authenticity certificate (VAT / Green book)
- [ ] Owner's NID card and driving licence
- [ ] Insurance certificate
- [ ] Bank payment receipt (challan)

## Eligibility

- Vehicle purchased from a registered dealer.
- Owner holds a valid NID card and driving licence.

## Process steps (as published in service data)

1. Apply on the BRTA BSP portal with vehicle documents.
2. Pay the registration fee at a designated bank.
3. Submit original documents at the BRTA office.
4. Collect the Registration Certificate (Book) and number plate.

## Verification checklist

- [ ] Confirm the registration flow and that originals must be submitted at the BRTA office.
- [ ] Confirm processing 7–15 days and fee varies by vehicle category/engine capacity.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
