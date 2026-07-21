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
  category: string;
  barcode: string;
  batchNo: string;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQty: number;
  lowStockThreshold: number;
  supplierId: string;
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
  paymentMethod: 'Cash' | 'Card' | 'Mobile';
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

export const initialMedicines: Medicine[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Analgesics', barcode: '8901234567890', batchNo: 'B-PR204', expiryDate: '2027-12-15', purchasePrice: 0.5, sellingPrice: 1.5, stockQty: 250, lowStockThreshold: 50, supplierId: '1' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotics', barcode: '8901234567891', batchNo: 'B-AM509', expiryDate: '2026-09-30', purchasePrice: 2.2, sellingPrice: 4.5, stockQty: 15, lowStockThreshold: 30, supplierId: '2' },
  { id: '3', name: 'Loratadine 10mg', category: 'Antihistamines', barcode: '8901234567892', batchNo: 'B-LR112', expiryDate: '2026-05-10', purchasePrice: 1.0, sellingPrice: 2.5, stockQty: 120, lowStockThreshold: 20, supplierId: '1' },
  { id: '4', name: 'Ibuprofen 400mg', category: 'Analgesics', barcode: '8901234567893', batchNo: 'B-IB882', expiryDate: '2024-03-01', purchasePrice: 0.8, sellingPrice: 2.0, stockQty: 80, lowStockThreshold: 40, supplierId: '3' },
  { id: '5', name: 'Metformin 500mg', category: 'Antidiabetics', barcode: '8901234567894', batchNo: 'B-MT045', expiryDate: '2027-02-18', purchasePrice: 1.5, sellingPrice: 3.5, stockQty: 8, lowStockThreshold: 25, supplierId: '2' },
];

export const initialSuppliers: Supplier[] = [
  { id: '1', name: 'PharmaDistributors Ltd', contact: 'John Smith', email: 'john@pharmadist.com', address: '123 Supply Ave, Medical City', balance: 450 },
  { id: '2', name: 'Global BioTech Co', contact: 'Sarah Jenkins', email: 'sales@globalbiotech.com', address: '45 Science Park Road', balance: 1200 },
  { id: '3', name: 'Apex Pharma Group', contact: 'Robert Lee', email: 'robert@apexpharma.com', address: '78 Pharmacy Boulevard', balance: 0 },
];

export const initialCustomers: Customer[] = [
  { id: '1', name: 'Alice Cooper', phone: '0712345678', email: 'alice@gmail.com', loyaltyPoints: 120 },
  { id: '2', name: 'Bob Marley', phone: '0723456789', email: 'bob@yahoo.com', loyaltyPoints: 45 },
  { id: '3', name: 'Charlie Brown', phone: '0734567890', email: 'charlie@outlook.com', loyaltyPoints: 310 },
];

export const initialUsers: User[] = [
  { id: '1', name: 'Dr. Jane Foster', email: 'jane@pharmacy.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Mark Miller', email: 'mark@pharmacy.com', role: 'Pharmacist', status: 'Active' },
  { id: '3', name: 'Lucy Heart', email: 'lucy@pharmacy.com', role: 'Cashier', status: 'Active' },
];

export const initialSales: Sale[] = [
  {
    id: 'S-10001',
    customerId: '1',
    customerName: 'Alice Cooper',
    userId: '2',
    userName: 'Mark Miller',
    items: [
      { medicineId: '1', name: 'Paracetamol 500mg', qty: 2, price: 1.5, discount: 0 },
      { medicineId: '3', name: 'Loratadine 10mg', qty: 1, price: 2.5, discount: 0.5 },
    ],
    subtotal: 5.5,
    discount: 0.5,
    tax: 0.8,
    total: 5.8,
    paymentMethod: 'Cash',
    createdAt: '2026-07-19T10:15:30Z'
  },
  {
    id: 'S-10002',
    customerId: '3',
    customerName: 'Charlie Brown',
    userId: '3',
    userName: 'Lucy Heart',
    items: [
      { medicineId: '2', name: 'Amoxicillin 250mg', qty: 3, price: 4.5, discount: 0 }
    ],
    subtotal: 13.5,
    discount: 0,
    tax: 2.16,
    total: 15.66,
    paymentMethod: 'Card',
    createdAt: '2026-07-19T14:45:00Z'
  }
];

export const initialPurchases: PurchaseOrder[] = [
  {
    id: 'PO-5001',
    supplierId: '1',
    supplierName: 'PharmaDistributors Ltd',
    items: [
      { medicineId: '1', name: 'Paracetamol 500mg', qty: 100, unitPrice: 0.5 }
    ],
    total: 50,
    status: 'Delivered',
    createdAt: '2026-07-15T09:00:00Z'
  },
  {
    id: 'PO-5002',
    supplierId: '2',
    supplierName: 'Global BioTech Co',
    items: [
      { medicineId: '5', name: 'Metformin 500mg', qty: 50, unitPrice: 1.5 }
    ],
    total: 75,
    status: 'Pending',
    createdAt: '2026-07-18T11:30:00Z'
  }
];

export const initialPrescriptions: Prescription[] = [
  {
    id: 'PR-8001',
    customerId: '1',
    customerName: 'Alice Cooper',
    doctorName: 'Dr. John Watson',
    notes: 'Take Paracetamol 500mg twice daily for pain relief.',
    prescriptionDate: '2026-07-19',
    medicines: ['Paracetamol 500mg']
  }
];

export const initialInventoryLogs: InventoryLog[] = [
  { id: '1', medicineId: '1', medicineName: 'Paracetamol 500mg', type: 'Stock In', qty: 100, reason: 'Purchase order delivery', userName: 'Dr. Jane Foster', createdAt: '2026-07-15T09:00:00Z' },
  { id: '2', medicineId: '2', medicineName: 'Amoxicillin 250mg', type: 'Adjustment', qty: -5, reason: 'Damaged packaging', userName: 'Mark Miller', createdAt: '2026-07-16T12:00:00Z' }
];

export const defaultSettings: SystemSettings = {
  pharmacyName: 'PharmaCare Medicals',
  address: '456 Wellness Street, Health City',
  phone: '+1 (555) 987-6543',
  email: 'support@pharmacare.com',
  taxRate: 16,
  currency: '$',
  receiptFooter: 'Thank you for shopping with us! Get well soon.'
};
