# Task 3.6 — Union Parishad Certificates (Citizenship / Residence / Family)

> Group 3 · Tax, Land & Local Services
> Office-based service — verifying that it stays offline (or finding an official source) is part of this task.

## Quick reference

| Field | Value |
| --- | --- |
| Route to check | `/services/union-parishad-certificates` |
| Service ID | `svc-union-parishad-certificates` |
| Category | `local-government` |
| Department / Authority | Union Parishad |
| Official portal | ⚠️ Not set — no single portal for this office service. Verify from an official Union Parishad / Local Government source with a `.gov.bd` domain (possible reference: [https://forms.portal.gov.bd/](https://forms.portal.gov.bd/)) or note it stays offline |
| Fee | Free to nominal fee |
| Processing time | 1–7 days |
| Mode | 🏢 Offline — office visit required (`isOnline: false`) |
| Last verified (data) | ⚠️ Not set |

## Documents needed

- [ ] NID card
- [ ] Photographs
- [ ] Supporting documents (electricity bill / holding receipt) where needed

## Eligibility

- Permanent residents of the Union Parishad area.
- Valid NID with matching address information.

## Process steps (as published in service data)

1. Collect the application form from the Union Parishad office.
2. Fill in the purpose and attach documents.
3. Submit and collect the certified copy after verification.

## Verification checklist

- [ ] Confirm the applicant must be a permanent resident with NID address matching the area.
- [ ] Confirm processing 1–7 days and fee free to nominal.
- [ ] Confirm the 3 steps: collect form → fill purpose + attach documents → submit and collect certified copy.
- [ ] Confirm whether any official `.gov.bd` source should be set as `officialUrl`, or leave it unset for this offline service.
- [ ] Update `lastVerifiedAt` → today's date.

## Notes

- Data source: [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts).
