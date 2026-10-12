# Task 1.3 — Death Registration

> Group 1 · Identity, Civil Registration & Citizen Welfare
> Verify against BDRIS — same portal as Task 1.2, do them together.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/death-registration` |
| Service ID | `svc-death-registration` |
| Category | `identity-documents` |
| Department / Authority | BDRIS — Office of the Registrar General, Birth & Death Registration |
| Official portal | [https://www.bdris.gov.bd/](https://www.bdris.gov.bd/) |
| Fee | Free within 15 days; late fee may apply |
| Processing time | Same day to 7 days |
| Mode | 🌐 Online verification · 🏢 Office visit required |
| Last verified (data) | `2026-09-18` |

## Documents needed

- [ ] Hospital or graveyard/cremation ground certificate
- [ ] Applicant's NID card
- [ ] Deceased person's NID card (if available)

## Eligibility

- Family members or legal heirs of the deceased can apply.
- Must be registered within 1 year of the death.

## Process steps (as published in service data)

1. Obtain the death report from the hospital or burial ground.
2. Complete the form at the local registrar office.
3. Submit supporting documents and the applicant's NID.
4. Collect the Death Registration Certificate.

## Verification checklist

- [ ] Confirm the 1-year registration deadline and the free-within-15-days rule.
- [ ] Confirm processing time (same day – 7 days) and that the applicant must be a family member/legal heir.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
