# Task 1.5 — Old Age Allowance (ভরণপোষণ ভাতা)

> Group 1 · Identity, Civil Registration & Citizen Welfare
> No official link is set in the service data yet — finding/confirming the official portal is part of this task.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/old-age-allowance` |
| Service ID | `svc-old-age-allowance` |
| Category | `social-welfare` |
| Department / Authority | Ministry of Social Welfare — Directorate of Social Services |
| Official portal | ⚠️ Not set in data — **proposed:** [https://msw.gov.bd/](https://msw.gov.bd/) (Ministry of Social Welfare; alternative: [https://msw.portal.gov.bd/](https://msw.portal.gov.bd/)) — confirm live `.gov.bd` domain during verification |
| Fee | Free |
| Processing time | 1–3 months (selection list dependent) |
| Mode | 🏢 Offline — office visit required (`isOnline: false`) |
| Last verified (data) | ⚠️ Not set |

## Documents needed

- [ ] NID card (age proof)
- [ ] Recommendation from Union Parishad / Ward Councillor
- [ ] Photographs and bank account information

## Eligibility

- Bangladeshi citizen aged 65 or above.
- Family income below the government threshold.
- Registered voter with NID.

## Process steps (as published in service data)

1. Submit the application at the Union Parishad / Ward office.
2. Verification by the social services officer.
3. Selection in the upazila-approved list.
4. Receive allowance through the designated bank/mobile channel.

## Verification checklist

- [ ] Find the official Directorate of Social Welfare / Ministry of Social Welfare website, confirm the correct `.gov.bd` domain, and propose it as `officialUrl` (candidate above — verify before adding).
- [ ] Confirm eligibility: age 65+, family income below government threshold, registered voter.
- [ ] Confirm it is offline (`isOnline: false`, `requiresOfficeVisit: true`) and processing takes 1–3 months.
- [ ] Confirm the allowance is paid through the designated bank/mobile channel.
- [ ] Update `lastVerifiedAt` → today's date once `officialUrl` is set.

## Notes

- Authority: Ministry of Social Welfare / Directorate of Social Services.
- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
