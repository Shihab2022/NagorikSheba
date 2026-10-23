# Task 1.4 — Birth Certificate Copy (Online)

> Group 1 · Identity, Civil Registration & Citizen Welfare
> Verify against the BDRIS verification portal — do with Tasks 1.2 & 1.3.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/birth-certificate-copy` |
| Service ID | `svc-birth-certificate-copy` |
| Category | `identity-documents` |
| Department / Authority | BDRIS — Office of the Registrar General, Birth & Death Registration |
| Official portal | [https://www.bdris.gov.bd/](https://www.bdris.gov.bd/) |
| Fee | Free (online copy) |
| Processing time | Instant download |
| Mode | 🌐 Fully online · 🏢 No office visit |
| Last verified (data) | `2026-09-18` |

## Documents needed

- [ ] Registration number
- [ ] Date of birth
- [ ] Father's / mother's name

## Eligibility

- The birth must already be registered with BDRIS.
- Requester's details must match the registration record.

## Process steps (as published in service data)

1. Open the BDRIS verification portal.
2. Enter registration number and birth date.
3. Download the verified copy.

## Verification checklist

- [ ] Confirm the download flow really gives an instant verified copy and is free.
- [ ] Test the portal with any sample/known registration number if possible.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
