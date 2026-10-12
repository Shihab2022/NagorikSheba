# Task 1.1 — NID Correction

> Group 1 · Identity, Civil Registration & Citizen Welfare
> Verify the service entry against the official Election Commission NID portal.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/nid-correction` |
| Service ID | `svc-nid-correction` |
| Category | `identity-documents` |
| Department / Authority | Election Commission — Bangladesh Election Commission |
| Official portal | [https://services.nidw.gov.bd/](https://services.nidw.gov.bd/) |
| Fee | Free for online correction; card reprint fee applies |
| Processing time | 7–15 days |
| Mode | 🌐 Online application · 🏢 Office visit required |
| Last verified (data) | `2026-09-20` |

## Documents needed

- [ ] NID card or certified copy
- [ ] Birth Registration Certificate / supporting document
- [ ] Recent passport-size photograph (only if photo change is requested)
- [ ] Application form printed from the portal

## Eligibility

- Bangladeshi citizen with an existing NID record.
- The information to correct must be supported by a valid document (BDRIS certificate, passport, etc.).
- Online correction is available for limited fields — others need an in-person visit.

## Process steps (as published in service data)

1. Create or log in to your account on the NID service portal.
2. Select the correction type and fill in the correct information.
3. Upload scanned copies of supporting documents.
4. Submit and print the acknowledgement copy.
5. Track the application until the updated card is delivered.

## Verification checklist

- [ ] Confirm the portal is live and login works.
- [ ] Confirm which correction fields are allowed online vs. which require an NID registration centre visit.
- [ ] Confirm fee (online correction free; card reprint fee applies) and processing time (7–15 days).
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Office locations: NID Registration Centres (Union Parishad / City Corporation areas).
- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
