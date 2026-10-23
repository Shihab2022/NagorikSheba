# NagorikSheba — Documentation

Verification task book for every government service listed in the project.
Each file in this folder is a working checklist for verifying one service
against its official government portal and updating the service data afterwards.

## How to use these docs

1. Open a task file (e.g. [`Task.1.1.md`](Task.1.1.md)).
2. Visit the **route to check** on the running site (`http://localhost:3000/services/<slug>`).
3. Open the **official portal** link and walk through the real application flow.
4. Tick every item in the **Verification checklist**.
5. Update [`frontend/lib/data/services.ts`](../frontend/lib/data/services.ts) —
   correct `fee`, `processingTime`, `steps`, `officialUrl`, and set `lastVerifiedAt`
   to today's ISO date.

## Conventions

| Convention | Value |
| --- | --- |
| File name | `Task.<group>.<n>.md` (e.g. `Task.2.3.md`) |
| Scope | One file = one service = one route |
| Checkboxes | Open verification items — tick when confirmed on the live portal |
| URLs | Only real `.gov.bd` portals; never invent an official URL |
| Data source | All service facts come from `frontend/lib/data/services.ts` |
| Status | All tasks start unticked; a ticked checklist means the entry is re-verified |

## Task index

### Group 1 — Identity, Civil Registration & Citizen Welfare

| Task | Service | Route | Official portal |
| --- | --- | --- | --- |
| [Task 1.1](Task.1.1.md) | NID Correction | `/services/nid-correction` | https://services.nidw.gov.bd/ |
| [Task 1.2](Task.1.2.md) | Birth Registration | `/services/birth-registration` | https://www.bdris.gov.bd/ |
| [Task 1.3](Task.1.3.md) | Death Registration | `/services/death-registration` | https://www.bdris.gov.bd/ |
| [Task 1.4](Task.1.4.md) | Birth Certificate Copy (Online) | `/services/birth-certificate-copy` | https://www.bdris.gov.bd/ |
| [Task 1.5](Task.1.5.md) | Old Age Allowance (ভরণপোষণ ভাতা) | `/services/old-age-allowance` | _to be verified — see task_ |
| [Task 1.6](Task.1.6.md) | Government Hospital Services | `/services/government-hospital-services` | _proposed: https://dghs.gov.bd/_ |

### Group 2 — Passport, Transport & Education

> Only 3 websites in total (e-Passport ×2, BRTA ×2, Education Board ×1) — all public portals.

| Task | Service | Route | Official portal |
| --- | --- | --- | --- |
| [Task 2.1](Task.2.1.md) | e-Passport (New Application) | `/services/epassport-new` | https://www.epassport.gov.bd/ |
| [Task 2.2](Task.2.2.md) | Passport Renewal (Re-issue) | `/services/passport-renewal` | https://www.epassport.gov.bd/ |
| [Task 2.3](Task.2.3.md) | Driving License | `/services/driving-license` | https://bsp.brta.gov.bd/ |
| [Task 2.4](Task.2.4.md) | Vehicle Registration | `/services/vehicle-registration` | https://bsp.brta.gov.bd/ |
| [Task 2.5](Task.2.5.md) | Education Board Results | `/services/education-board-results` | https://www.educationboardresults.gov.bd/ |

### Group 3 — Tax, Land & Local Services

| Task | Service | Route | Official portal |
| --- | --- | --- | --- |
| [Task 3.1](Task.3.1.md) | e-TIN Registration | `/services/e-tin` | https://etax.nbr.gov.bd/ |
| [Task 3.2](Task.3.2.md) | Income Tax Return | `/services/income-tax-return` | https://etax.nbr.gov.bd/ |
| [Task 3.3](Task.3.3.md) | Land Mutation (নামজারি) | `/services/land-mutation` | https://land.gov.bd/ |
| [Task 3.4](Task.3.4.md) | Land Development Tax (খাজনা) | `/services/land-development-tax` | https://land.gov.bd/ |
| [Task 3.5](Task.3.5.md) | Holding Tax (উন্নয়ন কর) | `/services/holding-tax` | _to be verified — city portal_ |
| [Task 3.6](Task.3.6.md) | Union Parishad Certificates | `/services/union-parishad-certificates` | _offline service_ |

### Group 4 — Police, Business & Agriculture

| Task | Service | Route | Official portal |
| --- | --- | --- | --- |
| [Task 4.1](Task.4.1.md) | Police Clearance Certificate (PCC) | `/services/police-clearance` | https://pcc.police.gov.bd/ |
| [Task 4.2](Task.4.2.md) | General Diary (GD) | `/services/general-diary` | https://www.police.gov.bd/ |
| [Task 4.3](Task.4.3.md) | Trade License (New) | `/services/trade-license` | https://www.businessone-stop.bd/ |
| [Task 4.4](Task.4.4.md) | Company Registration (RJSC) | `/services/company-registration` | https://roc.gov.bd/ |
| [Task 4.5](Task.4.5.md) | Farmer Subsidy Services | `/services/farmer-subsidy` | _proposed: https://dae.gov.bd/_ |

## Progress overview

| Group | Tasks | Open checklists |
| --- | --- | --- |
| Group 1 — Identity & Civil Registration | 6 | 6 |
| Group 2 — Passport, Transport & Education | 5 | 5 |
| Group 3 — Tax, Land & Local Services | 6 | 6 |
| Group 4 — Police, Business & Agriculture | 5 | 5 |
| **Total** | **22 services** | **22** |

> A service entry is done when its checklist is fully ticked and
> `lastVerifiedAt` in `frontend/lib/data/services.ts` matches the verification date.
