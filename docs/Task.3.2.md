# Task 3.2 — Income Tax Return

> Group 3 · Tax, Land & Local Services
> Verify against the NBR e-Return portal — same domain as Task 3.1, do them together.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/income-tax-return` |
| Service ID | `svc-income-tax-return` |
| Category | `tax-finance` |
| Department / Authority | National Board of Revenue (NBR) |
| Official portal | [https://etax.nbr.gov.bd/](https://etax.nbr.gov.bd/) |
| Fee | Free (filing); tax liability as assessed |
| Processing time | Acknowledgement instantly; assessment varies |
| Mode | 🌐 Fully online · 🏢 No office visit |
| Last verified (data) | `2026-09-25` |

## Documents needed

- [ ] TIN certificate
- [ ] NID card
- [ ] Income and deduction statements / employer certificate (Challan 6)
- [ ] Bank statement (if applicable)

## Eligibility

- TIN holder with taxable income.
- Individuals required to file by the deadline set by NBR.

## Process steps (as published in service data)

1. Log in to the e-Return portal.
2. Fill in income, deduction and investment schedules.
3. Submit the return and download the acknowledgement.
4. Pay any due tax through the e-challan system.

## Verification checklist

- [ ] Confirm the e-Return login/registration flow works on the official portal.
- [ ] Confirm the current-year filing deadline for individual taxpayers (NBR usually sets 30 November, with possible extensions).
- [ ] Confirm filing is free and the acknowledgement is generated instantly.
- [ ] Confirm the e-challan payment flow for any tax due.
- [ ] Confirm which URL hosts the live e-Return login (`etax.nbr.gov.bd` vs `etaxnbr.gov.bd`) and correct `officialUrl` if needed.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
