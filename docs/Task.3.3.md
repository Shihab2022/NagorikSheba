# Task 3.3 — Land Mutation (ই-নামজারি)

> Group 3 · Tax, Land & Local Services  
> Verified against the National Land Services Portal (`mutation.land.gov.bd` / `land.gov.bd`) and AFR Technology Video Tutorial (`https://youtu.be/SVmk61-JpN0`).

---

## Quick Reference

| Field | Value |
| --- | --- |
| Route to check | `/services/land-mutation` |
| Service ID | `svc-land-mutation` |
| Category | `land-property` |
| Department / Authority | Ministry of Land (ভূমি মন্ত্রণালয়) / Upazila & Circle Land Office (এসি ল্যান্ড অফিস) |
| Official Portal | [https://mutation.land.gov.bd/](https://mutation.land.gov.bd/) (Main: [https://land.gov.bd/](https://land.gov.bd/)) |
| Official Video Guide | [AFR Technology — Online Namjari Application](https://youtu.be/SVmk61-JpN0) |
| Total Government Fee | **৳১,১৭০ BDT** (আবেদন ফি: ২০/- + নোটিশ জারি: ৫০/- + রেকর্ড হালকরণ: ১,০০০/- + খতিয়ান/ডিসিআর: ১০০/-) |
| Processing Time | **২৮ কার্যদিবস** (28 working days citizen charter standard) |
| Mode | 🌐 **100% Online** (`isOnline: true`) · 🏛️ Hearing/Office visit optional/only if disputed (`requiresOfficeVisit: false`) |
| Verification Status | `VERIFIED` |
| Last Verified Date | `2026-10-15` |

---

## Required Documents (প্রয়োজনীয় কাগজপত্র)

- [x] **মূল দলিল / সার্টিফাইড কপি (Registered Deed):** জমি ক্রয়, হেবা, দান বা হস্তান্তরের রেজিস্ট্রিকৃত দলিলের স্পষ্ট স্ক্যান কপি।
- [x] **সর্বশেষ খতিয়ান (Latest Record of Rights / Khatian):** সিএস, এসএ, আরএস, বিএস বা সিটি জরিপ এবং নামজারি খতিয়ানের কপি।
- [x] **হালনাগাদ ভূমি উন্নয়ন কর রসিদ (Up-to-date Land Development Tax / Khajna Dakhila):** চলতি অর্থবছরের খাজনা পরিশোধের ইলেকট্রনিক দাখিলা।
- [x] **আবেদনকারীর এনআইডি ও পাসপোর্ট সাইজ ছবি (NID Card & Photo):** জাতীয় পরিচয়পত্র এবং সাম্প্রতিক ছবি।
- [x] **উত্তরাধিকার সনদ / ওয়ারিশান সনদ (Warishan Certificate):** উত্তরাধিকার সূত্রে জমির মালিকানা হলে স্থানীয় চেয়ারম্যান/কাউন্সিলর প্রদত্ত ওয়ারিশান সনদ (শর্তসাপেক্ষ)।
- [x] **আদালতের রায়/ডিক্রি (Court Decree):** আদালত কর্তৃক বণ্টননামা বা স্বত্ব ঘোষণার মাধ্যমে হলে রায়ের কপি (শর্তসাপেক্ষ)।
- [x] **আমমোক্তারনামা / পাওয়ার অব অ্যাটর্নি (Power of Attorney):** মূল মালিকের অনুপস্থিতিতে প্রতিনিধির মাধ্যমে আবেদন করা হলে (শর্তসাপেক্ষ)।

---

## Eligibility Criteria (আবেদনের যোগ্যতা)

1. আবেদনকারীকে উক্ত জমির বৈধ ক্রেতা, হেবাগ্রহীতা, ওয়ারিশ বা আইনগত অধিকারী হতে হবে।
2. সাব-রেজিস্ট্রি অফিসে জমি হস্তান্তরের দলিল যথাযথভাবে রেজিস্ট্রিকৃত থাকতে হবে।
3. জমির হালনাগাদ ভূমি উন্নয়ন কর (খাজনা) পরিশোধ থাকতে হবে।
4. জমিতে সরকারের কোনো স্বার্থ (খাস, অর্পিত, পরিত্যক্ত ইত্যাদি) বা কোনো নিষেধাজ্ঞা না থাকতে হবে।

---

## Step-by-Step Online Process (ভিডিও ও পোর্টাল অনুযায়ী ধাপে ধাপে পদ্ধতি)

1. **নাগরিক পোর্টাল লগইন ও এনআইডি ভেরিফিকেশন (Portal Access & NID Verification):**  
   `mutation.land.gov.bd` পোর্টালে প্রবেশ করে মোবাইল নম্বর, এনআইডি এবং জন্ম তারিখ দিয়ে নাগরিক প্রোফাইল তৈরি ও ওটিপি যাচাই সম্পন্ন করা।
2. **জমির তফসিল ও এখতিয়ারাধীন অফিস নির্বাচন (Location & Office Selection):**  
   বিভাগ, জেলা, উপজেলা/সার্কেল এবং সংশ্লিষ্ট মৌজা ও জেএল নম্বর নির্বাচন করা।
3. **নামজারির প্রকৃতি নির্বাচন (Category Selection):**  
   ক্রয়সূত্রে, হেবা সূত্রে, ওয়ারিশ সূত্রে, বা ডিক্রি সূত্রে আবেদন নির্বাচন করা।
4. **খতিয়ান ও দাগ বিবরণী প্রদান (Khatian, Dag & Land Amount Entry):**  
   পূর্ববর্তী রেকর্ডীয় খতিয়ান নম্বর, দাগ নম্বর এবং হস্তান্তরিত মোট জমির পরিমাণ (শতাংশ/একর) ও জমির শ্রেণি এন্ট্রি করা।
5. **আবেদনকারী, গ্রহীতা ও দাতার তথ্য প্রদান (Parties Information):**  
   ক্রেতা/গ্রহীতা এবং বিক্রেতা/রেকর্ডীয় মালিকদের বিস্তারিত তথ্য, স্থায়ী ও বর্তমান ঠিকানা লিপিবদ্ধ করা।
6. **প্রয়োজনীয় কাগজপত্র আপলোড (Scanned Document Upload):**  
   রেজিস্ট্রিকৃত দলিল, বায়া দলিল (প্রযোজ্য ক্ষেত্রে), খতিয়ান ও খাজনা রসিদের পিডিএফ ফাইল আপলোড করা।
7. **প্রাথমিক আবেদন ও নোটিশ ফি পরিশোধ (Initial Fee Submission):**  
   আবেদন জমা দেওয়ার সময় মোট **৳৭০/-** (কোর্ট ফি ২০/- + নোটিশ জারি ৫০/-) মোবাইল ব্যাংকিং (bKash, Nagad, Rocket ইত্যাদি) দিয়ে পরিশোধ করে আবেদন ট্র্যাকিং নম্বর ও আবেদন কপি ডাউনলোড করা।
8. **ভূমি অফিসের যাচাই ও শুনানি (Field Verification & Hearing):**  
   ইউনিয়ন ভূমি সহকারী কর্মকর্তা (তহশিলদার) সরেজমিনে তদন্ত প্রতিবেদন এসি ল্যান্ডে প্রেরণ করবেন। শুনানি প্রয়োজন হলে এসএমএস মারফত অনলাইন বা স্বশরীরে শুনানির তারিখ জানানো হবে।
9. **অনুমোদন ও চূড়ান্ত ডিওপি/খতিয়ান ফি পরিশোধ (Approval & Final Payment):**  
   সহকারী কমিশনার (ভূমি) কর্তৃক আবেদন মঞ্জুর হওয়ার পর অবশিষ্ট **৳১,১০০/-** (রেকর্ড হালকরণ ১,০০০/- + খতিয়ান/ডিসিআর ১০০/-) অনলাইনে পরিশোধ করা।
10. **কিউআর কোডযুক্ত ই-খতিয়ান ও ডিসিআর ডাউনলোড (Download E-Khatian & DCR):**  
    পেমেন্ট সম্পন্ন হওয়া মাত্রই সিস্টেম থেকে কিউআর কোড ভেরিফায়েড ডিজিটাল নামজারি খতিয়ান ও ডিসিআর রসিদ ডাউনলোড করা।

---

## Government Fee Breakdown (সরকার নির্ধারিত মোট ফি: ১,১৭০ টাকা)

| ফি-র খাত | সরকারি পরিমাণ | পরিশোধের সময় |
| --- | --- | --- |
| আবেদন কোর্ট ফি (Court Fee) | ৳২০.০০ BDT | আবেদন সাবমিট করার সময় |
| নোটিশ জারি ফি (Notice Issuance Fee) | ৳৫০.০০ BDT | আবেদন সাবমিট করার সময় |
| রেকর্ড সংশোধন/হালকরণ ফি (Record Correction Fee) | ৳১,০০০.০০ BDT | আবেদন মঞ্জুর হওয়ার পর |
| নামজারি খতিয়ান / ডিসিআর ফি (DCR / Khatian Fee) | ৳১০০.০০ BDT | আবেদন মঞ্জুর হওয়ার পর |
| **সর্বমোট** | **৳১,১৭০.০০ BDT** | **দুটি ধাপে প্রদেয়** |

---

## Verification Checklist

- [x] **Confirm the mutation application route:** Verified online via `mutation.land.gov.bd` / `land.gov.bd`.
- [x] **Confirm pre-conditions:** Verified registered deed, up-to-date land tax (খাজনা), NID verification.
- [x] **Confirm processing time:** 28 working days standard citizen charter.
- [x] **Resolve mode discrepancy:** Confirmed `isOnline: true`, `requiresOfficeVisit: false` (100% digital application, tracking, payment & download).
- [x] **Verified fee structure:** Fixed statutory fee of 1,170 BDT.
- [x] **Update `lastVerifiedAt`:** Set to `2026-10-15`.
