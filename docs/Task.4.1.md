# Task 4.1 — Police Clearance Certificate (PCC)

> Group 4 · Police, Business & Agriculture
> Verify against the Bangladesh Police Clearance portal (do together with Task 4.2).

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/police-clearance` |
| Service ID | `svc-police-clearance` |
| Category | `police-legal` |
| Department / Authority | Bangladesh Police |
| Official portal | [https://pcc.police.gov.bd/](https://pcc.police.gov.bd/) |
| Fee | ৳500 (standard); express delivery fee is higher |
| Processing time | 7–15 days |
| Mode | 🌐 Online application · 🏢 Office visit required |
| Last verified (data) | `2026-09-28` |

## Documents needed

- [ ] NID card
- [ ] Passport-size photographs
- [ ] Present and permanent address proof
- [ ] Fee receipt

## Eligibility

- Bangladeshi citizen aged 18 or above.
- NID card as identity proof.
- Needed for jobs, visas and higher study abroad.

## Process steps (as published in service data)

1. Apply online through the Police Clearance portal.
2. Pay the fee and upload photographs.
3. Provide fingerprints at the assigned police office if required.
4. Track the application and download the certificate.

## Verification checklist

- [ ] Confirm the online application flow and fee ৳500 (standard) / higher for express.
- [ ] Confirm the fingerprint step at the assigned police office and processing 7–15 days.
- [ ] Confirm eligibility: citizen aged 18+, used for jobs/visas/study abroad.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
