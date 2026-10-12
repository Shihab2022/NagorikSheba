# Task 2.1 — e-Passport (New Application)

> Group 2 · Passport, Transport & Education (Member 2 — 5 tasks)
> Why easy: only 3 websites total for this group (e-Passport ×2, BRTA ×2, Education Board ×1) — all public portals.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/epassport-new` |
| Service ID | `svc-epassport-new` |
| Category | `passport-immigration` |
| Department / Authority | Department of Immigration & Passports, Ministry of Home Affairs |
| Official portal | [https://www.epassport.gov.bd/](https://www.epassport.gov.bd/) |
| Fee | Starting from ৳3,000 (32 pages, 5 years, normal delivery) |
| Processing time | 7–21 days depending on delivery type |
| Mode | 🌐 Online application · 🏢 Office visit required |
| Last verified (data) | `2026-09-22` |

## Documents needed

- [ ] NID card (original and photocopy)
- [ ] Birth Registration Certificate
- [ ] Current/old passport (if any)
- [ ] Bank payment receipt (challan)
- [ ] Two passport-size photographs (as specified)

## Eligibility

- Bangladeshi citizen with a valid NID card.
- Existing machine-readable passport (if any) must be submitted during enrolment.
- Minors apply through parents or legal guardian.

## Process steps (as published in service data)

1. Apply online and fill the e-Passport form.
2. Pay the fee at a designated bank and save the receipt.
3. Book an appointment at a passport office / mobile passport camp.
4. Attend in person with original documents for enrolment.
5. Collect or receive the passport by post.

## Verification checklist

- [ ] Confirm the online application flow: apply → pay at bank → book appointment → in-person enrolment → delivery.
- [ ] Confirm fee starts from ৳3,000 (32 pages, 5 years, normal) and processing 7–21 days.
- [ ] Confirm office types: Regional/District Passport Office and Mobile Passport Camp.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
