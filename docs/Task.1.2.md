# Task 1.2 — Birth Registration

> Group 1 · Identity, Civil Registration & Citizen Welfare
> Verify against BDRIS (do together with Tasks 1.3 and 1.4 — same portal).

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/birth-registration` |
| Service ID | `svc-birth-registration` |
| Category | `identity-documents` |
| Department / Authority | BDRIS — Office of the Registrar General, Birth & Death Registration |
| Official portal | [https://www.bdris.gov.bd/](https://www.bdris.gov.bd/) |
| Fee | Free within 60 days; late registration fee applies afterwards |
| Processing time | Same day to 7 days |
| Mode | 🌐 Online verification · 🏢 Office visit required |
| Last verified (data) | `2026-09-18` |

## Documents needed

- [ ] Hospital birth slip or vaccination card
- [ ] Parents' NID cards
- [ ] National ID or passport of the applicant
- [ ] Address proof (utility bill / holding receipt)

## Eligibility

- Every birth occurring in Bangladesh must be registered.
- Parents or a legal guardian can apply on behalf of the child.
- Hospital birth slip (if available) simplifies the process.

## Process steps (as published in service data)

1. Collect the form from the local Union Parishad, Ward Office or hospital.
2. Fill in the birth details and attach supporting documents.
3. Submit the form to the registrar (Union Parishad / City Corporation).
4. Verify details and collect the printed certificate.
5. Verify the certificate online through BDRIS.

## Verification checklist

- [ ] Confirm the 60-day rule for standard registration and the late-registration approval process (Upazila Nirbahi Officer / City Corporation).
- [ ] Confirm fee (free within 60 days; late fee after) and processing time (same day – 7 days).
- [ ] Confirm office locations: Union Parishad / Municipality / Ward Office.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
