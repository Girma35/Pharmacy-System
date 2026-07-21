import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'pharmacy-secure-jwt-key-2026';

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// Supabase Client Setup
// ----------------------------------------------------
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;
let supabase;

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    console.log('✅ Supabase client created successfully!');
  } catch (err) {
    console.error('❌ Supabase initialization failed.');
    process.exit(1);
  }
} else {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env file.');
  process.exit(1);
}

// ----------------------------------------------------
// Helper: flatten Supabase joined row to frontend format
// ----------------------------------------------------
function flattenMedicine(row) {
  return {
    id: String(row.id),
    name: row.name,
    formAndStrength: row.form_and_strength || '',
    category: row.categories?.name || '',
    unitOfMeasure: row.unit_of_measure || '',
    barcode: row.barcode,
    batchNo: row.batch_no,
    expiryDate: row.expiry_date,
    purchasePrice: Number(row.purchase_price),
    sellingPrice: Number(row.selling_price),
    stockQty: row.stock_qty,
    lowStockThreshold: row.low_stock_threshold,
    supplierId: row.supplier_id ? String(row.supplier_id) : '',
    supplierName: row.suppliers?.name || '',
    requiresPrescription: row.requires_prescription || false,
    storageCondition: row.storage_condition || 'room_temperature'
  };
}

function flattenPrescription(row) {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    customerName: row.customers?.name || '',
    doctorName: row.doctor_name,
    notes: row.notes,
    prescriptionDate: row.prescription_date,
    medicines: row.medicines || []
  };
}

// ----------------------------------------------------
// Endpoints & Controller Logic
// ----------------------------------------------------

// SEED Endpoint
app.post('/api/seed', async (req, res) => {
  try {
    const dataPath = path.join(process.cwd(), '..', 'ethiopia_pharmacy_medicines_300.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const catalogData = JSON.parse(rawData);
    
    // Seed generic categories first if they don't exist
    const categoriesSet = new Set(catalogData.map(m => m.category));
    const categoriesArray = Array.from(categoriesSet);
    
    for (const catName of categoriesArray) {
      await supabase.from('categories').insert({ name: catName }).select('id').maybeSingle();
    }
    
    // Default supplier if no suppliers exist
    let { data: suppliers } = await supabase.from('suppliers').select('id');
    if (!suppliers || suppliers.length === 0) {
      await supabase.from('suppliers').insert([
        { name: 'EPHARM – Ethiopian Pharmaceuticals', contact: 'Mulugeta', email: 'supply@epharm.gov.et' },
        { name: 'Addis Pharma Distributors', contact: 'Tigist', email: 'orders@addispharma.com' }
      ]);
      suppliers = (await supabase.from('suppliers').select('id')).data;
    }

    // Prepare medicines payload
    const payload = [];
    for (const [index, m] of catalogData.entries()) {
      // Find category ID
      const { data: catData } = await supabase.from('categories').select('id').eq('name', m.category).single();
      const catId = catData ? catData.id : null;
      
      const supplierId = suppliers[index % suppliers.length].id;
      
      payload.push({
        name: m.generic_name,
        form_and_strength: m.form_and_strength,
        category_id: catId,
        unit_of_measure: m.unit_of_measure,
        barcode: `8910234${String(index+1).padStart(6, '0')}`,
        batch_no: `BT-${m.id.replace('MED-', '')}`,
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        purchase_price: Math.round(m.retail_price_etb * 0.7),
        selling_price: m.retail_price_etb,
        stock_qty: m.storage_condition === 'locked_cabinet' ? 10 : 50,
        low_stock_threshold: 10,
        supplier_id: supplierId,
        requires_prescription: m.requires_prescription,
        storage_condition: m.storage_condition
      });
    }
    
    const { error } = await supabase.from('medicines').insert(payload);
    if (error) {
       console.error("Insert error:", error);
       throw error;
    }
    
    res.json({ message: `Successfully seeded ${payload.length} medicines.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to seed database.' });
  }
});


// Staff Login Auth
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('id, name, email, status, role_id, roles!inner(name)')
      .eq('email', email.toLowerCase())
      .eq('status', 'Active')
      .single();

    if (error || !userData) {
      return res.status(401).json({ error: 'Staff account invalid or deactivated' });
    }

    const user = {
      id: String(userData.id),
      name: userData.name,
      email: userData.email,
      role: userData.roles.name,
      status: userData.status
    };

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Login authentication database query error' });
  }
});

// GET catalog medicines
app.get('/api/medicines', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*, categories(name), suppliers(name)')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data.map(flattenMedicine));
  } catch (error) {
    res.status(500).json({ error: 'Error loading medicines catalog' });
  }
});

// POST save/add new medicine
app.post('/api/medicines', async (req, res) => {
  const { name, formAndStrength, category, unitOfMeasure, barcode, batchNo, expiryDate, purchasePrice, sellingPrice, stockQty, lowStockThreshold, supplierId, requiresPrescription, storageCondition } = req.body;

  try {
    let catId;
    const { data: existingCat } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category)
      .maybeSingle();

    if (existingCat) {
      catId = existingCat.id;
    } else {
      const { data: newCat, error: catError } = await supabase
        .from('categories')
        .insert({ name: category })
        .select('id')
        .single();
      if (catError) throw catError;
      catId = newCat.id;
    }

    const { data, error } = await supabase
      .from('medicines')
      .insert({
        name,
        form_and_strength: formAndStrength,
        category_id: catId,
        unit_of_measure: unitOfMeasure,
        barcode,
        batch_no: batchNo,
        expiry_date: expiryDate,
        purchase_price: Number(purchasePrice),
        selling_price: Number(sellingPrice),
        stock_qty: Number(stockQty),
        low_stock_threshold: Number(lowStockThreshold),
        supplier_id: supplierId ? Number(supplierId) : null,
        requires_prescription: requiresPrescription,
        storage_condition: storageCondition
      })
      .select('*, categories(name), suppliers(name)')
      .single();

    if (error) throw error;
    res.status(201).json(flattenMedicine(data));
  } catch (error) {
    res.status(500).json({ error: 'Error inserting product into database' });
  }
});

// PUT edit medicine
app.put('/api/medicines/:id', async (req, res) => {
  const { id } = req.params;
  const { name, formAndStrength, category, unitOfMeasure, barcode, batchNo, expiryDate, purchasePrice, sellingPrice, stockQty, lowStockThreshold, supplierId, requiresPrescription, storageCondition } = req.body;

  try {
    let catId;
    const { data: existingCat } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category)
      .maybeSingle();

    if (existingCat) {
      catId = existingCat.id;
    } else {
      const { data: newCat, error: catError } = await supabase
        .from('categories')
        .insert({ name: category })
        .select('id')
        .single();
      if (catError) throw catError;
      catId = newCat.id;
    }

    const { data, error } = await supabase
      .from('medicines')
      .update({
        name,
        form_and_strength: formAndStrength,
        category_id: catId,
        unit_of_measure: unitOfMeasure,
        barcode,
        batch_no: batchNo,
        expiry_date: expiryDate,
        purchase_price: Number(purchasePrice),
        selling_price: Number(sellingPrice),
        stock_qty: Number(stockQty),
        low_stock_threshold: Number(lowStockThreshold),
        supplier_id: supplierId ? Number(supplierId) : null,
        requires_prescription: requiresPrescription,
        storage_condition: storageCondition
      })
      .eq('id', id)
      .select('*, categories(name), suppliers(name)')
      .single();

    if (error) throw error;
    res.json(flattenMedicine(data));
  } catch (error) {
    res.status(500).json({ error: 'Error updating product in database' });
  }
});

// DELETE medicine
app.delete('/api/medicines/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('medicines').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

// GET suppliers list
app.get('/api/suppliers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data.map(s => ({ ...s, id: String(s.id) })));
  } catch (error) {
    res.status(500).json({ error: 'Error loading suppliers' });
  }
});

// POST add new supplier
app.post('/api/suppliers', async (req, res) => {
  const { name, contact, email, address } = req.body;
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .insert({ name, contact, email, address })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ ...data, id: String(data.id) });
  } catch (error) {
    res.status(500).json({ error: 'Error saving supplier profile' });
  }
});

// GET customer CRM registry
app.get('/api/customers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data.map(c => ({ ...c, id: String(c.id), loyaltyPoints: c.loyalty_points })));
  } catch (error) {
    res.status(500).json({ error: 'Error loading customer registry' });
  }
});

// POST save customer profile
app.post('/api/customers', async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert({ name, phone, email })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ ...data, id: String(data.id), loyaltyPoints: data.loyalty_points });
  } catch (error) {
    res.status(500).json({ error: 'Error saving customer details' });
  }
});

// GET medical prescriptions list
app.get('/api/prescriptions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, customers!inner(name)')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data.map(flattenPrescription));
  } catch (error) {
    res.status(500).json({ error: 'Error querying prescriptions database' });
  }
});

// POST save new sales checkout transactions
app.post('/api/sales', async (req, res) => {
  const { customerId, userId, subtotal, discount, tax, total, paymentMethod, items } = req.body;

  try {
    // Insert the sale record
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert({
        customer_id: customerId ? Number(customerId) : null,
        user_id: userId ? Number(userId) : null,
        subtotal,
        discount: discount || 0,
        tax: tax || 0,
        total,
        payment_method: paymentMethod || 'Cash'
      })
      .select('id')
      .single();

    if (saleError) throw saleError;
    const saleId = saleData.id;

    // Insert sale items & update stock levels
    for (const item of items) {
      const { error: itemError } = await supabase
        .from('sale_items')
        .insert({
          sale_id: saleId,
          medicine_id: Number(item.medicineId),
          qty: item.qty,
          unit_price: item.price,
          discount: item.discount || 0
        });

      if (itemError) throw itemError;

      // Read current stock, then update
      const { data: medStock } = await supabase
        .from('medicines')
        .select('stock_qty')
        .eq('id', Number(item.medicineId))
        .single();

      if (medStock) {
        const newStock = Math.max(0, medStock.stock_qty - item.qty);
        await supabase
          .from('medicines')
          .update({ stock_qty: newStock })
          .eq('id', Number(item.medicineId));
      }

      // Record inventory log
      await supabase
        .from('inventory_logs')
        .insert({
          medicine_id: Number(item.medicineId),
          type: 'Stock Out',
          qty: -item.qty,
          reason: `POS Sale ${saleId} transaction`,
          user_id: userId ? Number(userId) : null
        });
    }

    // Award loyalty points
    if (customerId) {
      const { data: cust } = await supabase
        .from('customers')
        .select('loyalty_points')
        .eq('id', Number(customerId))
        .single();

      if (cust) {
        const newPoints = cust.loyalty_points + Math.floor(total);
        await supabase
          .from('customers')
          .update({ loyalty_points: newPoints })
          .eq('id', Number(customerId));
      }
    }

    res.status(201).json({ id: String(saleId), message: 'POS transaction checked out and logged successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'POS database transaction rollback exception' });
  }
});

// GET sales list
app.get('/api/sales', async (req, res) => {
  try {
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select(`
        *,
        customers(name),
        users(name),
        sale_items(
          id,
          qty,
          unit_price,
          discount,
          medicines(name, form_and_strength, unit_of_measure)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (salesError) throw salesError;
    
    const formatted = sales.map(s => ({
       id: String(s.id),
       customerId: s.customer_id ? String(s.customer_id) : undefined,
       customerName: s.customers?.name || 'Walk-in',
       userId: s.user_id ? String(s.user_id) : 'System',
       userName: s.users?.name || 'System',
       items: (s.sale_items || []).map((si: any) => ({
         medicineId: String(si.id),
         name: si.medicines
           ? `${si.medicines.name}${si.medicines.form_and_strength ? ' ' + si.medicines.form_and_strength : ''}`
           : 'Unknown Medicine',
         qty: si.qty,
         price: Number(si.unit_price),
         discount: Number(si.discount || 0),
         unitOfMeasure: si.medicines?.unit_of_measure || ''
       })),
       subtotal: Number(s.subtotal),
       discount: Number(s.discount),
       total: Number(s.total),
       paymentMethod: s.payment_method,
       createdAt: s.created_at
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sales' });
  }
});


// GET analytics dashboard report indices
app.get('/api/reports/dashboard', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data: salesData } = await supabase
      .from('sales')
      .select('total')
      .gte('created_at', todayStart.toISOString())
      .lte('created_at', todayEnd.toISOString());

    const { data: medData, count: totalCatalog } = await supabase
      .from('medicines')
      .select('stock_qty, low_stock_threshold', { count: 'exact' });

    const todaySalesTotal = salesData?.reduce((sum, s) => sum + Number(s.total), 0) || 0;
    const lowStockCount = medData?.filter(m => m.stock_qty <= m.low_stock_threshold).length || 0;

    res.json({
      todaySalesTotal,
      lowStockCount,
      totalCatalog: totalCatalog || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Error loading dashboard report stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Pharmacy API service listening on http://localhost:${PORT}`);
});
