# Task 2.5 — Education Board Results

> Group 2 · Passport, Transport & Education (Member 2 — 5 tasks)

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/education-board-results` |
| Service ID | `svc-education-results` |
| Category | `education` |
| Department / Authority | Ministry of Education / Education Boards |
| Official portal | [https://www.educationboardresults.gov.bd/](https://www.educationboardresults.gov.bd/) |
| Fee | Free |
| Processing time | Instant |
| Mode | 🌐 Fully online · 🏢 No office visit |
| Last verified (data) | `2026-09-05` |

## Documents needed

- [ ] Examination roll number
- [ ] Registration number
- [ ] Examination year

## Eligibility

- Candidates of SSC, HSC and equivalent examinations.
- Requires roll, registration and examination year.

## Process steps (as published in service data)

1. Open the official results portal.
2. Select examination type, year, board and enter roll/registration.
3. Submit to view and print the result sheet.

## Verification checklist

- [ ] Confirm the portal is live, results show instantly and are free.
- [ ] Confirm inputs required: examination type, year, board, roll, registration.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
