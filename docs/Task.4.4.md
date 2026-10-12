# Task 4.4 — Company Registration (RJSC)

> Group 4 · Police, Business & Agriculture
> Verify against the Registrar of Joint Stock Companies portal.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/company-registration` |
| Service ID | `svc-company-registration` |
| Category | `business` |
| Department / Authority | Registrar of Joint Stock Companies and Firms (RJSC) |
| Official portal | [https://roc.gov.bd/](https://roc.gov.bd/) |
| Fee | Based on authorized capital |
| Processing time | 7–21 days |
| Mode | 🌐 Online application · 🏢 Office visit required |
| Last verified (data) | `2026-09-12` |

## Documents needed

- [ ] Name clearance (RUN form)
- [ ] Memorandum and Articles of Association (MOA / AOA)
- [ ] NID and TIN of directors/shareholders
- [ ] Rent agreement of the registered office

## Eligibility

- Minimum two directors and two shareholders (private limited).
- Registered office address inside Bangladesh.

## Process steps (as published in service data)

1. Reserve the company name (RUN).
2. Submit MOA, AOA and forms with fees.
3. Receive the Certificate of Incorporation.
4. Register for VAT/TIN as applicable.

## Verification checklist

- [ ] Confirm the process: reserve name (RUN) → submit MOA/AOA + forms → Certificate of Incorporation → VAT/TIN registration.
- [ ] Confirm requirements: minimum 2 directors and 2 shareholders, registered office inside Bangladesh.
- [ ] Confirm fee based on authorized capital and processing 7–21 days.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
