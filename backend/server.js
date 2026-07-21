import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

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
let useMockDb = false;

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    console.log('✅ Supabase client created successfully!');
    // Attempt to verify tables exist — if not, stay on mock DB
    const { error: checkError } = await supabase.from('medicines').select('id', { count: 'exact', head: true });
    if (checkError && checkError.message?.includes('relation')) {
      console.log('   ⚠️ Tables not found — migration required. Using mock DB until tables are created.');
      useMockDb = true;
    } else if (checkError) {
      console.log('   ⚠️ Supabase reachable but got:', checkError.message);
      console.log('   ✅ Using Supabase mode (this may change if queries fail).');
    } else {
      console.log('   ✅ Database tables found! Running in Supabase mode.');
    }
  } catch (err) {
    console.warn('⚠️ Supabase initialization failed. Falling back to in-memory Mock DB.');
    useMockDb = true;
  }
} else {
  console.warn('⚠️ Missing SUPABASE_URL or SUPABASE_SECRET_KEY. Falling back to in-memory Mock DB.');
  useMockDb = true;
}

// In-Memory Database Fallback State (if Supabase is not configured)
const mockDb = {
  users: [
    { id: 1, name: 'Dr. Jane Foster', email: 'jane@pharmacy.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Mark Miller', email: 'mark@pharmacy.com', role: 'Pharmacist', status: 'Active' },
    { id: 3, name: 'Lucy Heart', email: 'lucy@pharmacy.com', role: 'Cashier', status: 'Active' }
  ],
  medicines: [
    { id: 1, name: 'Paracetamol 500mg', category: 'Analgesics', barcode: '8901234567890', batchNo: 'B-PR204', expiryDate: '2027-12-15', purchasePrice: 0.5, sellingPrice: 1.5, stockQty: 250, lowStockThreshold: 50, supplierId: 1 },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics', barcode: '8901234567891', batchNo: 'B-AM509', expiryDate: '2026-09-30', purchasePrice: 2.2, sellingPrice: 4.5, stockQty: 15, lowStockThreshold: 30, supplierId: 2 }
  ],
  suppliers: [
    { id: 1, name: 'PharmaDistributors Ltd', contact: 'John Smith', email: 'john@pharmadist.com', address: '123 Supply Ave, Medical City', balance: 450.00 }
  ],
  customers: [
    { id: 1, name: 'Alice Cooper', phone: '0712345678', email: 'alice@gmail.com', loyaltyPoints: 120 }
  ],
  sales: [],
  prescriptions: [],
  inventoryLogs: []
};

// ----------------------------------------------------
// Helper: flatten Supabase joined row to frontend format
// ----------------------------------------------------
function flattenMedicine(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.categories?.name || '',
    barcode: row.barcode,
    batchNo: row.batch_no,
    expiryDate: row.expiry_date,
    purchasePrice: Number(row.purchase_price),
    sellingPrice: Number(row.selling_price),
    stockQty: row.stock_qty,
    lowStockThreshold: row.low_stock_threshold,
    supplierId: row.supplier_id ? String(row.supplier_id) : '',
    supplierName: row.suppliers?.name || ''
  };
}

function flattenPrescription(row) {
  return {
    id: row.id,
    customerId: row.customer_id,
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

// Staff Login Auth
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  if (useMockDb) {
    const user = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Staff account credentials invalid' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user });
  }

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
      id: userData.id,
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
  if (useMockDb) return res.json(mockDb.medicines);
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
  const { name, category, barcode, batchNo, expiryDate, purchasePrice, sellingPrice, stockQty, lowStockThreshold, supplierId } = req.body;

  if (useMockDb) {
    const newMed = {
      id: mockDb.medicines.length + 1,
      name, category, barcode, batchNo, expiryDate,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stockQty: Number(stockQty),
      lowStockThreshold: Number(lowStockThreshold),
      supplierId: Number(supplierId)
    };
    mockDb.medicines.push(newMed);
    return res.status(201).json(newMed);
  }

  try {
    // Resolve category - find or create
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
        category_id: catId,
        barcode,
        batch_no: batchNo,
        expiry_date: expiryDate,
        purchase_price: Number(purchasePrice),
        selling_price: Number(sellingPrice),
        stock_qty: Number(stockQty),
        low_stock_threshold: Number(lowStockThreshold),
        supplier_id: supplierId ? Number(supplierId) : null
      })
      .select('*, categories(name), suppliers(name)')
      .single();

    if (error) throw error;
    res.status(201).json(flattenMedicine(data));
  } catch (error) {
    res.status(500).json({ error: 'Error inserting product into database' });
  }
});

// GET suppliers list
app.get('/api/suppliers', async (req, res) => {
  if (useMockDb) return res.json(mockDb.suppliers);
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error loading suppliers' });
  }
});

// POST add new supplier
app.post('/api/suppliers', async (req, res) => {
  const { name, contact, email, address } = req.body;
  if (useMockDb) {
    const newSup = { id: mockDb.suppliers.length + 1, name, contact, email, address, balance: 0.00 };
    mockDb.suppliers.push(newSup);
    return res.status(201).json(newSup);
  }
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .insert({ name, contact, email, address })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error saving supplier profile' });
  }
});

// GET customer CRM registry
app.get('/api/customers', async (req, res) => {
  if (useMockDb) return res.json(mockDb.customers);
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error loading customer registry' });
  }
});

// POST save customer profile
app.post('/api/customers', async (req, res) => {
  const { name, phone, email } = req.body;
  if (useMockDb) {
    const newCust = { id: mockDb.customers.length + 1, name, phone, email, loyaltyPoints: 0 };
    mockDb.customers.push(newCust);
    return res.status(201).json(newCust);
  }
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert({ name, phone, email })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error saving customer details' });
  }
});

// GET medical prescriptions list
app.get('/api/prescriptions', async (req, res) => {
  if (useMockDb) return res.json(mockDb.prescriptions);
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

  if (useMockDb) {
    const newSale = { id: mockDb.sales.length + 1, customerId, userId, total, paymentMethod, items, createdAt: new Date().toISOString() };
    mockDb.sales.push(newSale);
    return res.status(201).json(newSale);
  }

  try {
    // Insert the sale record
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert({
        customer_id: customerId || null,
        user_id: userId || null,
        subtotal,
        discount: discount || 0,
        tax,
        total,
        payment_method: paymentMethod
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
          medicine_id: item.medicineId,
          qty: item.qty,
          unit_price: item.price,
          discount: item.discount || 0
        });

      if (itemError) throw itemError;

      // Read current stock, then update
      const { data: medStock } = await supabase
        .from('medicines')
        .select('stock_qty')
        .eq('id', item.medicineId)
        .single();

      if (medStock) {
        const newStock = Math.max(0, medStock.stock_qty - item.qty);
        await supabase
          .from('medicines')
          .update({ stock_qty: newStock })
          .eq('id', item.medicineId);
      }

      // Record inventory log
      await supabase
        .from('inventory_logs')
        .insert({
          medicine_id: item.medicineId,
          type: 'Stock Out',
          qty: -item.qty,
          reason: `POS Sale ${saleId} transaction`,
          user_id: userId || null
        });
    }

    // Award loyalty points (read current, then update)
    if (customerId) {
      const { data: cust } = await supabase
        .from('customers')
        .select('loyalty_points')
        .eq('id', customerId)
        .single();

      if (cust) {
        const newPoints = cust.loyalty_points + Math.floor(total);
        await supabase
          .from('customers')
          .update({ loyalty_points: newPoints })
          .eq('id', customerId);
      }
    }

    res.status(201).json({ id: saleId, message: 'POS transaction checked out and logged successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'POS database transaction rollback exception' });
  }
});

// GET analytics dashboard report indices
app.get('/api/reports/dashboard', async (req, res) => {
  if (useMockDb) {
    const todaySalesTotal = mockDb.sales.reduce((acc, curr) => acc + curr.total, 0);
    const lowStockCount = mockDb.medicines.filter(m => m.stockQty <= m.lowStockThreshold).length;
    return res.json({
      todaySalesTotal,
      lowStockCount,
      totalCatalog: mockDb.medicines.length
    });
  }
  try {
    // Get today's date boundaries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get today's sales total
    const { data: salesData } = await supabase
      .from('sales')
      .select('total')
      .gte('created_at', todayStart.toISOString())
      .lte('created_at', todayEnd.toISOString());

    // Get medicines for low stock + total count
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
