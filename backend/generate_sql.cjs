const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../ethiopia_pharmacy_medicines_300.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

let sql = `
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
`;

const categories = [...new Set(data.map(item => item.category))];
for (const cat of categories) {
  const safeCat = cat.replace(/'/g, "''");
  sql += `INSERT INTO categories (name) VALUES ('${safeCat}') ON CONFLICT (name) DO NOTHING;\n`;
}

sql += `\n-- 3. Insert Medicines\n`;
sql += `INSERT INTO medicines (name, form_and_strength, category_id, unit_of_measure, selling_price, requires_prescription, storage_condition, stock_qty, low_stock_threshold, batch_no, expiry_date, purchase_price) VALUES\n`;

const values = data.map(item => {
  const name = item.generic_name.replace(/'/g, "''");
  const form = item.form_and_strength.replace(/'/g, "''");
  const cat = item.category.replace(/'/g, "''");
  const uom = item.unit_of_measure.replace(/'/g, "''");
  const price = item.retail_price_etb;
  const rx = item.requires_prescription;
  const storage = item.storage_condition.replace(/'/g, "''");
  
  // Dummy data for required non-null fields
  const purchasePrice = Math.round(price * 0.75); // 25% margin
  const batchNo = `'SEED-${item.id}'`;
  const expiry = `'2028-12-31'`;
  
  return `('${name}', '${form}', (SELECT id FROM categories WHERE name='${cat}'), '${uom}', ${price}, ${rx}, '${storage}', 100, 10, ${batchNo}, ${expiry}, ${purchasePrice})`;
});

sql += values.join(",\n") + ";\n";

fs.writeFileSync(path.join(__dirname, "insert_medicines.sql"), sql);
console.log("SQL script updated successfully.");
