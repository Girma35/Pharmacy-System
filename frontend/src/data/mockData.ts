import catalogData from './ethiopia_pharmacy_medicines_300.json';

// ──────────────────────────────────────────────
//  Core Interfaces
// ──────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Pharmacist' | 'Cashier';
  status: 'Active' | 'Inactive';
}

export interface Medicine {
  id: string;
  name: string;
  formAndStrength: string;
  category: string;
  unitOfMeasure: string;
  barcode: string;
  batchNo: string;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQty: number;
  lowStockThreshold: number;
  supplierId: string;
  requiresPrescription: boolean;
  storageCondition: 'room_temperature' | 'refrigerated_2_to_8C' | 'locked_cabinet';
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  balance: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
}

export interface SaleItem {
  medicineId: string;
  name: string;
  qty: number;
  price: number;
  discount: number;
}

export interface Sale {
  id: string;
  customerId?: string;
  customerName?: string;
  userId: string;
  userName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'Cash' | 'Bank Transfer';
  createdAt: string;
}

export interface PurchaseItem {
  medicineId: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  total: number;
  status: 'Pending' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface Prescription {
  id: string;
  customerId: string;
  customerName: string;
  doctorName: string;
  notes: string;
  prescriptionDate: string;
  medicines: string[];
}

export interface InventoryLog {
  id: string;
  medicineId: string;
  medicineName: string;
  type: 'Stock In' | 'Stock Out' | 'Adjustment';
  qty: number;
  reason: string;
  userName: string;
  createdAt: string;
}

export interface SystemSettings {
  pharmacyName: string;
  address: string;
  phone: string;
  email: string;
  taxRate: number;
  currency: string;
  receiptFooter: string;
}

// ──────────────────────────────────────────────
//  Helper functions for generating seed data
// ──────────────────────────────────────────────

function getStockQty(storageCondition: string, index: number): number {
  const seed = (index * 37 + 13) % 100;
  if (storageCondition === 'locked_cabinet') return 5 + (seed % 16);    // 5–20
  if (storageCondition === 'refrigerated_2_to_8C') return 8 + (seed % 23); // 8–30
  return 40 + (seed % 161);  // 40–200
}

function getLowStockThreshold(storageCondition: string): number {
  if (storageCondition === 'locked_cabinet') return 5;
  if (storageCondition === 'refrigerated_2_to_8C') return 8;
  return 20;
}

function getExpiryDate(index: number): string {
  const d = new Date();
  // Every 15th medicine expires in ~60 days for dashboard alert realism
  if (index % 15 === 0) {
    d.setDate(d.getDate() + 45 + (index % 45));
  } else if (index % 8 === 0) {
    // ~12% expiring in 3–6 months
    d.setMonth(d.getMonth() + 3 + (index % 4));
  } else {
    // Rest expire in 1–3 years
    d.setFullYear(d.getFullYear() + 1 + (index % 3));
    d.setMonth((index * 3) % 12);
    d.setDate(1 + (index % 28));
  }
  return d.toISOString().split('T')[0];
}

function getBarcode(id: string): string {
  const num = id.replace('MED-', '');
  return `8910234${num.padStart(6, '0')}`;
}

// ──────────────────────────────────────────────
//  Initial Data: 300 Ethiopian Medicines
// ──────────────────────────────────────────────

export const initialMedicines: Medicine[] = (catalogData as any[]).map((m, index) => {
  const storageCondition = m.storage_condition as Medicine['storageCondition'];
  const purchasePrice = Math.round(m.retail_price_etb * 0.70);
  const supplierId = String((index % 4) + 1);

  return {
    id: m.id,
    name: m.generic_name,
    formAndStrength: m.form_and_strength,
    category: m.category,
    unitOfMeasure: m.unit_of_measure,
    barcode: getBarcode(m.id),
    batchNo: `BT-${m.id.replace('MED-', '')}`,
    expiryDate: getExpiryDate(index),
    purchasePrice,
    sellingPrice: m.retail_price_etb,
    stockQty: getStockQty(m.storage_condition, index),
    lowStockThreshold: getLowStockThreshold(m.storage_condition),
    supplierId,
    requiresPrescription: m.requires_prescription,
    storageCondition,
  };
});

// ──────────────────────────────────────────────
//  Initial Data: Ethiopian Suppliers
// ──────────────────────────────────────────────

export const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'EPHARM – Ethiopian Pharmaceuticals',
    contact: 'Mulugeta Assefa',
    email: 'supply@epharm.gov.et',
    address: 'Bole Sub-City, Addis Ababa',
    balance: 12500,
  },
  {
    id: '2',
    name: 'Addis Pharma Distributors',
    contact: 'Tigist Bekele',
    email: 'orders@addispharma.com',
    address: 'Kirkos Sub-City, Addis Ababa',
    balance: 8400,
  },
  {
    id: '3',
    name: 'Ethiopian Health Network',
    contact: 'Samuel Haile',
    email: 'procurement@ehn.com.et',
    address: 'Yeka Sub-City, Addis Ababa',
    balance: 6200,
  },
  {
    id: '4',
    name: 'MedLink Ethiopia',
    contact: 'Rahel Solomon',
    email: 'info@medlink.et',
    address: 'Lideta Sub-City, Addis Ababa',
    balance: 3800,
  },
];

// ──────────────────────────────────────────────
//  Initial Data: Customers
// ──────────────────────────────────────────────

export const initialCustomers: Customer[] = [
  { id: '1', name: 'Abebe Girma', phone: '0911234567', email: 'abebe.girma@gmail.com', loyaltyPoints: 340 },
  { id: '2', name: 'Tigist Alemu', phone: '0922345678', email: 'tigist.alemu@yahoo.com', loyaltyPoints: 180 },
  { id: '3', name: 'Yonas Tadesse', phone: '0933456789', email: 'yonas.tadesse@gmail.com', loyaltyPoints: 95 },
  { id: '4', name: 'Mekdes Haile', phone: '0944567890', email: 'mekdes.h@outlook.com', loyaltyPoints: 520 },
  { id: '5', name: 'Dawit Bekele', phone: '0955678901', email: 'dawit.bekele@gmail.com', loyaltyPoints: 70 },
];

// ──────────────────────────────────────────────
//  Initial Data: Staff Users
// ──────────────────────────────────────────────

export const initialUsers: User[] = [
  { id: '1', name: 'Dr. Jane Foster', email: 'jane@pharmacy.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Mark Miller', email: 'mark@pharmacy.com', role: 'Pharmacist', status: 'Active' },
  { id: '3', name: 'Lucy Heart', email: 'lucy@pharmacy.com', role: 'Cashier', status: 'Active' },
  { id: '4', name: 'Abiy Tesfaye', email: 'abiy@pharmacy.com', role: 'Pharmacist', status: 'Active' },
  { id: '5', name: 'Hiwot Lemma', email: 'hiwot@pharmacy.com', role: 'Cashier', status: 'Inactive' },
];

// ──────────────────────────────────────────────
//  Initial Data: Sales Transactions
// ──────────────────────────────────────────────

const now = new Date();
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000).toISOString();
const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

export const initialSales: Sale[] = [
  {
    id: 'S-10001',
    customerId: '1',
    customerName: 'Abebe Girma',
    userId: '3',
    userName: 'Lucy Heart',
    items: [
      { medicineId: 'MED-021', name: 'Paracetamol 500mg Tablet', qty: 2, price: 30, discount: 0 },
      { medicineId: 'MED-022', name: 'Ibuprofen 400mg Tablet', qty: 1, price: 60, discount: 0 },
    ],
    subtotal: 120,
    discount: 0,
    tax: 18,
    total: 138,
    paymentMethod: 'Cash',
    createdAt: h(1),
  },
  {
    id: 'S-10002',
    customerId: '2',
    customerName: 'Tigist Alemu',
    userId: '3',
    userName: 'Lucy Heart',
    items: [
      { medicineId: 'MED-036', name: 'Omeprazole 20mg Capsule', qty: 1, price: 110, discount: 0 },
      { medicineId: 'MED-041', name: 'Hyoscine Butylbromide 10mg Tablet', qty: 1, price: 85, discount: 5 },
    ],
    subtotal: 190,
    discount: 5,
    tax: 27.75,
    total: 212.75,
    paymentMethod: 'Bank Transfer',
    createdAt: h(3),
  },
  {
    id: 'S-10003',
    customerId: undefined,
    customerName: 'Walk-in Customer',
    userId: '3',
    userName: 'Lucy Heart',
    items: [
      { medicineId: 'MED-044', name: 'Oral Rehydration Salt Sachet', qty: 5, price: 25, discount: 0 },
      { medicineId: 'MED-046', name: 'Loperamide 2mg Capsule', qty: 1, price: 50, discount: 0 },
    ],
    subtotal: 175,
    discount: 0,
    tax: 26.25,
    total: 201.25,
    paymentMethod: 'Cash',
    createdAt: h(5),
  },
  {
    id: 'S-10004',
    customerId: '4',
    customerName: 'Mekdes Haile',
    userId: '2',
    userName: 'Mark Miller',
    items: [
      { medicineId: 'MED-071', name: 'Metformin 500mg Tablet', qty: 2, price: 110, discount: 0 },
      { medicineId: 'MED-051', name: 'Amlodipine 5mg Tablet', qty: 1, price: 120, discount: 10 },
    ],
    subtotal: 330,
    discount: 10,
    tax: 48,
    total: 368,
    paymentMethod: 'Cash',
    createdAt: d(1),
  },
  {
    id: 'S-10005',
    customerId: '1',
    customerName: 'Abebe Girma',
    userId: '3',
    userName: 'Lucy Heart',
    items: [
      { medicineId: 'MED-001', name: 'Amoxicillin 500mg Capsule', qty: 1, price: 180, discount: 0 },
    ],
    subtotal: 180,
    discount: 0,
    tax: 27,
    total: 207,
    paymentMethod: 'Cash',
    createdAt: d(2),
  },
  {
    id: 'S-10006',
    customerId: '3',
    customerName: 'Yonas Tadesse',
    userId: '3',
    userName: 'Lucy Heart',
    items: [
      { medicineId: 'MED-026', name: 'Aspirin 100mg Tablet', qty: 1, price: 40, discount: 0 },
      { medicineId: 'MED-062', name: 'Atorvastatin 20mg Tablet', qty: 1, price: 320, discount: 20 },
    ],
    subtotal: 340,
    discount: 20,
    tax: 48,
    total: 368,
    paymentMethod: 'Bank Transfer',
    createdAt: d(3),
  },
  {
    id: 'S-10007',
    customerId: undefined,
    customerName: 'Walk-in Customer',
    userId: '3',
    userName: 'Lucy Heart',
    items: [
      { medicineId: 'MED-021', name: 'Paracetamol 500mg Tablet', qty: 3, price: 30, discount: 0 },
      { medicineId: 'MED-034', name: 'Paracetamol Syrup 120mg/5ml', qty: 1, price: 110, discount: 0 },
    ],
    subtotal: 200,
    discount: 0,
    tax: 30,
    total: 230,
    paymentMethod: 'Cash',
    createdAt: d(4),
  },
  {
    id: 'S-10008',
    customerId: '5',
    customerName: 'Dawit Bekele',
    userId: '2',
    userName: 'Mark Miller',
    items: [
      { medicineId: 'MED-003', name: 'Ciprofloxacin 500mg Tablet', qty: 1, price: 150, discount: 0 },
    ],
    subtotal: 150,
    discount: 0,
    tax: 22.5,
    total: 172.5,
    paymentMethod: 'Cash',
    createdAt: d(5),
  },
];

// ──────────────────────────────────────────────
//  Initial Data: Purchase Orders
// ──────────────────────────────────────────────

export const initialPurchases: PurchaseOrder[] = [
  {
    id: 'PO-5001',
    supplierId: '1',
    supplierName: 'EPHARM – Ethiopian Pharmaceuticals',
    items: [
      { medicineId: 'MED-001', name: 'Amoxicillin 500mg Capsule', qty: 200, unitPrice: 126 },
      { medicineId: 'MED-003', name: 'Ciprofloxacin 500mg Tablet', qty: 100, unitPrice: 105 },
    ],
    total: 36700,
    status: 'Delivered',
    createdAt: d(10),
  },
  {
    id: 'PO-5002',
    supplierId: '2',
    supplierName: 'Addis Pharma Distributors',
    items: [
      { medicineId: 'MED-021', name: 'Paracetamol 500mg Tablet', qty: 500, unitPrice: 21 },
      { medicineId: 'MED-036', name: 'Omeprazole 20mg Capsule', qty: 150, unitPrice: 77 },
    ],
    total: 22050,
    status: 'Delivered',
    createdAt: d(7),
  },
  {
    id: 'PO-5003',
    supplierId: '3',
    supplierName: 'Ethiopian Health Network',
    items: [
      { medicineId: 'MED-076', name: 'Insulin Soluble 100 IU/ml Vial', qty: 30, unitPrice: 455 },
      { medicineId: 'MED-077', name: 'Insulin Isophane NPH Vial', qty: 20, unitPrice: 476 },
    ],
    total: 23170,
    status: 'Pending',
    createdAt: d(2),
  },
  {
    id: 'PO-5004',
    supplierId: '4',
    supplierName: 'MedLink Ethiopia',
    items: [
      { medicineId: 'MED-051', name: 'Amlodipine 5mg Tablet', qty: 200, unitPrice: 84 },
      { medicineId: 'MED-071', name: 'Metformin 500mg Tablet', qty: 300, unitPrice: 77 },
    ],
    total: 39900,
    status: 'Delivered',
    createdAt: d(15),
  },
];

// ──────────────────────────────────────────────
//  Initial Data: Prescriptions
// ──────────────────────────────────────────────

export const initialPrescriptions: Prescription[] = [
  {
    id: 'PR-8001',
    customerId: '1',
    customerName: 'Abebe Girma',
    doctorName: 'Dr. Kebede Alemu',
    notes: 'Take Amoxicillin 500mg twice daily for 7 days with food.',
    prescriptionDate: d(3),
    medicines: ['Amoxicillin 500mg Capsule', 'Metronidazole 250mg Tablet'],
  },
  {
    id: 'PR-8002',
    customerId: '4',
    customerName: 'Mekdes Haile',
    doctorName: 'Dr. Selam Tesfaye',
    notes: 'Metformin for type 2 diabetes management. Monitor blood glucose weekly.',
    prescriptionDate: d(5),
    medicines: ['Metformin 500mg Tablet', 'Amlodipine 5mg Tablet'],
  },
  {
    id: 'PR-8003',
    customerId: '2',
    customerName: 'Tigist Alemu',
    doctorName: 'Dr. Haile Mariam',
    notes: 'Ciprofloxacin for UTI. Complete full course even if symptoms improve.',
    prescriptionDate: d(1),
    medicines: ['Ciprofloxacin 500mg Tablet'],
  },
  {
    id: 'PR-8004',
    customerId: '3',
    customerName: 'Yonas Tadesse',
    doctorName: 'Dr. Firehiwot Girma',
    notes: 'Atorvastatin for hyperlipidemia. Take in evening. Monitor LDL monthly.',
    prescriptionDate: d(7),
    medicines: ['Atorvastatin 20mg Tablet', 'Aspirin 100mg Tablet'],
  },
];

// ──────────────────────────────────────────────
//  Initial Data: Inventory Logs
// ──────────────────────────────────────────────

export const initialInventoryLogs: InventoryLog[] = [
  {
    id: '1',
    medicineId: 'MED-001',
    medicineName: 'Amoxicillin 500mg Capsule',
    type: 'Stock In',
    qty: 200,
    reason: 'Restock from supplier',
    userName: 'Mark Miller',
    createdAt: d(10),
  },
  {
    id: '2',
    medicineId: 'MED-021',
    medicineName: 'Paracetamol 500mg Tablet',
    type: 'Stock In',
    qty: 500,
    reason: 'Restock from supplier',
    userName: 'Dr. Jane Foster',
    createdAt: d(7),
  },
  {
    id: '3',
    medicineId: 'MED-076',
    medicineName: 'Insulin Soluble 100 IU/ml Vial',
    type: 'Stock In',
    qty: 30,
    reason: 'Restock from supplier',
    userName: 'Mark Miller',
    createdAt: d(5),
  },
  {
    id: '4',
    medicineId: 'MED-021',
    medicineName: 'Paracetamol 500mg Tablet',
    type: 'Stock Out',
    qty: -15,
    reason: 'Sale: Paracetamol 500mg Tablet',
    userName: 'Lucy Heart',
    createdAt: d(1),
  },
  {
    id: '5',
    medicineId: 'MED-071',
    medicineName: 'Metformin 500mg Tablet',
    type: 'Adjustment',
    qty: -2,
    reason: 'Damaged packaging',
    userName: 'Dr. Jane Foster',
    createdAt: d(3),
  },
  {
    id: '6',
    medicineId: 'MED-003',
    medicineName: 'Ciprofloxacin 500mg Tablet',
    type: 'Stock Out',
    qty: -1,
    reason: 'Sale: Ciprofloxacin 500mg Tablet',
    userName: 'Lucy Heart',
    createdAt: d(5),
  },
];

// ──────────────────────────────────────────────
//  Default System Settings
// ──────────────────────────────────────────────

export const defaultSettings: SystemSettings = {
  pharmacyName: 'Addis Pharmacy',
  address: 'Bole Road, Bole Sub-City, Addis Ababa, Ethiopia',
  phone: '+251 11 123 4567',
  email: 'info@addispharmacy.et',
  taxRate: 15,
  currency: 'ETB',
  receiptFooter: 'Thank you for choosing Addis Pharmacy. Stay healthy!',
};
