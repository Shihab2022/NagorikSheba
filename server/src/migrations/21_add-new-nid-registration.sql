-- Migration: Add New NID / Voter Registration service
DO $$
DECLARE
  v_category_id UUID;
  v_service_id UUID := '20000000-0000-0000-0000-000000000099';
BEGIN
  -- Get identity-documents category ID
  SELECT id INTO v_category_id FROM category WHERE slug = 'identity-documents' LIMIT 1;
  IF v_category_id IS NULL THEN
    SELECT id INTO v_category_id FROM category LIMIT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM services WHERE slug = 'nid-registration') THEN
    INSERT INTO services (
      id,
      "categoryId",
      name,
      slug,
      "shortDescription",
      description,
      eligibility,
      "processingTime",
      "officialUrl",
      "isPublished"
    ) VALUES (
      v_service_id,
      v_category_id,
      'New NID Registration',
      'nid-registration',
      'Apply for a new National ID (NID) card and voter registration.',
      'Bangladeshi citizens aged 16 and above can apply online for new National ID (NID) card registration. Complete the online application on the Election Commission portal, print the form, and attend the local Upazila or Thana Election Office for biometric enrolment (photo, fingerprints and iris scan).',
      'Bangladeshi citizen aged 16 or older; Never registered as a voter or NID card holder before; Must have verified 17-digit digital birth certificate',
      '15–30 days',
      'https://services.nidw.gov.bd/nid-pub/register-account',
      TRUE
    );

    -- Service Requirements
    INSERT INTO serviceRequirement ("serviceId", name, description, "isMandatory", "sortOrder")
    VALUES 
      (v_service_id, 'Digital Birth Registration Certificate (17-digit)', 'Verified 17-digit BDRIS birth certificate', TRUE, 1),
      (v_service_id, 'Educational Certificate (SSC / JSC or equivalent)', 'Academic certificate proving date of birth', FALSE, 2),
      (v_service_id, 'Parents'' NID Card Copies', 'Photocopies of father and mother National ID cards', TRUE, 3),
      (v_service_id, 'Citizenship Certificate', 'Issued by Union Parishad Chairman or Ward Councillor', TRUE, 4),
      (v_service_id, 'Utility Bill Copy', 'Electricity/gas/water bill for address proof', TRUE, 5)
    ON CONFLICT DO NOTHING;

    -- Service Steps
    INSERT INTO serviceStep ("serviceId", "stepNumber", title, description, "actionType", "officialUrl")
    VALUES 
      (v_service_id, 1, 'Register account on NID portal', 'Register an account on the Election Commission NID portal', 'VISIT_OFFICIAL_PORTAL', 'https://services.nidw.gov.bd/nid-pub/register-account'),
      (v_service_id, 2, 'Fill online application form', 'Fill personal, address and educational information using birth certificate number', 'PREPARE_DOCUMENTS', NULL),
      (v_service_id, 3, 'Download & print Form 2', 'Download and print the completed voter registration form', 'PREPARE_DOCUMENTS', NULL),
      (v_service_id, 4, 'Biometric enrolment at Election Office', 'Visit Upazila/Thana Election Office for photo, 10-fingerprints and iris scan', 'VISIT_OFFICE', NULL),
      (v_service_id, 5, 'Receive NID Card', 'Download digital NID copy online or collect physical Smart Card', 'READ_GUIDE', NULL)
    ON CONFLICT DO NOTHING;

    -- Service Fee
    INSERT INTO serviceFee ("serviceId", name, amount, currency, description)
    VALUES (v_service_id, 'Free of cost (First time registration)', 0.00, 'BDT', 'New NID voter registration is completely free of charge')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
