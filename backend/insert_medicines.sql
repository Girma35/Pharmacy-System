
-- 1. Alter the table to add missing columns from the migration (in case CREATE TABLE IF NOT EXISTS skipped them)
ALTER TABLE medicines 
ADD COLUMN IF NOT EXISTS form_and_strength VARCHAR(150),
ADD COLUMN IF NOT EXISTS unit_of_measure VARCHAR(50),
ADD COLUMN IF NOT EXISTS requires_prescription BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS storage_condition VARCHAR(50) DEFAULT 'room_temperature';

-- 2. Fix auto-increment sequences in case they are out of sync
SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories) + 1, 1), false);
SELECT setval('medicines_id_seq', COALESCE((SELECT MAX(id) FROM medicines) + 1, 1), false);

-- 3. Insert Categories first (unique names required)
INSERT INTO categories (name) VALUES ('Antibacterial') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-infective') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('UTI Treatment') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Analgesic / Antipyretic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('NSAID / Analgesic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('NSAID / Pain') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Opioid Analgesic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiplatelet / Pain') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('NSAID / Joints') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('NSAID / Gout') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Controlled Analgesic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Gout Medication') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Pediatric Analgesic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antacid / PPI') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antacid') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('H2 Antagonist') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antispasmodic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiemetic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-Diarrheal') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Diarrhea Management') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Laxative') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiflatulent / Antidote') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antihypertensive') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Diuretic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Beta-blocker') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Lipid-Lowering') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antihypertensive (Pregnancy)') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Cardiac Glycoside') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antianginal') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antidiabetic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antidiabetic (Cold Chain)') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Corticosteroid') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Thyroid Hormone') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antithyroid') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Bronchodilator') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiasthmatic Corticosteroid') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antitussive') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Expectorant') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antihistamine') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antihistamine / Cough') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiasthmatic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Pediatric Corticosteroid') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antifungal') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Topical Antifungal') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiviral') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Topical Antiviral') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anthelminthic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-schistosomal') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antimalarial') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiprotozoal') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Pediatric Antimalarial') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anxiolytic / Anticonvulsant') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anxiolytic / Emergency') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anticonvulsant') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antidepressant') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antipsychotic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anxiolytic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiparkinsonian') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Iron Supplement') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Vitamin Supplement') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Prenatal Supplement') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Mineral Supplement') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Pediatric Supplement') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Supplement') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Coagulant') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Ophthalmic Antibacterial') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Ophthalmic/Otic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Ophthalmic Anti-inflammatory') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-Glaucoma') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Mydriatic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Ophthalmic Lubricant') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Nasal Decongestant') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Nasal Cleanser') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Topical Steroid') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Topical Antibacterial') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-scabies') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Topical Antipruritic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Skin Protectant') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiseptic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Topical Antiseptic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Keratolytic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Hormonal Contraceptive') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Emergency Contraceptive') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Injectable Contraceptive') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Uterotonic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Prostaglandin Analog') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anticonvulsant (Eclampsia)') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Fertility Agent') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Preeclampsia Prevention') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Intravenous Fluid') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Emergency IV Glucose') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Electrolyte Supplement') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Electrolyte Balance') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Diluent') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anticholinergic / Antidote') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Emergency Anaphylaxis') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Opioid Antidote') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Local Anesthetic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Spinal Anesthetic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Inhalation Anesthetic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anesthetic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Neuromuscular Blocker') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Reversal Agent') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anticoagulant') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Low Molecular Weight Heparin') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antifibrinolytic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antidote for Warfarin') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiplatelet') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Immunosuppressant') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Cytotoxic Agent') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Hormone Therapy (Oncology)') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('BPH Agent') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Erectile Dysfunction') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Pediatric Antibacterial') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Broad-Spectrum Antibacterial') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Glycopeptide Antibacterial') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Aminoglycoside') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antitubercular') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiretroviral / HBV') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiretroviral') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-lice') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Immunomodulator') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-psoriasis') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-acne') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Topical Cautery Agent') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-hemorrhoidal') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Electrolyte Solution') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Osmotic Diuretic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Plasma Expander') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antioxidant Supplement') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Urinary Alkalinizer') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-ulcer / Antispasmodic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Prokinetic / Antiemetic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Anti-vertigo') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Migraine Prophylaxis') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antimigraine') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Ear Anti-infective') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Ear Antifungal') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Cerumenolytic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antihistamine Spray') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiasthmatic Steroid') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiasthmatic Combination') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('COPD Management') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Mucolytic') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Antiseptic Lozenge') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Topical Oral Analgesic') ON CONFLICT (name) DO NOTHING;

-- 3. Insert Medicines
INSERT INTO medicines (name, form_and_strength, category_id, unit_of_measure, selling_price, requires_prescription, storage_condition, stock_qty, low_stock_threshold, batch_no, expiry_date, purchase_price) VALUES
('Amoxicillin', '500mg Capsule', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 180, true, 'room_temperature', 100, 10, 'SEED-MED-001', '2028-12-31', 135),
('Amoxicillin + Clavulanic Acid (Augmentin)', '625mg Tablet', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 650, true, 'room_temperature', 100, 10, 'SEED-MED-002', '2028-12-31', 488),
('Ciprofloxacin', '500mg Tablet', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 150, true, 'room_temperature', 100, 10, 'SEED-MED-003', '2028-12-31', 113),
('Azithromycin', '500mg Tablet', (SELECT id FROM categories WHERE name='Antibacterial'), 'pack of 3', 320, true, 'room_temperature', 100, 10, 'SEED-MED-004', '2028-12-31', 240),
('Ceftriaxone', '1g Powder for Injection', (SELECT id FROM categories WHERE name='Antibacterial'), 'vial', 180, true, 'room_temperature', 100, 10, 'SEED-MED-005', '2028-12-31', 135),
('Doxycycline', '100mg Capsule', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 120, true, 'room_temperature', 100, 10, 'SEED-MED-006', '2028-12-31', 90),
('Metronidazole (Flagyl)', '250mg Tablet', (SELECT id FROM categories WHERE name='Anti-infective'), 'strip', 80, true, 'room_temperature', 100, 10, 'SEED-MED-007', '2028-12-31', 60),
('Cotrimoxazole (Bactrim)', '480mg Tablet', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 90, true, 'room_temperature', 100, 10, 'SEED-MED-008', '2028-12-31', 68),
('Ampicillin', '500mg Injection', (SELECT id FROM categories WHERE name='Antibacterial'), 'vial', 110, true, 'room_temperature', 100, 10, 'SEED-MED-009', '2028-12-31', 83),
('Cloxacillin', '500mg Capsule', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 160, true, 'room_temperature', 100, 10, 'SEED-MED-010', '2028-12-31', 120),
('Cefixime', '200mg Tablet', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 420, true, 'room_temperature', 100, 10, 'SEED-MED-011', '2028-12-31', 315),
('Cefuroxime', '500mg Tablet', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 580, true, 'room_temperature', 100, 10, 'SEED-MED-012', '2028-12-31', 435),
('Erythromycin', '250mg Tablet', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 140, true, 'room_temperature', 100, 10, 'SEED-MED-013', '2028-12-31', 105),
('Clindamycin', '150mg Capsule', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 350, true, 'room_temperature', 100, 10, 'SEED-MED-014', '2028-12-31', 263),
('Gentamicin', '80mg/2ml Injection', (SELECT id FROM categories WHERE name='Antibacterial'), 'ampoule', 70, true, 'room_temperature', 100, 10, 'SEED-MED-015', '2028-12-31', 53),
('Penicillin G Benzathine', '2.4 MIU Injection', (SELECT id FROM categories WHERE name='Antibacterial'), 'vial', 220, true, 'room_temperature', 100, 10, 'SEED-MED-016', '2028-12-31', 165),
('Procaine Penicillin', '4 MIU Injection', (SELECT id FROM categories WHERE name='Antibacterial'), 'vial', 150, true, 'room_temperature', 100, 10, 'SEED-MED-017', '2028-12-31', 113),
('Chloramphenicol', '250mg Capsule', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 110, true, 'room_temperature', 100, 10, 'SEED-MED-018', '2028-12-31', 83),
('Nitrofurantoin', '100mg Tablet', (SELECT id FROM categories WHERE name='UTI Treatment'), 'strip', 240, true, 'room_temperature', 100, 10, 'SEED-MED-019', '2028-12-31', 180),
('Levofloxacin', '500mg Tablet', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 380, true, 'room_temperature', 100, 10, 'SEED-MED-020', '2028-12-31', 285),
('Paracetamol', '500mg Tablet', (SELECT id FROM categories WHERE name='Analgesic / Antipyretic'), 'strip', 30, false, 'room_temperature', 100, 10, 'SEED-MED-021', '2028-12-31', 23),
('Ibuprofen', '400mg Tablet', (SELECT id FROM categories WHERE name='NSAID / Analgesic'), 'strip', 60, false, 'room_temperature', 100, 10, 'SEED-MED-022', '2028-12-31', 45),
('Diclofenac Sodium', '50mg Tablet', (SELECT id FROM categories WHERE name='NSAID / Pain'), 'strip', 50, true, 'room_temperature', 100, 10, 'SEED-MED-023', '2028-12-31', 38),
('Diclofenac Sodium', '75mg/3ml Injection', (SELECT id FROM categories WHERE name='NSAID / Pain'), 'ampoule', 45, true, 'room_temperature', 100, 10, 'SEED-MED-024', '2028-12-31', 34),
('Tramadol', '50mg Capsule', (SELECT id FROM categories WHERE name='Opioid Analgesic'), 'strip', 120, true, 'locked_cabinet', 100, 10, 'SEED-MED-025', '2028-12-31', 90),
('Acetylsalicylic Acid (Aspirin)', '100mg Tablet', (SELECT id FROM categories WHERE name='Antiplatelet / Pain'), 'strip', 40, false, 'room_temperature', 100, 10, 'SEED-MED-026', '2028-12-31', 30),
('Meloxicam', '15mg Tablet', (SELECT id FROM categories WHERE name='NSAID / Joints'), 'strip', 180, true, 'room_temperature', 100, 10, 'SEED-MED-027', '2028-12-31', 135),
('Naproxen', '500mg Tablet', (SELECT id FROM categories WHERE name='NSAID / Pain'), 'strip', 220, true, 'room_temperature', 100, 10, 'SEED-MED-028', '2028-12-31', 165),
('Celecoxib', '200mg Capsule', (SELECT id FROM categories WHERE name='NSAID / Joints'), 'strip', 350, true, 'room_temperature', 100, 10, 'SEED-MED-029', '2028-12-31', 263),
('Indomethacin', '25mg Capsule', (SELECT id FROM categories WHERE name='NSAID / Gout'), 'strip', 85, true, 'room_temperature', 100, 10, 'SEED-MED-030', '2028-12-31', 64),
('Pethidine', '50mg/ml Injection', (SELECT id FROM categories WHERE name='Controlled Analgesic'), 'ampoule', 450, true, 'locked_cabinet', 100, 10, 'SEED-MED-031', '2028-12-31', 338),
('Morphine Sulphate', '10mg Tablet', (SELECT id FROM categories WHERE name='Controlled Analgesic'), 'strip', 500, true, 'locked_cabinet', 100, 10, 'SEED-MED-032', '2028-12-31', 375),
('Allopurinol', '100mg Tablet', (SELECT id FROM categories WHERE name='Gout Medication'), 'strip', 140, true, 'room_temperature', 100, 10, 'SEED-MED-033', '2028-12-31', 105),
('Paracetamol Syrup', '120mg/5ml (100ml)', (SELECT id FROM categories WHERE name='Pediatric Analgesic'), 'bottle', 110, false, 'room_temperature', 100, 10, 'SEED-MED-034', '2028-12-31', 83),
('Ibuprofen Syrup', '100mg/5ml (100ml)', (SELECT id FROM categories WHERE name='Pediatric Analgesic'), 'bottle', 140, false, 'room_temperature', 100, 10, 'SEED-MED-035', '2028-12-31', 105),
('Omeprazole', '20mg Capsule', (SELECT id FROM categories WHERE name='Antacid / PPI'), 'strip', 110, true, 'room_temperature', 100, 10, 'SEED-MED-036', '2028-12-31', 83),
('Pantoprazole', '40mg Tablet', (SELECT id FROM categories WHERE name='Antacid / PPI'), 'strip', 190, true, 'room_temperature', 100, 10, 'SEED-MED-037', '2028-12-31', 143),
('Esomeprazole', '40mg Tablet', (SELECT id FROM categories WHERE name='Antacid / PPI'), 'strip', 280, true, 'room_temperature', 100, 10, 'SEED-MED-038', '2028-12-31', 210),
('Aluminum + Magnesium Hydroxide', '200ml Suspension', (SELECT id FROM categories WHERE name='Antacid'), 'bottle', 180, false, 'room_temperature', 100, 10, 'SEED-MED-039', '2028-12-31', 135),
('Ranitidine', '150mg Tablet', (SELECT id FROM categories WHERE name='H2 Antagonist'), 'strip', 90, true, 'room_temperature', 100, 10, 'SEED-MED-040', '2028-12-31', 68),
('Hyoscine Butylbromide (Buscopan)', '10mg Tablet', (SELECT id FROM categories WHERE name='Antispasmodic'), 'strip', 85, false, 'room_temperature', 100, 10, 'SEED-MED-041', '2028-12-31', 64),
('Metoclopramide', '10mg Tablet', (SELECT id FROM categories WHERE name='Antiemetic'), 'strip', 45, true, 'room_temperature', 100, 10, 'SEED-MED-042', '2028-12-31', 34),
('Ondansetron', '4mg Tablet', (SELECT id FROM categories WHERE name='Antiemetic'), 'strip', 260, true, 'room_temperature', 100, 10, 'SEED-MED-043', '2028-12-31', 195),
('Oral Rehydration Salt (ORS)', 'Sachet for 1L', (SELECT id FROM categories WHERE name='Anti-Diarrheal'), 'sachet', 25, false, 'room_temperature', 100, 10, 'SEED-MED-044', '2028-12-31', 19),
('Zinc Sulphate', '20mg Tablet', (SELECT id FROM categories WHERE name='Diarrhea Management'), 'strip', 60, false, 'room_temperature', 100, 10, 'SEED-MED-045', '2028-12-31', 45),
('Loperamide', '2mg Capsule', (SELECT id FROM categories WHERE name='Anti-Diarrheal'), 'strip', 50, false, 'room_temperature', 100, 10, 'SEED-MED-046', '2028-12-31', 38),
('Bisacodyl', '5mg Tablet', (SELECT id FROM categories WHERE name='Laxative'), 'strip', 65, false, 'room_temperature', 100, 10, 'SEED-MED-047', '2028-12-31', 49),
('Lactulose', 'Syrup 10g/15ml (200ml)', (SELECT id FROM categories WHERE name='Laxative'), 'bottle', 380, false, 'room_temperature', 100, 10, 'SEED-MED-048', '2028-12-31', 285),
('Activated Charcoal', '250mg Tablet', (SELECT id FROM categories WHERE name='Antiflatulent / Antidote'), 'strip', 70, false, 'room_temperature', 100, 10, 'SEED-MED-049', '2028-12-31', 53),
('Liquid Paraffin', '100ml Bottle', (SELECT id FROM categories WHERE name='Laxative'), 'bottle', 120, false, 'room_temperature', 100, 10, 'SEED-MED-050', '2028-12-31', 90),
('Amlodipine', '5mg Tablet', (SELECT id FROM categories WHERE name='Antihypertensive'), 'strip', 120, true, 'room_temperature', 100, 10, 'SEED-MED-051', '2028-12-31', 90),
('Amlodipine', '10mg Tablet', (SELECT id FROM categories WHERE name='Antihypertensive'), 'strip', 180, true, 'room_temperature', 100, 10, 'SEED-MED-052', '2028-12-31', 135),
('Enalapril', '5mg Tablet', (SELECT id FROM categories WHERE name='Antihypertensive'), 'strip', 95, true, 'room_temperature', 100, 10, 'SEED-MED-053', '2028-12-31', 71),
('Captopril', '25mg Tablet', (SELECT id FROM categories WHERE name='Antihypertensive'), 'strip', 80, true, 'room_temperature', 100, 10, 'SEED-MED-054', '2028-12-31', 60),
('Atenolol', '50mg Tablet', (SELECT id FROM categories WHERE name='Antihypertensive'), 'strip', 110, true, 'room_temperature', 100, 10, 'SEED-MED-055', '2028-12-31', 83),
('Losartan', '50mg Tablet', (SELECT id FROM categories WHERE name='Antihypertensive'), 'strip', 210, true, 'room_temperature', 100, 10, 'SEED-MED-056', '2028-12-31', 158),
('Valsartan', '80mg Tablet', (SELECT id FROM categories WHERE name='Antihypertensive'), 'strip', 290, true, 'room_temperature', 100, 10, 'SEED-MED-057', '2028-12-31', 218),
('Hydrochlorothiazide (HCT)', '25mg Tablet', (SELECT id FROM categories WHERE name='Diuretic'), 'strip', 60, true, 'room_temperature', 100, 10, 'SEED-MED-058', '2028-12-31', 45),
('Furosemide (Lasix)', '40mg Tablet', (SELECT id FROM categories WHERE name='Diuretic'), 'strip', 70, true, 'room_temperature', 100, 10, 'SEED-MED-059', '2028-12-31', 53),
('Spironolactone', '25mg Tablet', (SELECT id FROM categories WHERE name='Diuretic'), 'strip', 160, true, 'room_temperature', 100, 10, 'SEED-MED-060', '2028-12-31', 120),
('Propranolol', '40mg Tablet', (SELECT id FROM categories WHERE name='Beta-blocker'), 'strip', 90, true, 'room_temperature', 100, 10, 'SEED-MED-061', '2028-12-31', 68),
('Atorvastatin', '20mg Tablet', (SELECT id FROM categories WHERE name='Lipid-Lowering'), 'strip', 320, true, 'room_temperature', 100, 10, 'SEED-MED-062', '2028-12-31', 240),
('Simvastatin', '20mg Tablet', (SELECT id FROM categories WHERE name='Lipid-Lowering'), 'strip', 210, true, 'room_temperature', 100, 10, 'SEED-MED-063', '2028-12-31', 158),
('Methyldopa', '250mg Tablet', (SELECT id FROM categories WHERE name='Antihypertensive (Pregnancy)'), 'strip', 240, true, 'room_temperature', 100, 10, 'SEED-MED-064', '2028-12-31', 180),
('Nifedipine', '20mg Retard Tablet', (SELECT id FROM categories WHERE name='Antihypertensive'), 'strip', 130, true, 'room_temperature', 100, 10, 'SEED-MED-065', '2028-12-31', 98),
('Digoxin', '0.25mg Tablet', (SELECT id FROM categories WHERE name='Cardiac Glycoside'), 'strip', 180, true, 'room_temperature', 100, 10, 'SEED-MED-066', '2028-12-31', 135),
('Hydralazine', '25mg Tablet', (SELECT id FROM categories WHERE name='Antihypertensive'), 'strip', 220, true, 'room_temperature', 100, 10, 'SEED-MED-067', '2028-12-31', 165),
('Bisoprolol', '5mg Tablet', (SELECT id FROM categories WHERE name='Beta-blocker'), 'strip', 240, true, 'room_temperature', 100, 10, 'SEED-MED-068', '2028-12-31', 180),
('Glyceryl Trinitrate (Nitroglycerin)', '0.5mg Sublingual Tab', (SELECT id FROM categories WHERE name='Antianginal'), 'bottle', 350, true, 'room_temperature', 100, 10, 'SEED-MED-069', '2028-12-31', 263),
('Carvedilol', '6.25mg Tablet', (SELECT id FROM categories WHERE name='Beta-blocker'), 'strip', 190, true, 'room_temperature', 100, 10, 'SEED-MED-070', '2028-12-31', 143),
('Metformin', '500mg Tablet', (SELECT id FROM categories WHERE name='Antidiabetic'), 'strip', 110, true, 'room_temperature', 100, 10, 'SEED-MED-071', '2028-12-31', 83),
('Metformin', '850mg Tablet', (SELECT id FROM categories WHERE name='Antidiabetic'), 'strip', 160, true, 'room_temperature', 100, 10, 'SEED-MED-072', '2028-12-31', 120),
('Glibenclamide', '5mg Tablet', (SELECT id FROM categories WHERE name='Antidiabetic'), 'strip', 75, true, 'room_temperature', 100, 10, 'SEED-MED-073', '2028-12-31', 56),
('Gliclazide', '80mg Tablet', (SELECT id FROM categories WHERE name='Antidiabetic'), 'strip', 220, true, 'room_temperature', 100, 10, 'SEED-MED-074', '2028-12-31', 165),
('Glimepiride', '2mg Tablet', (SELECT id FROM categories WHERE name='Antidiabetic'), 'strip', 240, true, 'room_temperature', 100, 10, 'SEED-MED-075', '2028-12-31', 180),
('Insulin Soluble (Regular)', '100 IU/ml Vial', (SELECT id FROM categories WHERE name='Antidiabetic (Cold Chain)'), 'vial', 650, true, 'refrigerated_2_to_8C', 100, 10, 'SEED-MED-076', '2028-12-31', 488),
('Insulin Isophane (NPH)', '100 IU/ml Vial', (SELECT id FROM categories WHERE name='Antidiabetic (Cold Chain)'), 'vial', 680, true, 'refrigerated_2_to_8C', 100, 10, 'SEED-MED-077', '2028-12-31', 510),
('Premixed Insulin (30/70)', '100 IU/ml Vial', (SELECT id FROM categories WHERE name='Antidiabetic (Cold Chain)'), 'vial', 720, true, 'refrigerated_2_to_8C', 100, 10, 'SEED-MED-078', '2028-12-31', 540),
('Prednisolone', '5mg Tablet', (SELECT id FROM categories WHERE name='Corticosteroid'), 'strip', 80, true, 'room_temperature', 100, 10, 'SEED-MED-079', '2028-12-31', 60),
('Dexamethasone', '0.5mg Tablet', (SELECT id FROM categories WHERE name='Corticosteroid'), 'strip', 60, true, 'room_temperature', 100, 10, 'SEED-MED-080', '2028-12-31', 45),
('Dexamethasone', '4mg/ml Injection', (SELECT id FROM categories WHERE name='Corticosteroid'), 'ampoule', 50, true, 'room_temperature', 100, 10, 'SEED-MED-081', '2028-12-31', 38),
('Hydrocortisone', '100mg Injection', (SELECT id FROM categories WHERE name='Corticosteroid'), 'vial', 180, true, 'room_temperature', 100, 10, 'SEED-MED-082', '2028-12-31', 135),
('Thyroxine Sodium (Levothyroxine)', '50mcg Tablet', (SELECT id FROM categories WHERE name='Thyroid Hormone'), 'strip', 190, true, 'room_temperature', 100, 10, 'SEED-MED-083', '2028-12-31', 143),
('Propylthiouracil (PTU)', '50mg Tablet', (SELECT id FROM categories WHERE name='Antithyroid'), 'strip', 310, true, 'room_temperature', 100, 10, 'SEED-MED-084', '2028-12-31', 233),
('Glibenclamide + Metformin', '5mg/500mg Tablet', (SELECT id FROM categories WHERE name='Antidiabetic'), 'strip', 280, true, 'room_temperature', 100, 10, 'SEED-MED-085', '2028-12-31', 210),
('Salbutamol', '100mcg Inhaler', (SELECT id FROM categories WHERE name='Bronchodilator'), 'inhaler', 350, true, 'room_temperature', 100, 10, 'SEED-MED-086', '2028-12-31', 263),
('Salbutamol', '2mg/5ml Syrup (100ml)', (SELECT id FROM categories WHERE name='Bronchodilator'), 'bottle', 110, true, 'room_temperature', 100, 10, 'SEED-MED-087', '2028-12-31', 83),
('Salbutamol', '4mg Tablet', (SELECT id FROM categories WHERE name='Bronchodilator'), 'strip', 50, true, 'room_temperature', 100, 10, 'SEED-MED-088', '2028-12-31', 38),
('Beclomethasone Dipropionate', '100mcg Inhaler', (SELECT id FROM categories WHERE name='Antiasthmatic Corticosteroid'), 'inhaler', 580, true, 'room_temperature', 100, 10, 'SEED-MED-089', '2028-12-31', 435),
('Aminophylline', '100mg Tablet', (SELECT id FROM categories WHERE name='Bronchodilator'), 'strip', 85, true, 'room_temperature', 100, 10, 'SEED-MED-090', '2028-12-31', 64),
('Theophylline', '200mg Retard Tablet', (SELECT id FROM categories WHERE name='Bronchodilator'), 'strip', 140, true, 'room_temperature', 100, 10, 'SEED-MED-091', '2028-12-31', 105),
('Dextromethorphan', '15mg/5ml Syrup', (SELECT id FROM categories WHERE name='Antitussive'), 'bottle', 160, false, 'room_temperature', 100, 10, 'SEED-MED-092', '2028-12-31', 120),
('Guaifenesin', 'Expectorant Syrup', (SELECT id FROM categories WHERE name='Expectorant'), 'bottle', 130, false, 'room_temperature', 100, 10, 'SEED-MED-093', '2028-12-31', 98),
('Cetirizine', '10mg Tablet', (SELECT id FROM categories WHERE name='Antihistamine'), 'strip', 70, false, 'room_temperature', 100, 10, 'SEED-MED-094', '2028-12-31', 53),
('Loratadine', '10mg Tablet', (SELECT id FROM categories WHERE name='Antihistamine'), 'strip', 90, false, 'room_temperature', 100, 10, 'SEED-MED-095', '2028-12-31', 68),
('Chlorpheniramine Maleate', '4mg Tablet', (SELECT id FROM categories WHERE name='Antihistamine'), 'strip', 30, false, 'room_temperature', 100, 10, 'SEED-MED-096', '2028-12-31', 23),
('Diphenhydramine Compound', 'Cough Syrup (100ml)', (SELECT id FROM categories WHERE name='Antihistamine / Cough'), 'bottle', 140, false, 'room_temperature', 100, 10, 'SEED-MED-097', '2028-12-31', 105),
('Promethazine', '25mg Tablet', (SELECT id FROM categories WHERE name='Antihistamine'), 'strip', 65, true, 'room_temperature', 100, 10, 'SEED-MED-098', '2028-12-31', 49),
('Montelukast', '10mg Tablet', (SELECT id FROM categories WHERE name='Antiasthmatic'), 'strip', 420, true, 'room_temperature', 100, 10, 'SEED-MED-099', '2028-12-31', 315),
('Prednisolone Syrup', '15mg/5ml (60ml)', (SELECT id FROM categories WHERE name='Pediatric Corticosteroid'), 'bottle', 260, true, 'room_temperature', 100, 10, 'SEED-MED-100', '2028-12-31', 195),
('Fluconazole', '150mg Capsule', (SELECT id FROM categories WHERE name='Antifungal'), 'pack of 1', 140, true, 'room_temperature', 100, 10, 'SEED-MED-101', '2028-12-31', 105),
('Ketoconazole', '200mg Tablet', (SELECT id FROM categories WHERE name='Antifungal'), 'strip', 180, true, 'room_temperature', 100, 10, 'SEED-MED-102', '2028-12-31', 135),
('Griseofulvin', '500mg Tablet', (SELECT id FROM categories WHERE name='Antifungal'), 'strip', 220, true, 'room_temperature', 100, 10, 'SEED-MED-103', '2028-12-31', 165),
('Nystatin', '100,000 IU/ml Oral Drop', (SELECT id FROM categories WHERE name='Antifungal'), 'bottle', 130, true, 'room_temperature', 100, 10, 'SEED-MED-104', '2028-12-31', 98),
('Clotrimazole', '1% Topical Cream (20g)', (SELECT id FROM categories WHERE name='Topical Antifungal'), 'tube', 90, false, 'room_temperature', 100, 10, 'SEED-MED-105', '2028-12-31', 68),
('Clotrimazole', '100mg Vaginal Pessary', (SELECT id FROM categories WHERE name='Antifungal'), 'pack', 160, false, 'room_temperature', 100, 10, 'SEED-MED-106', '2028-12-31', 120),
('Miconazole', '2% Oral Gel', (SELECT id FROM categories WHERE name='Antifungal'), 'tube', 180, false, 'room_temperature', 100, 10, 'SEED-MED-107', '2028-12-31', 135),
('Terbinafine', '250mg Tablet', (SELECT id FROM categories WHERE name='Antifungal'), 'strip', 450, true, 'room_temperature', 100, 10, 'SEED-MED-108', '2028-12-31', 338),
('Acyclovir', '200mg Tablet', (SELECT id FROM categories WHERE name='Antiviral'), 'strip', 280, true, 'room_temperature', 100, 10, 'SEED-MED-109', '2028-12-31', 210),
('Acyclovir', '5% Ointment (5g)', (SELECT id FROM categories WHERE name='Topical Antiviral'), 'tube', 140, false, 'room_temperature', 100, 10, 'SEED-MED-110', '2028-12-31', 105),
('Albendazole', '400mg Chewing Tablet', (SELECT id FROM categories WHERE name='Anthelminthic'), 'tablet', 40, false, 'room_temperature', 100, 10, 'SEED-MED-111', '2028-12-31', 30),
('Mebendazole', '100mg Tablet', (SELECT id FROM categories WHERE name='Anthelminthic'), 'strip', 45, false, 'room_temperature', 100, 10, 'SEED-MED-112', '2028-12-31', 34),
('Ivermectin', '3mg Tablet', (SELECT id FROM categories WHERE name='Anthelminthic'), 'strip', 180, true, 'room_temperature', 100, 10, 'SEED-MED-113', '2028-12-31', 135),
('Praziquantel', '600mg Tablet', (SELECT id FROM categories WHERE name='Anti-schistosomal'), 'strip', 220, true, 'room_temperature', 100, 10, 'SEED-MED-114', '2028-12-31', 165),
('Artemether + Lumefantrine (Coartem)', '20mg/120mg Tablet', (SELECT id FROM categories WHERE name='Antimalarial'), 'pack', 180, true, 'room_temperature', 100, 10, 'SEED-MED-115', '2028-12-31', 135),
('Artesunate', '60mg Injection', (SELECT id FROM categories WHERE name='Antimalarial'), 'vial', 320, true, 'room_temperature', 100, 10, 'SEED-MED-116', '2028-12-31', 240),
('Quinine Sulphate', '300mg Tablet', (SELECT id FROM categories WHERE name='Antimalarial'), 'strip', 240, true, 'room_temperature', 100, 10, 'SEED-MED-117', '2028-12-31', 180),
('Tinidazole', '500mg Tablet', (SELECT id FROM categories WHERE name='Antiprotozoal'), 'strip', 120, true, 'room_temperature', 100, 10, 'SEED-MED-118', '2028-12-31', 90),
('Artesunate Suppository', '100mg', (SELECT id FROM categories WHERE name='Pediatric Antimalarial'), 'pack', 210, true, 'room_temperature', 100, 10, 'SEED-MED-119', '2028-12-31', 158),
('Chloroquine Phosphate', '250mg Tablet', (SELECT id FROM categories WHERE name='Antimalarial'), 'strip', 90, true, 'room_temperature', 100, 10, 'SEED-MED-120', '2028-12-31', 68),
('Diazepam', '5mg Tablet', (SELECT id FROM categories WHERE name='Anxiolytic / Anticonvulsant'), 'strip', 70, true, 'locked_cabinet', 100, 10, 'SEED-MED-121', '2028-12-31', 53),
('Diazepam', '10mg/2ml Injection', (SELECT id FROM categories WHERE name='Anxiolytic / Emergency'), 'ampoule', 65, true, 'locked_cabinet', 100, 10, 'SEED-MED-122', '2028-12-31', 49),
('Phenobarbital', '30mg Tablet', (SELECT id FROM categories WHERE name='Anticonvulsant'), 'strip', 80, true, 'locked_cabinet', 100, 10, 'SEED-MED-123', '2028-12-31', 60),
('Carbamazepine', '200mg Tablet', (SELECT id FROM categories WHERE name='Anticonvulsant'), 'strip', 160, true, 'room_temperature', 100, 10, 'SEED-MED-124', '2028-12-31', 120),
('Sodium Valproate', '200mg Tablet', (SELECT id FROM categories WHERE name='Anticonvulsant'), 'strip', 290, true, 'room_temperature', 100, 10, 'SEED-MED-125', '2028-12-31', 218),
('Phenytoin Sodium', '100mg Capsule', (SELECT id FROM categories WHERE name='Anticonvulsant'), 'strip', 190, true, 'room_temperature', 100, 10, 'SEED-MED-126', '2028-12-31', 143),
('Amitriptyline', '25mg Tablet', (SELECT id FROM categories WHERE name='Antidepressant'), 'strip', 80, true, 'room_temperature', 100, 10, 'SEED-MED-127', '2028-12-31', 60),
('Fluoxetine', '20mg Capsule', (SELECT id FROM categories WHERE name='Antidepressant'), 'strip', 210, true, 'room_temperature', 100, 10, 'SEED-MED-128', '2028-12-31', 158),
('Haloperidol', '5mg Tablet', (SELECT id FROM categories WHERE name='Antipsychotic'), 'strip', 130, true, 'room_temperature', 100, 10, 'SEED-MED-129', '2028-12-31', 98),
('Chlorpromazine', '25mg Tablet', (SELECT id FROM categories WHERE name='Antipsychotic'), 'strip', 95, true, 'room_temperature', 100, 10, 'SEED-MED-130', '2028-12-31', 71),
('Risperidone', '2mg Tablet', (SELECT id FROM categories WHERE name='Antipsychotic'), 'strip', 340, true, 'room_temperature', 100, 10, 'SEED-MED-131', '2028-12-31', 255),
('Olanzapine', '5mg Tablet', (SELECT id FROM categories WHERE name='Antipsychotic'), 'strip', 380, true, 'room_temperature', 100, 10, 'SEED-MED-132', '2028-12-31', 285),
('Lorazepam', '1mg Tablet', (SELECT id FROM categories WHERE name='Anxiolytic'), 'strip', 110, true, 'locked_cabinet', 100, 10, 'SEED-MED-133', '2028-12-31', 83),
('Benzhexol (Trihexyphenidyl)', '2mg Tablet', (SELECT id FROM categories WHERE name='Antiparkinsonian'), 'strip', 90, true, 'room_temperature', 100, 10, 'SEED-MED-134', '2028-12-31', 68),
('Levodopa + Carbidopa', '250mg/25mg Tablet', (SELECT id FROM categories WHERE name='Antiparkinsonian'), 'bottle', 650, true, 'room_temperature', 100, 10, 'SEED-MED-135', '2028-12-31', 488),
('Ferrous Sulphate', '200mg Tablet', (SELECT id FROM categories WHERE name='Iron Supplement'), 'strip', 40, false, 'room_temperature', 100, 10, 'SEED-MED-136', '2028-12-31', 30),
('Folic Acid', '5mg Tablet', (SELECT id FROM categories WHERE name='Vitamin Supplement'), 'strip', 35, false, 'room_temperature', 100, 10, 'SEED-MED-137', '2028-12-31', 26),
('Ferrous Sulphate + Folic Acid', 'Combined Tablet', (SELECT id FROM categories WHERE name='Prenatal Supplement'), 'strip', 60, false, 'room_temperature', 100, 10, 'SEED-MED-138', '2028-12-31', 45),
('Vitamin B-Complex', 'Tablet', (SELECT id FROM categories WHERE name='Vitamin Supplement'), 'strip', 50, false, 'room_temperature', 100, 10, 'SEED-MED-139', '2028-12-31', 38),
('Vitamin C (Ascorbic Acid)', '500mg Chewable', (SELECT id FROM categories WHERE name='Vitamin Supplement'), 'strip', 60, false, 'room_temperature', 100, 10, 'SEED-MED-140', '2028-12-31', 45),
('Vitamin D3 (Cholecalciferol)', '50,000 IU Capsule', (SELECT id FROM categories WHERE name='Vitamin Supplement'), 'strip', 320, true, 'room_temperature', 100, 10, 'SEED-MED-141', '2028-12-31', 240),
('Vitamin B12 (Cyanocobalamin)', '1000mcg/ml Injection', (SELECT id FROM categories WHERE name='Vitamin Supplement'), 'ampoule', 80, true, 'room_temperature', 100, 10, 'SEED-MED-142', '2028-12-31', 60),
('Calcium Carbonate', '500mg Tablet', (SELECT id FROM categories WHERE name='Mineral Supplement'), 'strip', 90, false, 'room_temperature', 100, 10, 'SEED-MED-143', '2028-12-31', 68),
('Calcium + Vitamin D3', 'Combined Tablet', (SELECT id FROM categories WHERE name='Mineral Supplement'), 'bottle', 220, false, 'room_temperature', 100, 10, 'SEED-MED-144', '2028-12-31', 165),
('Multivitamin Drops', '15ml Drops', (SELECT id FROM categories WHERE name='Pediatric Supplement'), 'bottle', 160, false, 'room_temperature', 100, 10, 'SEED-MED-145', '2028-12-31', 120),
('Multivitamin Syrup', '100ml Syrup', (SELECT id FROM categories WHERE name='Pediatric Supplement'), 'bottle', 210, false, 'room_temperature', 100, 10, 'SEED-MED-146', '2028-12-31', 158),
('Vitamin A', '200,000 IU Capsule', (SELECT id FROM categories WHERE name='Supplement'), 'capsule', 40, false, 'room_temperature', 100, 10, 'SEED-MED-147', '2028-12-31', 30),
('Vitamin K1 (Phytomenadione)', '10mg/ml Injection', (SELECT id FROM categories WHERE name='Coagulant'), 'ampoule', 120, true, 'room_temperature', 100, 10, 'SEED-MED-148', '2028-12-31', 90),
('Zinc Gluconate', '50mg Tablet', (SELECT id FROM categories WHERE name='Supplement'), 'bottle', 180, false, 'room_temperature', 100, 10, 'SEED-MED-149', '2028-12-31', 135),
('Magnesium Oxide', '400mg Tablet', (SELECT id FROM categories WHERE name='Supplement'), 'bottle', 210, false, 'room_temperature', 100, 10, 'SEED-MED-150', '2028-12-31', 158),
('Tetracycline', '1% Eye Ointment (3.5g)', (SELECT id FROM categories WHERE name='Ophthalmic Antibacterial'), 'tube', 65, false, 'room_temperature', 100, 10, 'SEED-MED-151', '2028-12-31', 49),
('Chloramphenicol', '0.5% Eye Drops (10ml)', (SELECT id FROM categories WHERE name='Ophthalmic Antibacterial'), 'bottle', 80, true, 'room_temperature', 100, 10, 'SEED-MED-152', '2028-12-31', 60),
('Ciprofloxacin', '0.3% Eye Drops (5ml)', (SELECT id FROM categories WHERE name='Ophthalmic Antibacterial'), 'bottle', 120, true, 'room_temperature', 100, 10, 'SEED-MED-153', '2028-12-31', 90),
('Gentamicin', '0.3% Eye/Ear Drops', (SELECT id FROM categories WHERE name='Ophthalmic/Otic'), 'bottle', 90, true, 'room_temperature', 100, 10, 'SEED-MED-154', '2028-12-31', 68),
('Dexamethasone', '0.1% Eye Drops (5ml)', (SELECT id FROM categories WHERE name='Ophthalmic Anti-inflammatory'), 'bottle', 110, true, 'room_temperature', 100, 10, 'SEED-MED-155', '2028-12-31', 83),
('Timolol Maleate', '0.5% Eye Drops (5ml)', (SELECT id FROM categories WHERE name='Anti-Glaucoma'), 'bottle', 220, true, 'room_temperature', 100, 10, 'SEED-MED-156', '2028-12-31', 165),
('Atropine Sulphate', '1% Eye Drops (5ml)', (SELECT id FROM categories WHERE name='Mydriatic'), 'bottle', 140, true, 'room_temperature', 100, 10, 'SEED-MED-157', '2028-12-31', 105),
('Artificial Tears', 'Lubricant Eye Drops (10ml)', (SELECT id FROM categories WHERE name='Ophthalmic Lubricant'), 'bottle', 260, false, 'room_temperature', 100, 10, 'SEED-MED-158', '2028-12-31', 195),
('Oxymetazoline', '0.05% Nasal Spray', (SELECT id FROM categories WHERE name='Nasal Decongestant'), 'bottle', 190, false, 'room_temperature', 100, 10, 'SEED-MED-159', '2028-12-31', 143),
('Normal Saline', '0.9% Nasal Drops (10ml)', (SELECT id FROM categories WHERE name='Nasal Cleanser'), 'bottle', 75, false, 'room_temperature', 100, 10, 'SEED-MED-160', '2028-12-31', 56),
('Hydrocortisone', '1% Topical Cream (15g)', (SELECT id FROM categories WHERE name='Topical Steroid'), 'tube', 80, false, 'room_temperature', 100, 10, 'SEED-MED-161', '2028-12-31', 60),
('Betamethasone Valerate', '0.1% Cream (15g)', (SELECT id FROM categories WHERE name='Topical Steroid'), 'tube', 120, true, 'room_temperature', 100, 10, 'SEED-MED-162', '2028-12-31', 90),
('Clobetasol Propionate', '0.05% Ointment (15g)', (SELECT id FROM categories WHERE name='Topical Steroid'), 'tube', 160, true, 'room_temperature', 100, 10, 'SEED-MED-163', '2028-12-31', 120),
('Silver Sulfadiazine', '1% Burn Cream (50g)', (SELECT id FROM categories WHERE name='Topical Antibacterial'), 'tube', 220, false, 'room_temperature', 100, 10, 'SEED-MED-164', '2028-12-31', 165),
('Permethrin', '5% Lotion (60ml)', (SELECT id FROM categories WHERE name='Anti-scabies'), 'bottle', 180, false, 'room_temperature', 100, 10, 'SEED-MED-165', '2028-12-31', 135),
('Calamine', 'Lotion (100ml)', (SELECT id FROM categories WHERE name='Topical Antipruritic'), 'bottle', 130, false, 'room_temperature', 100, 10, 'SEED-MED-166', '2028-12-31', 98),
('Benzoic Acid + Salicylic Acid', 'Whitfield''s Ointment', (SELECT id FROM categories WHERE name='Topical Antifungal'), 'jar', 95, false, 'room_temperature', 100, 10, 'SEED-MED-167', '2028-12-31', 71),
('Zinc Oxide', 'Ointment (30g)', (SELECT id FROM categories WHERE name='Skin Protectant'), 'tube', 85, false, 'room_temperature', 100, 10, 'SEED-MED-168', '2028-12-31', 64),
('Povidone Iodine', '10% Solution (100ml)', (SELECT id FROM categories WHERE name='Antiseptic'), 'bottle', 140, false, 'room_temperature', 100, 10, 'SEED-MED-169', '2028-12-31', 105),
('Hydrogen Peroxide', '3% Solution (100ml)', (SELECT id FROM categories WHERE name='Antiseptic'), 'bottle', 60, false, 'room_temperature', 100, 10, 'SEED-MED-170', '2028-12-31', 45),
('Medical Alcohol (Ethanol)', '70% Solution (250ml)', (SELECT id FROM categories WHERE name='Antiseptic'), 'bottle', 90, false, 'room_temperature', 100, 10, 'SEED-MED-171', '2028-12-31', 68),
('Gentian Violet', '1% Solution (25ml)', (SELECT id FROM categories WHERE name='Topical Antiseptic'), 'bottle', 40, false, 'room_temperature', 100, 10, 'SEED-MED-172', '2028-12-31', 30),
('Salicylic Acid', '2% Ointment', (SELECT id FROM categories WHERE name='Keratolytic'), 'tube', 110, false, 'room_temperature', 100, 10, 'SEED-MED-173', '2028-12-31', 83),
('Fusidic Acid', '2% Cream (15g)', (SELECT id FROM categories WHERE name='Topical Antibacterial'), 'tube', 240, true, 'room_temperature', 100, 10, 'SEED-MED-174', '2028-12-31', 180),
('Neomycin + Polymyxin B', 'Skin Ointment', (SELECT id FROM categories WHERE name='Topical Antibacterial'), 'tube', 130, false, 'room_temperature', 100, 10, 'SEED-MED-175', '2028-12-31', 98),
('Combined Oral Contraceptive', 'Ethinylestradiol + Levonorgestrel', (SELECT id FROM categories WHERE name='Hormonal Contraceptive'), 'cycle pack', 50, false, 'room_temperature', 100, 10, 'SEED-MED-176', '2028-12-31', 38),
('Progestin-Only Pill (POP)', 'Levonorgestrel 0.03mg', (SELECT id FROM categories WHERE name='Hormonal Contraceptive'), 'cycle pack', 60, false, 'room_temperature', 100, 10, 'SEED-MED-177', '2028-12-31', 45),
('Emergency Contraceptive', 'Levonorgestrel 1.5mg', (SELECT id FROM categories WHERE name='Emergency Contraceptive'), 'pack of 1', 150, false, 'room_temperature', 100, 10, 'SEED-MED-178', '2028-12-31', 113),
('Depot Medroxyprogesterone', '150mg/ml Injectable', (SELECT id FROM categories WHERE name='Injectable Contraceptive'), 'vial', 180, true, 'room_temperature', 100, 10, 'SEED-MED-179', '2028-12-31', 135),
('Oxytocin', '10 IU/ml Injection', (SELECT id FROM categories WHERE name='Uterotonic'), 'ampoule', 110, true, 'refrigerated_2_to_8C', 100, 10, 'SEED-MED-180', '2028-12-31', 83),
('Misoprostol', '200mcg Tablet', (SELECT id FROM categories WHERE name='Prostaglandin Analog'), 'strip', 350, true, 'room_temperature', 100, 10, 'SEED-MED-181', '2028-12-31', 263),
('Magnesium Sulphate', '50% Injection (10ml)', (SELECT id FROM categories WHERE name='Anticonvulsant (Eclampsia)'), 'ampoule', 140, true, 'room_temperature', 100, 10, 'SEED-MED-182', '2028-12-31', 105),
('Methyergometrine', '0.2mg/ml Injection', (SELECT id FROM categories WHERE name='Uterotonic'), 'ampoule', 95, true, 'refrigerated_2_to_8C', 100, 10, 'SEED-MED-183', '2028-12-31', 71),
('Clomiphene Citrate', '50mg Tablet', (SELECT id FROM categories WHERE name='Fertility Agent'), 'strip', 580, true, 'room_temperature', 100, 10, 'SEED-MED-184', '2028-12-31', 435),
('Aspirin Low Dose', '75mg Tablet', (SELECT id FROM categories WHERE name='Preeclampsia Prevention'), 'strip', 45, false, 'room_temperature', 100, 10, 'SEED-MED-185', '2028-12-31', 34),
('Normal Saline (0.9% NaCl)', '500ml Infusion', (SELECT id FROM categories WHERE name='Intravenous Fluid'), 'bag', 120, true, 'room_temperature', 100, 10, 'SEED-MED-186', '2028-12-31', 90),
('Dextrose 5% in Water', '500ml Infusion', (SELECT id FROM categories WHERE name='Intravenous Fluid'), 'bag', 120, true, 'room_temperature', 100, 10, 'SEED-MED-187', '2028-12-31', 90),
('Dextrose 40%', '20ml Ampoule', (SELECT id FROM categories WHERE name='Emergency IV Glucose'), 'ampoule', 80, true, 'room_temperature', 100, 10, 'SEED-MED-188', '2028-12-31', 60),
('Ringer''s Lactate', '500ml Infusion', (SELECT id FROM categories WHERE name='Intravenous Fluid'), 'bag', 130, true, 'room_temperature', 100, 10, 'SEED-MED-189', '2028-12-31', 98),
('Potassium Chloride', '15% Injection (10ml)', (SELECT id FROM categories WHERE name='Electrolyte Supplement'), 'ampoule', 90, true, 'room_temperature', 100, 10, 'SEED-MED-190', '2028-12-31', 68),
('Sodium Bicarbonate', '8.4% Injection', (SELECT id FROM categories WHERE name='Electrolyte Balance'), 'ampoule', 140, true, 'room_temperature', 100, 10, 'SEED-MED-191', '2028-12-31', 105),
('Calcium Gluconate', '10% Injection (10ml)', (SELECT id FROM categories WHERE name='Mineral Supplement'), 'ampoule', 110, true, 'room_temperature', 100, 10, 'SEED-MED-192', '2028-12-31', 83),
('Water for Injection', '10ml Ampoule', (SELECT id FROM categories WHERE name='Diluent'), 'ampoule', 20, false, 'room_temperature', 100, 10, 'SEED-MED-193', '2028-12-31', 15),
('Dextrose 10% in Water', '500ml Infusion', (SELECT id FROM categories WHERE name='Intravenous Fluid'), 'bag', 130, true, 'room_temperature', 100, 10, 'SEED-MED-194', '2028-12-31', 98),
('Saline 0.45% (Half Normal)', '500ml Infusion', (SELECT id FROM categories WHERE name='Intravenous Fluid'), 'bag', 125, true, 'room_temperature', 100, 10, 'SEED-MED-195', '2028-12-31', 94),
('Atropine Sulphate', '1mg/ml Injection', (SELECT id FROM categories WHERE name='Anticholinergic / Antidote'), 'ampoule', 60, true, 'room_temperature', 100, 10, 'SEED-MED-196', '2028-12-31', 45),
('Adrenaline (Epinephrine)', '1mg/ml Injection', (SELECT id FROM categories WHERE name='Emergency Anaphylaxis'), 'ampoule', 110, true, 'room_temperature', 100, 10, 'SEED-MED-197', '2028-12-31', 83),
('Naloxone', '0.4mg/ml Injection', (SELECT id FROM categories WHERE name='Opioid Antidote'), 'ampoule', 480, true, 'room_temperature', 100, 10, 'SEED-MED-198', '2028-12-31', 360),
('Lidocaine HCl', '2% Injection (20ml)', (SELECT id FROM categories WHERE name='Local Anesthetic'), 'vial', 95, true, 'room_temperature', 100, 10, 'SEED-MED-199', '2028-12-31', 71),
('Lidocaine + Adrenaline', '2% Dental Cartridge', (SELECT id FROM categories WHERE name='Local Anesthetic'), 'cartridge', 130, true, 'room_temperature', 100, 10, 'SEED-MED-200', '2028-12-31', 98),
('Bupivacaine', '0.5% Heavy Injection', (SELECT id FROM categories WHERE name='Spinal Anesthetic'), 'ampoule', 280, true, 'room_temperature', 100, 10, 'SEED-MED-201', '2028-12-31', 210),
('Isoflurane', '100ml Liquid Volatile', (SELECT id FROM categories WHERE name='Inhalation Anesthetic'), 'bottle', 2400, true, 'room_temperature', 100, 10, 'SEED-MED-202', '2028-12-31', 1800),
('Ketamine HCl', '50mg/ml Injection (10ml)', (SELECT id FROM categories WHERE name='Anesthetic'), 'vial', 320, true, 'locked_cabinet', 100, 10, 'SEED-MED-203', '2028-12-31', 240),
('Propofol', '10mg/ml Injection (20ml)', (SELECT id FROM categories WHERE name='Anesthetic'), 'ampoule', 420, true, 'room_temperature', 100, 10, 'SEED-MED-204', '2028-12-31', 315),
('Suxamethonium (Succinylcholine)', '50mg/ml Injection', (SELECT id FROM categories WHERE name='Neuromuscular Blocker'), 'ampoule', 180, true, 'refrigerated_2_to_8C', 100, 10, 'SEED-MED-205', '2028-12-31', 135),
('Neostigmine', '0.5mg/ml Injection', (SELECT id FROM categories WHERE name='Reversal Agent'), 'ampoule', 140, true, 'room_temperature', 100, 10, 'SEED-MED-206', '2028-12-31', 105),
('Heparin Sodium', '5000 IU/ml Injection', (SELECT id FROM categories WHERE name='Anticoagulant'), 'vial', 380, true, 'room_temperature', 100, 10, 'SEED-MED-207', '2028-12-31', 285),
('Warfarin Sodium', '5mg Tablet', (SELECT id FROM categories WHERE name='Anticoagulant'), 'strip', 160, true, 'room_temperature', 100, 10, 'SEED-MED-208', '2028-12-31', 120),
('Enoxaparin (Clexane)', '40mg Pre-filled Syringe', (SELECT id FROM categories WHERE name='Low Molecular Weight Heparin'), 'syringe', 850, true, 'room_temperature', 100, 10, 'SEED-MED-209', '2028-12-31', 638),
('Tranexamic Acid', '500mg Injection', (SELECT id FROM categories WHERE name='Antifibrinolytic'), 'ampoule', 220, true, 'room_temperature', 100, 10, 'SEED-MED-210', '2028-12-31', 165),
('Tranexamic Acid', '500mg Tablet', (SELECT id FROM categories WHERE name='Antifibrinolytic'), 'strip', 380, true, 'room_temperature', 100, 10, 'SEED-MED-211', '2028-12-31', 285),
('Phytomenadione (Vit K1)', '10mg Tablet', (SELECT id FROM categories WHERE name='Antidote for Warfarin'), 'strip', 160, true, 'room_temperature', 100, 10, 'SEED-MED-212', '2028-12-31', 120),
('Clopidogrel', '75mg Tablet', (SELECT id FROM categories WHERE name='Antiplatelet'), 'strip', 260, true, 'room_temperature', 100, 10, 'SEED-MED-213', '2028-12-31', 195),
('Methotrexate', '2.5mg Tablet', (SELECT id FROM categories WHERE name='Immunosuppressant'), 'strip', 420, true, 'room_temperature', 100, 10, 'SEED-MED-214', '2028-12-31', 315),
('Azathioprine', '50mg Tablet', (SELECT id FROM categories WHERE name='Immunosuppressant'), 'strip', 680, true, 'room_temperature', 100, 10, 'SEED-MED-215', '2028-12-31', 510),
('Cyclophosphamide', '50mg Tablet', (SELECT id FROM categories WHERE name='Cytotoxic Agent'), 'strip', 850, true, 'room_temperature', 100, 10, 'SEED-MED-216', '2028-12-31', 638),
('Tamoxifen', '20mg Tablet', (SELECT id FROM categories WHERE name='Hormone Therapy (Oncology)'), 'strip', 520, true, 'room_temperature', 100, 10, 'SEED-MED-217', '2028-12-31', 390),
('Arimindex (Anastrozole)', '1mg Tablet', (SELECT id FROM categories WHERE name='Hormone Therapy (Oncology)'), 'strip', 1400, true, 'room_temperature', 100, 10, 'SEED-MED-218', '2028-12-31', 1050),
('Finasteride', '5mg Tablet', (SELECT id FROM categories WHERE name='BPH Agent'), 'strip', 340, true, 'room_temperature', 100, 10, 'SEED-MED-219', '2028-12-31', 255),
('Tamsulosin', '0.4mg Capsule', (SELECT id FROM categories WHERE name='BPH Agent'), 'strip', 420, true, 'room_temperature', 100, 10, 'SEED-MED-220', '2028-12-31', 315),
('Sildenafil', '50mg Tablet', (SELECT id FROM categories WHERE name='Erectile Dysfunction'), 'pack', 180, true, 'room_temperature', 100, 10, 'SEED-MED-221', '2028-12-31', 135),
('Tadalafil', '20mg Tablet', (SELECT id FROM categories WHERE name='Erectile Dysfunction'), 'pack', 290, true, 'room_temperature', 100, 10, 'SEED-MED-222', '2028-12-31', 218),
('Nitrofurantoin Syrup', '25mg/5ml (100ml)', (SELECT id FROM categories WHERE name='Pediatric Antibacterial'), 'bottle', 280, true, 'room_temperature', 100, 10, 'SEED-MED-223', '2028-12-31', 210),
('Cephalexin', '250mg Capsule', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 140, true, 'room_temperature', 100, 10, 'SEED-MED-224', '2028-12-31', 105),
('Cephalexin Syrup', '125mg/5ml (100ml)', (SELECT id FROM categories WHERE name='Pediatric Antibacterial'), 'bottle', 180, true, 'room_temperature', 100, 10, 'SEED-MED-225', '2028-12-31', 135),
('Cefaclor', '250mg Capsule', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 310, true, 'room_temperature', 100, 10, 'SEED-MED-226', '2028-12-31', 233),
('Cefotaxime', '1g Injection', (SELECT id FROM categories WHERE name='Antibacterial'), 'vial', 210, true, 'room_temperature', 100, 10, 'SEED-MED-227', '2028-12-31', 158),
('Meropenem', '1g Injection', (SELECT id FROM categories WHERE name='Broad-Spectrum Antibacterial'), 'vial', 1200, true, 'room_temperature', 100, 10, 'SEED-MED-228', '2028-12-31', 900),
('Vancomycin', '500mg Injection', (SELECT id FROM categories WHERE name='Glycopeptide Antibacterial'), 'vial', 850, true, 'room_temperature', 100, 10, 'SEED-MED-229', '2028-12-31', 638),
('Piperacillin + Tazobactam', '4.5g Injection', (SELECT id FROM categories WHERE name='Broad-Spectrum Antibacterial'), 'vial', 1600, true, 'room_temperature', 100, 10, 'SEED-MED-230', '2028-12-31', 1200),
('Amikacin', '500mg/2ml Injection', (SELECT id FROM categories WHERE name='Aminoglycoside'), 'ampoule', 220, true, 'room_temperature', 100, 10, 'SEED-MED-231', '2028-12-31', 165),
('Lincomycin', '500mg Capsule', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 160, true, 'room_temperature', 100, 10, 'SEED-MED-232', '2028-12-31', 120),
('Spiramycin', '1.5 MIU Tablet', (SELECT id FROM categories WHERE name='Antibacterial'), 'strip', 340, true, 'room_temperature', 100, 10, 'SEED-MED-233', '2028-12-31', 255),
('Rifampicin + Isoniazid', '150mg/75mg Tablet', (SELECT id FROM categories WHERE name='Antitubercular'), 'strip', 220, true, 'room_temperature', 100, 10, 'SEED-MED-234', '2028-12-31', 165),
('Ethambutol', '400mg Tablet', (SELECT id FROM categories WHERE name='Antitubercular'), 'strip', 180, true, 'room_temperature', 100, 10, 'SEED-MED-235', '2028-12-31', 135),
('Pyrazinamide', '500mg Tablet', (SELECT id FROM categories WHERE name='Antitubercular'), 'strip', 210, true, 'room_temperature', 100, 10, 'SEED-MED-236', '2028-12-31', 158),
('Acyclovir', '400mg Tablet', (SELECT id FROM categories WHERE name='Antiviral'), 'strip', 420, true, 'room_temperature', 100, 10, 'SEED-MED-237', '2028-12-31', 315),
('Valacyclovir', '500mg Tablet', (SELECT id FROM categories WHERE name='Antiviral'), 'strip', 780, true, 'room_temperature', 100, 10, 'SEED-MED-238', '2028-12-31', 585),
('Tenofovir Disoproxil', '300mg Tablet', (SELECT id FROM categories WHERE name='Antiretroviral / HBV'), 'bottle', 450, true, 'room_temperature', 100, 10, 'SEED-MED-239', '2028-12-31', 338),
('Lamivudine', '150mg Tablet', (SELECT id FROM categories WHERE name='Antiretroviral / HBV'), 'bottle', 320, true, 'room_temperature', 100, 10, 'SEED-MED-240', '2028-12-31', 240),
('Efavirenz', '600mg Tablet', (SELECT id FROM categories WHERE name='Antiretroviral'), 'bottle', 480, true, 'room_temperature', 100, 10, 'SEED-MED-241', '2028-12-31', 360),
('Dolutegravir', '50mg Tablet', (SELECT id FROM categories WHERE name='Antiretroviral'), 'bottle', 550, true, 'room_temperature', 100, 10, 'SEED-MED-242', '2028-12-31', 413),
('Atazanavir + Ritonavir', '300mg/100mg Tablet', (SELECT id FROM categories WHERE name='Antiretroviral'), 'bottle', 820, true, 'room_temperature', 100, 10, 'SEED-MED-243', '2028-12-31', 615),
('Fluconazole', '2mg/ml IV Infusion (100ml)', (SELECT id FROM categories WHERE name='Antifungal'), 'bottle', 380, true, 'room_temperature', 100, 10, 'SEED-MED-244', '2028-12-31', 285),
('Amphotericin B', '50mg Injection', (SELECT id FROM categories WHERE name='Antifungal'), 'vial', 1800, true, 'refrigerated_2_to_8C', 100, 10, 'SEED-MED-245', '2028-12-31', 1350),
('Itraconazole', '100mg Capsule', (SELECT id FROM categories WHERE name='Antifungal'), 'strip', 420, true, 'room_temperature', 100, 10, 'SEED-MED-246', '2028-12-31', 315),
('Permethrin', '1% Shampoo (60ml)', (SELECT id FROM categories WHERE name='Anti-lice'), 'bottle', 160, false, 'room_temperature', 100, 10, 'SEED-MED-247', '2028-12-31', 120),
('Malathion', '0.5% Lotion', (SELECT id FROM categories WHERE name='Anti-lice'), 'bottle', 140, false, 'room_temperature', 100, 10, 'SEED-MED-248', '2028-12-31', 105),
('Hydrocortisone', '1% Ointment (15g)', (SELECT id FROM categories WHERE name='Topical Steroid'), 'tube', 85, false, 'room_temperature', 100, 10, 'SEED-MED-249', '2028-12-31', 64),
('Betamethasone Dipropionate', '0.05% Ointment', (SELECT id FROM categories WHERE name='Topical Steroid'), 'tube', 140, true, 'room_temperature', 100, 10, 'SEED-MED-250', '2028-12-31', 105),
('Tacrolimus', '0.03% Ointment (10g)', (SELECT id FROM categories WHERE name='Immunomodulator'), 'tube', 850, true, 'room_temperature', 100, 10, 'SEED-MED-251', '2028-12-31', 638),
('Coal Tar', 'Solution Shampoo', (SELECT id FROM categories WHERE name='Anti-psoriasis'), 'bottle', 320, false, 'room_temperature', 100, 10, 'SEED-MED-252', '2028-12-31', 240),
('Benzoyl Peroxide', '5% Gel (30g)', (SELECT id FROM categories WHERE name='Anti-acne'), 'tube', 240, false, 'room_temperature', 100, 10, 'SEED-MED-253', '2028-12-31', 180),
('Adapalene', '0.1% Gel (30g)', (SELECT id FROM categories WHERE name='Anti-acne'), 'tube', 380, true, 'room_temperature', 100, 10, 'SEED-MED-254', '2028-12-31', 285),
('Isotretinoin', '10mg Capsule', (SELECT id FROM categories WHERE name='Anti-acne'), 'strip', 650, true, 'room_temperature', 100, 10, 'SEED-MED-255', '2028-12-31', 488),
('Tretinoin', '0.05% Cream (20g)', (SELECT id FROM categories WHERE name='Anti-acne'), 'tube', 220, true, 'room_temperature', 100, 10, 'SEED-MED-256', '2028-12-31', 165),
('Mupirocin', '2% Ointment (5g)', (SELECT id FROM categories WHERE name='Topical Antibacterial'), 'tube', 190, true, 'room_temperature', 100, 10, 'SEED-MED-257', '2028-12-31', 143),
('Silver Nitrate', 'Pencil / Solution', (SELECT id FROM categories WHERE name='Topical Cautery Agent'), 'unit', 180, true, 'room_temperature', 100, 10, 'SEED-MED-258', '2028-12-31', 135),
('Bismuth Subgallate Compound', 'Suppository', (SELECT id FROM categories WHERE name='Anti-hemorrhoidal'), 'pack', 180, false, 'room_temperature', 100, 10, 'SEED-MED-259', '2028-12-31', 135),
('Anusol Cream', 'Cream (25g)', (SELECT id FROM categories WHERE name='Anti-hemorrhoidal'), 'tube', 220, false, 'room_temperature', 100, 10, 'SEED-MED-260', '2028-12-31', 165),
('Sodium Chloride 3%', 'Hypertonic IV (500ml)', (SELECT id FROM categories WHERE name='Electrolyte Solution'), 'bag', 180, true, 'room_temperature', 100, 10, 'SEED-MED-261', '2028-12-31', 135),
('Mannitol', '20% Infusion (350ml)', (SELECT id FROM categories WHERE name='Osmotic Diuretic'), 'bottle', 320, true, 'room_temperature', 100, 10, 'SEED-MED-262', '2028-12-31', 240),
('Dextran 70', '6% in Normal Saline', (SELECT id FROM categories WHERE name='Plasma Expander'), 'bag', 450, true, 'room_temperature', 100, 10, 'SEED-MED-263', '2028-12-31', 338),
('Compound Sodium Lactate', 'Hartmann''s Solution', (SELECT id FROM categories WHERE name='Intravenous Fluid'), 'bag', 135, true, 'room_temperature', 100, 10, 'SEED-MED-264', '2028-12-31', 101),
('Glucose 5% + NaCl 0.9%', 'Maintenance IV (500ml)', (SELECT id FROM categories WHERE name='Intravenous Fluid'), 'bag', 125, true, 'room_temperature', 100, 10, 'SEED-MED-265', '2028-12-31', 94),
('Pyridoxine (Vit B6)', '50mg Tablet', (SELECT id FROM categories WHERE name='Vitamin Supplement'), 'strip', 45, false, 'room_temperature', 100, 10, 'SEED-MED-266', '2028-12-31', 34),
('Thiamine (Vit B1)', '100mg Tablet', (SELECT id FROM categories WHERE name='Vitamin Supplement'), 'strip', 50, false, 'room_temperature', 100, 10, 'SEED-MED-267', '2028-12-31', 38),
('Alpha Tocopherol (Vit E)', '400 IU Capsule', (SELECT id FROM categories WHERE name='Antioxidant Supplement'), 'strip', 180, false, 'room_temperature', 100, 10, 'SEED-MED-268', '2028-12-31', 135),
('Folic Acid', '1mg Tablet', (SELECT id FROM categories WHERE name='Supplement'), 'strip', 30, false, 'room_temperature', 100, 10, 'SEED-MED-269', '2028-12-31', 23),
('Zinc Acetate', '50mg Tablet', (SELECT id FROM categories WHERE name='Supplement'), 'bottle', 160, false, 'room_temperature', 100, 10, 'SEED-MED-270', '2028-12-31', 120),
('Potassium Citrate', 'Oral Solution', (SELECT id FROM categories WHERE name='Urinary Alkalinizer'), 'bottle', 240, false, 'room_temperature', 100, 10, 'SEED-MED-271', '2028-12-31', 180),
('Hyoscine Hydrobromide', '0.6mg Injection', (SELECT id FROM categories WHERE name='Antispasmodic'), 'ampoule', 80, true, 'room_temperature', 100, 10, 'SEED-MED-272', '2028-12-31', 60),
('Atropine Sulphate', '0.6mg Tablet', (SELECT id FROM categories WHERE name='Antispasmodic'), 'strip', 60, true, 'room_temperature', 100, 10, 'SEED-MED-273', '2028-12-31', 45),
('Dicyclomine HCl', '10mg Tablet', (SELECT id FROM categories WHERE name='Antispasmodic'), 'strip', 55, true, 'room_temperature', 100, 10, 'SEED-MED-274', '2028-12-31', 41),
('Chlordiazepoxide + Clidinium', 'Librax Equivalent Tab', (SELECT id FROM categories WHERE name='Anti-ulcer / Antispasmodic'), 'strip', 140, true, 'locked_cabinet', 100, 10, 'SEED-MED-275', '2028-12-31', 105),
('Domperidone', '10mg Tablet', (SELECT id FROM categories WHERE name='Prokinetic / Antiemetic'), 'strip', 95, true, 'room_temperature', 100, 10, 'SEED-MED-276', '2028-12-31', 71),
('Meclizine + Vit B6', 'Antivert Tablet', (SELECT id FROM categories WHERE name='Anti-vertigo'), 'strip', 110, false, 'room_temperature', 100, 10, 'SEED-MED-277', '2028-12-31', 83),
('Betahistine', '16mg Tablet', (SELECT id FROM categories WHERE name='Anti-vertigo'), 'strip', 280, true, 'room_temperature', 100, 10, 'SEED-MED-278', '2028-12-31', 210),
('Cinnarizine', '25mg Tablet', (SELECT id FROM categories WHERE name='Anti-vertigo'), 'strip', 85, false, 'room_temperature', 100, 10, 'SEED-MED-279', '2028-12-31', 64),
('Flunarizine', '5mg Tablet', (SELECT id FROM categories WHERE name='Migraine Prophylaxis'), 'strip', 120, true, 'room_temperature', 100, 10, 'SEED-MED-280', '2028-12-31', 90),
('Sumatriptan', '50mg Tablet', (SELECT id FROM categories WHERE name='Antimigraine'), 'pack of 2', 450, true, 'room_temperature', 100, 10, 'SEED-MED-281', '2028-12-31', 338),
('Ergotamine + Caffeine', 'Cafergot Equivalent', (SELECT id FROM categories WHERE name='Antimigraine'), 'strip', 160, true, 'room_temperature', 100, 10, 'SEED-MED-282', '2028-12-31', 120),
('Pilocarpine', '2% Eye Drops (5ml)', (SELECT id FROM categories WHERE name='Anti-Glaucoma'), 'bottle', 180, true, 'room_temperature', 100, 10, 'SEED-MED-283', '2028-12-31', 135),
('Latanoprost', '0.005% Eye Drops', (SELECT id FROM categories WHERE name='Anti-Glaucoma'), 'bottle', 680, true, 'refrigerated_2_to_8C', 100, 10, 'SEED-MED-284', '2028-12-31', 510),
('Brimonidine', '0.2% Eye Drops', (SELECT id FROM categories WHERE name='Anti-Glaucoma'), 'bottle', 520, true, 'room_temperature', 100, 10, 'SEED-MED-285', '2028-12-31', 390),
('Dorzolamide', '2% Eye Drops', (SELECT id FROM categories WHERE name='Anti-Glaucoma'), 'bottle', 480, true, 'room_temperature', 100, 10, 'SEED-MED-286', '2028-12-31', 360),
('Ofloxacin', '0.3% Otic Drops', (SELECT id FROM categories WHERE name='Ear Anti-infective'), 'bottle', 140, true, 'room_temperature', 100, 10, 'SEED-MED-287', '2028-12-31', 105),
('Clotrimazole', '1% Otic Drops', (SELECT id FROM categories WHERE name='Ear Antifungal'), 'bottle', 120, false, 'room_temperature', 100, 10, 'SEED-MED-288', '2028-12-31', 90),
('Olive Oil Ear Drops', '10ml Bottle', (SELECT id FROM categories WHERE name='Cerumenolytic'), 'bottle', 90, false, 'room_temperature', 100, 10, 'SEED-MED-289', '2028-12-31', 68),
('Fluticasone Furoate', 'Nasal Spray', (SELECT id FROM categories WHERE name='Antihistamine Spray'), 'bottle', 480, true, 'room_temperature', 100, 10, 'SEED-MED-290', '2028-12-31', 360),
('Budesonide', '200mcg Inhaler', (SELECT id FROM categories WHERE name='Antiasthmatic Steroid'), 'inhaler', 620, true, 'room_temperature', 100, 10, 'SEED-MED-291', '2028-12-31', 465),
('Ipratropium Bromide', 'Inhaler', (SELECT id FROM categories WHERE name='Bronchodilator'), 'inhaler', 540, true, 'room_temperature', 100, 10, 'SEED-MED-292', '2028-12-31', 405),
('Formoterol + Budesonide', 'Symbicort Equivalent', (SELECT id FROM categories WHERE name='Antiasthmatic Combination'), 'inhaler', 850, true, 'room_temperature', 100, 10, 'SEED-MED-293', '2028-12-31', 638),
('Tiotropium', 'Inhalation Powder', (SELECT id FROM categories WHERE name='COPD Management'), 'pack', 920, true, 'room_temperature', 100, 10, 'SEED-MED-294', '2028-12-31', 690),
('Carbocisteine', '250mg/5ml Syrup', (SELECT id FROM categories WHERE name='Mucolytic'), 'bottle', 180, false, 'room_temperature', 100, 10, 'SEED-MED-295', '2028-12-31', 135),
('Bromhexine', '8mg Tablet', (SELECT id FROM categories WHERE name='Mucolytic'), 'strip', 70, false, 'room_temperature', 100, 10, 'SEED-MED-296', '2028-12-31', 53),
('Acetylcysteine', '200mg Sachet', (SELECT id FROM categories WHERE name='Mucolytic'), 'pack', 120, false, 'room_temperature', 100, 10, 'SEED-MED-297', '2028-12-31', 90),
('Menthol + Camphor', 'Inhaler Stick', (SELECT id FROM categories WHERE name='Nasal Decongestant'), 'piece', 50, false, 'room_temperature', 100, 10, 'SEED-MED-298', '2028-12-31', 38),
('Throat Lozenges (Dequalinium)', 'Dequalin Equivalent', (SELECT id FROM categories WHERE name='Antiseptic Lozenge'), 'strip', 80, false, 'room_temperature', 100, 10, 'SEED-MED-299', '2028-12-31', 60),
('Benzydamine', 'Oral Spray / Gargle', (SELECT id FROM categories WHERE name='Topical Oral Analgesic'), 'bottle', 210, false, 'room_temperature', 100, 10, 'SEED-MED-300', '2028-12-31', 158);
