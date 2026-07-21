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
