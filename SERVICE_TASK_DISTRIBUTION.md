# NagorikSheba — Service Task Distribution for 4 Team Members

**Project:** NagorikSheba (Citizen Services Portal)
**Source of services:** Frontend → `/services` route (and `/search`)
**Total services to verify:** 22 (across 12 categories)
**Team size:** 4 members
**Data file:** `frontend/lib/data/services.ts`

> **How to use this document:** Copy everything below and paste it into Google Docs.
> For best formatting, open this file in GitHub / VS Code *Markdown preview*, select all, copy, then paste into Google Docs — headings, bullets and tables will keep their style.

---

## 1. Purpose of This Document

The `/services` route on our website lists every government service we provide. Each service shows: eligibility, required documents, fee, processing time, step-by-step guide, official website link and a **"Last Verified"** date.

This document divides all 22 services among 4 team members so that each person:

* knows exactly **which services are theirs**,
* knows **which official website to follow/flow** for each service,
* knows **which documents are needed** for that service,
* knows **which verification they must do**,
* knows **how easy/difficult** the task is and **how long** it should take.

---

## 2. Where Everything Lives (Quick Guide)

| What | Where |
|---|---|
| Services list page | `https://<our-site>/services` |
| Single service page | `https://<our-site>/services/<slug>` (e.g. `/services/nid-correction`) |
| Category page | `https://<our-site>/categories/<slug>` |
| Search page | `https://<our-site>/search` |
| Fees overview page | `https://<our-site>/fees` |
| All service data (edit here) | `frontend/lib/data/services.ts` |
| Categories data | `frontend/lib/data/categories.ts` |
| Data type definition | `frontend/lib/types.ts` |

**Fields you verify/update for every service:** `eligibility`, `requiredDocuments`, `fee`, `processingTime`, `steps`, `officialUrl`, `lastVerifiedAt`, `isOnline`, `requiresOfficeVisit`, `updatedLabel`.

---

## 3. The Standard Workflow — How Easily You Can Finish a Task

Every service task follows the **same 7 steps**. Once you do one, the rest are easy:

1. **Open our site** → go to `/services` → click your service (or open `/services/<slug>` directly).
2. **Open the official website** → click the "Visit Official Website" link (`officialUrl`) shown on the service page. If no link exists, find the official **.gov.bd** source yourself (see Rule R3).
3. **Compare field-by-field** on the official portal against our page: eligibility, required documents, fee, processing time, steps.
4. **Check the flow** → confirm the steps we wrote still match the portal's current process (login, form, payment, appointment, office visit).
5. **Fix the data** → update the values in `frontend/lib/data/services.ts` (or send the corrections to the developer if you are not coding).
6. **Update the verification date** → set `lastVerifiedAt: "YYYY-MM-DD"` (the day you checked) and `updatedLabel: "Updated just now"`.
7. **Confirm on the website** → reload `/services/<slug>` and check that the new **"Last Verified"** date appears. Mark your task ✅ in the status tracker (Section 8).

**Tips that make the task very easy:**
* Services that share the **same portal** (e.g. BDRIS ×3, e-Passport ×2, BRTA ×2, e-Tax ×2, Land ×2) — verify them **in one sitting** while the portal is already open.
* Keep **screenshots** of the official page as proof.
* Never invent information. If you cannot confirm something, keep the current value and flag it as **"Needs review"** (see Rules, Section 7).

---

## 4. Difficulty & Time Guide

| Level | Meaning | Time per service |
|---|---|---|
| ⭐ Easy | Public portal, no login needed, info visible on homepage | 20–30 min |
| ⭐⭐ Medium | Requires login, appointment flow, fee tables or multiple pages | 40–60 min |
| ⭐⭐⭐ Hard | Info scattered across multiple pages/notifications, office process involved | 60+ min |

**Total estimated effort:** ~12–13 hours across the team → about **3 hours per member** over 2 days.

## 5. Member Assignments — Task by Task

---

### 👤 MEMBER 1 — Identity, Civil Registration & Welfare (6 tasks)

**Theme:** NID, birth/death records and citizen welfare services.
**Why easy:** 3 of your 6 services use the **same BDRIS portal**, and NID uses one portal — you only visit 2–3 websites in total.

---

#### Task 1.1 — NID Correction
* **Route to check:** `/services/nid-correction`
* **Website to flow:** https://services.nidw.gov.bd/ (Election Commission NID portal)
* **Documents needed (shown on our page):**
  * NID card or certified copy
  * Birth Registration Certificate / supporting document
  * Recent passport-size photograph (only if photo change is requested)
  * Application form printed from the portal
* **Verification you must do:**
  * Confirm the portal is live and login works.
  * Confirm **which correction fields are allowed online** vs. which require an NID registration centre visit.
  * Confirm fee (online correction free; card reprint fee applies) and processing time (7–15 days).
  * Update `lastVerifiedAt` → today's date.
* **Difficulty / Time:** ⭐⭐ Medium — **45 min**

#### Task 1.2 — Birth Registration
* **Route to check:** `/services/birth-registration`
* **Website to flow:** https://www.bdris.gov.bd/ (BDRIS)
* **Documents needed:**
  * Hospital birth slip or vaccination card
  * Parents' NID cards
  * National ID or passport of the applicant
  * Address proof (utility bill / holding receipt)
* **Verification you must do:**
  * Confirm the **60-day rule** for standard registration and the late-registration approval process (Upazila Nirbahi Officer / City Corporation).
  * Confirm fee (free within 60 days; late fee after) and processing time (same day – 7 days).
  * Confirm office locations: Union Parishad / Municipality / Ward Office.
* **Difficulty / Time:** ⭐ Easy — **30 min**

#### Task 1.3 — Death Registration
* **Route to check:** `/services/death-registration`
* **Website to flow:** https://www.bdris.gov.bd/ (BDRIS — same portal as Task 1.2, do together)
* **Documents needed:**
  * Hospital or graveyard/cremation ground certificate
  * Applicant's NID card
  * Deceased person's NID card (if available)
* **Verification you must do:**
  * Confirm the **1-year registration deadline** and the free-within-15-days rule.
  * Confirm processing time (same day – 7 days) and that the applicant must be a family member/legal heir.
* **Difficulty / Time:** ⭐ Easy — **30 min**

#### Task 1.4 — Birth Certificate Copy (Online)
* **Route to check:** `/services/birth-certificate-copy`
* **Website to flow:** https://www.bdris.gov.bd/ (BDRIS verification portal — do with Tasks 1.2 & 1.3)
* **Documents needed:**
  * Registration number
  * Date of birth
  * Father's / mother's name
* **Verification you must do:**
  * Confirm the download flow really gives an **instant verified copy** and is free.
  * Test the portal with any sample/known registration number if possible.
* **Difficulty / Time:** ⭐ Easy — **20 min**

#### Task 1.5 — Old Age Allowance (ভরণপোষণ ভাতা)
* **Route to check:** `/services/old-age-allowance`
* **Website to flow:** No official link is set in our data yet. Find the official **Directorate of Social Welfare / Ministry of Social Welfare** website (search "Ministry of Social Welfare Bangladesh official site"), confirm the correct **.gov.bd** domain, and propose it as `officialUrl`.
* **Documents needed:**
  * NID card (age proof)
  * Recommendation from Union Parishad / Ward Councillor
  * Photographs and bank account information
* **Verification you must do:**
  * Confirm eligibility: age **65+**, family income below government threshold, registered voter.
  * Confirm it is **offline** (`isOnline: false`, `requiresOfficeVisit: true`) and processing takes 1–3 months.
  * Confirm the allowance is paid through the designated bank/mobile channel.
* **Difficulty / Time:** ⭐⭐ Medium — **35 min** (source finding takes extra time)

#### Task 1.6 — Government Hospital Services
* **Route to check:** `/services/government-hospital-services`
* **Website to flow:** No official link in our data. Find the official **DGHS (Directorate General of Health Services)** website, confirm the **.gov.bd** domain, propose it as `officialUrl`.
* **Documents needed:**
  * NID card (for admission / discount schemes)
* **Verification you must do:**
  * Confirm hospitals are free/nominal fee and OPD is same-day.
  * Confirm the step flow: find hospital → OPD counter with NID → token → duty doctor → pharmacy.
  * Confirm some specialised services need a referral.
* **Difficulty / Time:** ⭐ Easy — **25 min**

**Member 1 total: ~3 hours 45 min**

---

### 👤 MEMBER 2 — Passport, Transport & Education (5 tasks)

**Theme:** e-Passport, BRTA licence/vehicle and education results.
**Why easy:** Only **3 websites** total (e-Passport ×2, BRTA ×2, Education Board ×1) — all public portals.

---

#### Task 2.1 — e-Passport (New Application)
* **Route to check:** `/services/epassport-new`
* **Website to flow:** https://www.epassport.gov.bd/ (Department of Immigration & Passports)
* **Documents needed:**
  * NID card (original and photocopy)
  * Birth Registration Certificate
  * Current/old passport (if any)
  * Bank payment receipt (challan)
  * Two passport-size photographs (as specified)
* **Verification you must do:**
  * Confirm the online application flow: apply → pay at bank → book appointment → in-person enrolment → delivery.
  * Confirm fee **starts from ৳3,000** (32 pages, 5 years, normal) and processing **7–21 days**.
  * Confirm office types: Regional/District Passport Office and Mobile Passport Camp.
* **Difficulty / Time:** ⭐⭐ Medium — **45 min**

#### Task 2.2 — Passport Renewal (Re-issue)
* **Route to check:** `/services/passport-renewal`
* **Website to flow:** https://www.epassport.gov.bd/ (same portal as 2.1 — do together)
* **Documents needed:**
  * Current passport (original)
  * NID card
  * Bank payment receipt
  * Note: police verification may be required
* **Verification you must do:**
  * Confirm the **re-issue/renewal option** exists in the portal and NID must match passport data.
  * Confirm fee equals new passport fee (from ৳3,000) and processing 7–21 days.
* **Difficulty / Time:** ⭐ Easy — **30 min**

#### Task 2.3 — Driving License
* **Route to check:** `/services/driving-license`
* **Website to flow:** https://bsp.brta.gov.bd/ (BRTA BSP portal)
* **Documents needed:**
  * NID card
  * Learner licence certificate
  * Bank payment receipt (BSP challan)
  * Certificate from a registered doctor (fitness)
  * Passport-size photographs
* **Verification you must do:**
  * Confirm fee **৳345 (one category) / ৳518 (two categories)** on the portal.
  * Confirm the flow: BSP form → challan → upload receipt → book test slot → written/traffic test → smart card.
  * Confirm minimum age rules (18 for motorcycle/light vehicle) and processing 7–30 days.
* **Difficulty / Time:** ⭐⭐ Medium — **45 min**

#### Task 2.4 — Vehicle Registration
* **Route to check:** `/services/vehicle-registration`
* **Website to flow:** https://bsp.brta.gov.bd/ (BRTA — same portal as 2.3, do together)
* **Documents needed:**
  * Sale invoice and vehicle authenticity certificate (VAT / Green book)
  * Owner's NID card and driving licence
  * Insurance certificate
  * Bank payment receipt (challan)
* **Verification you must do:**
  * Confirm the registration flow and that originals must be submitted at the BRTA office.
  * Confirm processing 7–15 days and fee varies by vehicle category/engine capacity.
* **Difficulty / Time:** ⭐⭐ Medium — **40 min**

#### Task 2.5 — Education Board Results
* **Route to check:** `/services/education-board-results`
* **Website to flow:** https://www.educationboardresults.gov.bd/ (official results portal)
* **Documents needed:**
  * Examination roll number
  * Registration number
  * Examination year
* **Verification you must do:**
  * Confirm the portal is live, results show **instantly** and are **free**.
  * Confirm inputs required: examination type, year, board, roll, registration.
* **Difficulty / Time:** ⭐ Easy — **20 min**

**Member 2 total: ~3 hours**

---

### 👤 MEMBER 3 — Tax, Land & Local Government (6 tasks)

**Theme:** e-TIN/income tax, land records/taxes and local government certificates.
**Why easy:** Core portals are shared — **e-Tax ×2** and **land.gov.bd ×2** — only 2 main websites plus 2 local sources.

---

#### Task 3.1 — e-TIN Registration
* **Route to check:** `/services/e-tin`
* **Website to flow:** https://etax.nbr.gov.bd/ (NBR e-Registration portal)
* **Documents needed:**
  * NID card or passport
  * Valid mobile number and email address
  * TIN registration form (generated online)
* **Verification you must do:**
  * Confirm account creation works and TIN is issued **instantly / free**.
  * Confirm eligibility: age 18+ with taxable income, or anyone needing TIN for property/trade/employment.
* **Difficulty / Time:** ⭐ Easy — **30 min**

#### Task 3.2 — Income Tax Return (e-Return)
* **Route to check:** `/services/income-tax-return`
* **Website to flow:** https://etax.nbr.gov.bd/ (same portal as 3.1 — do together)
* **Documents needed:**
  * TIN certificate
  * NID card
  * Income and deduction statements / employer certificate (Challan 6)
  * Bank statement (if applicable)
* **Verification you must do:**
  * Confirm the e-Return login flow and that acknowledgement is instant.
  * Confirm due tax is paid through the **e-challan** system.
  * Confirm the current filing deadline announced by NBR (note it if different from our page).
* **Difficulty / Time:** ⭐⭐ Medium — **45 min**

#### Task 3.3 — Land Mutation (নামজারি)
* **Route to check:** `/services/land-mutation`
* **Website to flow:** https://land.gov.bd/ (National Land Services portal)
* **Documents needed:**
  * Registered deed (original and photocopy)
  * Latest khatian (downloadable from the land portal)
  * Tax clearance / khajna receipt
  * NID card and photographs of the applicant
  * Deed writer's information sheet (chalana)
* **Verification you must do:**
  * Confirm the mutation application route: land portal or **SAC (Land) office** of the upazila.
  * Confirm pre-conditions: deed registered at Sub-Registrar, land taxes up to date, applicant recorded as transferee.
  * Confirm processing **15–60 days (hearing dependent)** and that the outcome is mutation citation + updated khatian.
* **Difficulty / Time:** ⭐⭐ Medium — **45 min**

#### Task 3.4 — Land Development Tax (খাজনা)
* **Route to check:** `/services/land-development-tax`
* **Website to flow:** https://land.gov.bd/ (same portal as 3.3 — do together)
* **Documents needed:**
  * Khatian / dag information
  * NID card
  * Previous tax receipt (if any)
* **Verification you must do:**
  * Confirm tax can be paid at a designated bank / online and that an **electronic TTR receipt** is issued.
  * Confirm same-day processing and payment within the government fiscal schedule.
* **Difficulty / Time:** ⭐ Easy — **30 min**

#### Task 3.5 — Holding Tax (উন্নয়ন কর)
* **Route to check:** `/services/holding-tax`
* **Website to flow:** No official link in our data (service is marked online). Find the official **City Corporation / Municipality** e-payment portal for holding tax (e.g. your city corporation's official site), confirm the **.gov.bd** domain, propose it as `officialUrl`.
* **Documents needed:**
  * Holding number
  * Previous tax receipt
  * NID card
* **Verification you must do:**
  * Confirm how the holding number is found (zonal office) and how dues are calculated.
  * Confirm the online payment channels that actually work today.
  * Confirm same-day processing and fee "based on holding category and area".
* **Difficulty / Time:** ⭐⭐ Medium — **35 min**

#### Task 3.6 — Union Parishad Certificates (Citizenship / Residence / Family)
* **Route to check:** `/services/union-parishad-certificates`
* **Website to flow:** No official link in our data — this is an **office-based** service. Verify from the official **Union Parishad / Local Government** authority source (confirm a **.gov.bd** domain) or note it stays offline (`isOnline: false`).
* **Documents needed:**
  * NID card
  * Photographs
  * Supporting documents (electricity bill / holding receipt) where needed
* **Verification you must do:**
  * Confirm the applicant must be a permanent resident with NID address matching the area.
  * Confirm processing **1–7 days** and fee **free to nominal**.
  * Confirm the 3 steps: collect form → fill purpose + attach documents → submit and collect certified copy.
* **Difficulty / Time:** ⭐ Easy — **25 min**

**Member 3 total: ~3 hours 50 min**

---

### 👤 MEMBER 4 — Police, Legal, Business & Agriculture (5 tasks)

**Theme:** Police services, business registration and farmer services.
**Why easy:** 2 police services share the **police.gov.bd** family, business has 2 clear portals, and farmer subsidy is a simple office-visit service.

---

#### Task 4.1 — Police Clearance Certificate (PCC)
* **Route to check:** `/services/police-clearance`
* **Website to flow:** https://pcc.police.gov.bd/ (Bangladesh Police Clearance portal)
* **Documents needed:**
  * NID card
  * Passport-size photographs
  * Present and permanent address proof
  * Fee receipt
* **Verification you must do:**
  * Confirm the online application flow and fee **৳500 (standard)** / higher for express.
  * Confirm the fingerprint step at the assigned police office and processing **7–15 days**.
  * Confirm eligibility: citizen aged **18+**, used for jobs/visas/study abroad.
* **Difficulty / Time:** ⭐⭐ Medium — **40 min**

#### Task 4.2 — General Diary (GD)
* **Route to check:** `/services/general-diary`
* **Website to flow:** https://www.police.gov.bd/ (Bangladesh Police — do with 4.1)
* **Documents needed:**
  * NID card of the applicant
  * Details of the incident (written or dictated)
* **Verification you must do:**
  * Confirm GD is **free** and recorded **same day**.
  * Confirm the flow: visit the police station covering your area → give details in writing → verify entry in station register and take a copy.
* **Difficulty / Time:** ⭐ Easy — **20 min**

#### Task 4.3 — Trade License (New)
* **Route to check:** `/services/trade-license`
* **Website to flow:** https://www.businessone-stop.bd/ (Single-window business portal)
* **Documents needed:**
  * NID card and photographs
  * Rent agreement or ownership document of business premises
  * Holding tax receipt
  * Name clearance (for Ltd. / specific trades)
* **Verification you must do:**
  * Confirm the application route: single-window portal **or** ward office.
  * Confirm eligibility: business inside city/municipal boundary, proprietor 18+ with NID, neighbour NOC where applicable.
  * Confirm processing **7–30 days**, possible inspection by the licensing inspector, and fee varies by trade category.
* **Difficulty / Time:** ⭐⭐ Medium — **45 min**

#### Task 4.4 — Company Registration (RJSC)
* **Route to check:** `/services/company-registration`
* **Website to flow:** https://roc.gov.bd/ (Registrar of Joint Stock Companies)
* **Documents needed:**
  * Name clearance (RUN form)
  * Memorandum and Articles of Association (MOA / AOA)
  * NID and TIN of directors/shareholders
  * Rent agreement of the registered office
* **Verification you must do:**
  * Confirm the process: reserve name (RUN) → submit MOA/AOA + forms → Certificate of Incorporation → VAT/TIN registration.
  * Confirm requirements: minimum **2 directors and 2 shareholders**, registered office inside Bangladesh.
  * Confirm fee based on authorized capital and processing **7–21 days**.
* **Difficulty / Time:** ⭐⭐ Medium — **45 min**

#### Task 4.5 — Farmer Subsidy Services
* **Route to check:** `/services/farmer-subsidy`
* **Website to flow:** No official link in our data — an **office-based** service. Verify from the official **Ministry of Agriculture / Department of Agricultural Extension (DAE)** website (confirm the **.gov.bd** domain) and propose it as `officialUrl`.
* **Documents needed:**
  * NID card
  * Land ownership or lease documents
  * Passport-size photographs
* **Verification you must do:**
  * Confirm current subsidy programs (seeds, inputs) published by the department.
  * Confirm eligibility: registered farmer with verifiable land/lease information.
  * Confirm the 4 steps: visit upazila Agriculture Office → register as farmer → apply for program → track approval.
* **Difficulty / Time:** ⭐⭐ Medium — **35 min**

**Member 4 total: ~3 hours 25 min**

---

## 6. Master Summary — All 22 Tasks at a Glance

| # | Service | Member | Route | Official Website |
|---|---|---|---|---|
| 1 | NID Correction | M1 | /services/nid-correction | services.nidw.gov.bd |
| 2 | Birth Registration | M1 | /services/birth-registration | www.bdris.gov.bd |
| 3 | Death Registration | M1 | /services/death-registration | www.bdris.gov.bd |
| 4 | Birth Certificate Copy | M1 | /services/birth-certificate-copy | www.bdris.gov.bd |
| 5 | Old Age Allowance | M1 | /services/old-age-allowance | (to be found — Social Welfare) |
| 6 | Government Hospital Services | M1 | /services/government-hospital-services | (to be found — DGHS) |
| 7 | e-Passport (New) | M2 | /services/epassport-new | www.epassport.gov.bd |
| 8 | Passport Renewal | M2 | /services/passport-renewal | www.epassport.gov.bd |
| 9 | Driving License | M2 | /services/driving-license | bsp.brta.gov.bd |
| 10 | Vehicle Registration | M2 | /services/vehicle-registration | bsp.brta.gov.bd |
| 11 | Education Board Results | M2 | /services/education-board-results | www.educationboardresults.gov.bd |
| 12 | e-TIN Registration | M3 | /services/e-tin | etax.nbr.gov.bd |
| 13 | Income Tax Return | M3 | /services/income-tax-return | etax.nbr.gov.bd |
| 14 | Land Mutation | M3 | /services/land-mutation | land.gov.bd |
| 15 | Land Development Tax | M3 | /services/land-development-tax | land.gov.bd |
| 16 | Holding Tax | M3 | /services/holding-tax | (to be found — City Corp.) |
| 17 | Union Parishad Certificates | M3 | /services/union-parishad-certificates | (office-based) |
| 18 | Police Clearance Certificate | M4 | /services/police-clearance | pcc.police.gov.bd |
| 19 | General Diary (GD) | M4 | /services/general-diary | www.police.gov.bd |
| 20 | Trade License (New) | M4 | /services/trade-license | www.businessone-stop.bd |
| 21 | Company Registration (RJSC) | M4 | /services/company-registration | roc.gov.bd |
| 22 | Farmer Subsidy Services | M4 | /services/farmer-subsidy | (to be found — Agriculture/DAE) |

**Workload balance:** M1 = 6 tasks · M2 = 5 tasks · M3 = 6 tasks · M4 = 5 tasks

---

## 7. Rules Every Member Must Follow

* **R1 — Official sources only.** Verify only from official **.gov.bd** portals, ministries, directorates, or reputed news/notice boards of the authority. Never use blogs or third-party sites as the source of truth.
* **R2 — Never invent data.** If you cannot confirm a fee/step/document, keep the current value and report it as **"Needs review"** with a note.
* **R3 — Services without an official link (Old Age Allowance, Government Hospital, Holding Tax, Union Parishad Certificates, Farmer Subsidy).** Find the correct official **.gov.bd** domain first, confirm it really belongs to the authority, then propose it for the `officialUrl` field. If it is purely office-based, leave `isOnline: false` and `requiresOfficeVisit: true`.
* **R4 — Always update the date.** After verifying a service, set `lastVerifiedAt` to that day in `YYYY-MM-DD` format and `updatedLabel` to `"Updated just now"` — users see this as "Last Verified".
* **R5 — Screenshot proof.** Keep one screenshot of the official page showing fee/documents for each verified service.
* **R6 — Test the frontend.** After the data update, open `/services/<slug>` and confirm the "Last Verified" date and all sections (Documents, Fee, Steps) render correctly.
* **R7 — Search check.** Also test your services once from `/search` to confirm they appear with correct titles and documents.

---

## 8. Status Tracker (fill during work)

| Task ID | Service | Owner | Website checked | Docs checked | Fee/Time checked | Date updated | UI confirmed | ✅ Done |
|---|---|---|---|---|---|---|---|---|
| 1.1 | NID Correction | M1 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 1.2 | Birth Registration | M1 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 1.3 | Death Registration | M1 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 1.4 | Birth Certificate Copy | M1 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 1.5 | Old Age Allowance | M1 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 1.6 | Government Hospital Services | M1 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2.1 | e-Passport (New) | M2 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2.2 | Passport Renewal | M2 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2.3 | Driving License | M2 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2.4 | Vehicle Registration | M2 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2.5 | Education Board Results | M2 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1 | e-TIN Registration | M3 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.2 | Income Tax Return | M3 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.3 | Land Mutation | M3 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.4 | Land Development Tax | M3 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.5 | Holding Tax | M3 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.6 | Union Parishad Certificates | M3 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 4.1 | Police Clearance | M4 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 4.2 | General Diary (GD) | M4 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 4.3 | Trade License (New) | M4 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 4.4 | Company Registration (RJSC) | M4 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 4.5 | Farmer Subsidy Services | M4 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## 9. Suggested Schedule

* **Day 1:** Each member finishes their ⭐ Easy tasks first (fast wins), then starts Medium tasks. Group same-portal services together.
* **Day 2:** Finish remaining Medium tasks, update `lastVerifiedAt`, test `/services/<slug>` + `/search`, and mark the tracker complete.
* **Day 3 (30 min all-hands):** Review every service together on the `/services` route, clear any "Needs review" flags, final sign-off.

---

## 10. Sign-off

| Member | Name | Signature | Date |
|---|---|---|---|
| Member 1 — Identity, Civil Registration & Welfare |  |  |  |
| Member 2 — Passport, Transport & Education |  |  |  |
| Member 3 — Tax, Land & Local Government |  |  |  |
| Member 4 — Police, Legal, Business & Agriculture |  |  |  |

**Team lead final review:** _______________________ **Date:** ____________

---

*Document prepared for the NagorikSheba project — covers all 22 services shown on the `/services` route. Keep this file at the project root: `SERVICE_TASK_DISTRIBUTION.md`.*





