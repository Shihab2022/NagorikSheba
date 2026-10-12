# Task 4.2 — General Diary (GD)

> Group 4 · Police, Business & Agriculture
> Bangladesh Police — do with Task 4.1.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/general-diary` |
| Service ID | `svc-general-diary` |
| Category | `police-legal` |
| Department / Authority | Bangladesh Police |
| Official portal | [https://www.police.gov.bd/](https://www.police.gov.bd/) |
| Fee | Free |
| Processing time | Same day |
| Mode | 🏢 Offline — police station visit required (`isOnline: false`) |
| Last verified (data) | `2026-09-28` |
| Difficulty / time | ⭐ Easy — 20 min |

## Documents needed

- [ ] NID card of the applicant
- [ ] Details of the incident (written or dictated)

## Eligibility

- Any citizen wishing to record an incident for future reference.
- No fee is required for filing a GD.

## Process steps (as published in service data)

1. Visit the police station covering your area.
2. Provide the incident details in writing.
3. Verify the GD entry in the station register and take a copy.

## Verification checklist

- [ ] Confirm GD is free and recorded same day.
- [ ] Confirm the flow: visit the police station covering your area → give details in writing → verify entry in station register and take a copy.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
