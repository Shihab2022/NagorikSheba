# Task 2.2 — Passport Renewal (Re-issue)

> Group 2 · Passport, Transport & Education (Member 2 — 5 tasks)
> Same portal as Task 2.1 — do them together.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/passport-renewal` |
| Service ID | `svc-passport-renewal` |
| Category | `passport-immigration` |
| Department / Authority | Department of Immigration & Passports, Ministry of Home Affairs |
| Official portal | [https://www.epassport.gov.bd/](https://www.epassport.gov.bd/) |
| Fee | Same as new passport fee (starting from ৳3,000) |
| Processing time | 7–21 days |
| Mode | 🌐 Online application · 🏢 Office visit required |
| Last verified (data) | `2026-09-22` |

## Documents needed

- [ ] Current passport (original)
- [ ] NID card
- [ ] Bank payment receipt
- [ ] Note: police verification may be required

## Eligibility

- Holder of a valid or expired e-Passport.
- NID information must match the passport application.

## Process steps (as published in service data)

1. Apply online under the re-issue/renewal option.
2. Pay the fee and book an appointment.
3. Attend the passport office with original documents.
4. Track delivery and collect the renewed passport.

## Verification checklist

- [ ] Confirm the re-issue/renewal option exists in the portal and NID must match passport data.
- [ ] Confirm fee equals new passport fee (from ৳3,000) and processing 7–21 days.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
