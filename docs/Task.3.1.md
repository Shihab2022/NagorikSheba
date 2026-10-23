# Task 3.1 — e-TIN Registration

> Group 3 · Tax, Land & Local Services
> Verify against the NBR e-Registration portal (do together with Task 3.2 — same portal).

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/e-tin` |
| Service ID | `svc-etin` |
| Category | `tax-finance` |
| Department / Authority | National Board of Revenue (NBR) |
| Official portal | [https://etax.nbr.gov.bd/](https://etax.nbr.gov.bd/) |
| Fee | Free |
| Processing time | Instant (online issuance) |
| Mode | 🌐 Fully online · 🏢 No office visit |
| Last verified (data) | `2026-09-25` |
| Difficulty / time | ⭐ Easy — 30 min |

## Documents needed

- [ ] NID card or passport
- [ ] Valid mobile number and email address
- [ ] TIN registration form (generated online)

## Eligibility

- Individuals aged 18 or above with taxable income.
- Anyone needing a TIN for property, trade or employment purposes.

## Process steps (as published in service data)

1. Open the e-Registration portal and create an account.
2. Fill in personal and income source details.
3. Submit and download the TIN certificate.

## Verification checklist

- [ ] Confirm account creation works and TIN is issued instantly / free.
- [ ] Confirm eligibility: age 18+ with taxable income, or anyone needing TIN for property/trade/employment.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
