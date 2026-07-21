import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import MedicineView from './components/MedicineView';
import SalesPOSView from './components/SalesPOSView';
import InventoryView from './components/InventoryView';
import SuppliersView from './components/SuppliersView';
import CustomersView from './components/CustomersView';
import PrescriptionsView from './components/PrescriptionsView';
import ReportsView from './components/ReportsView';
import UserManagementView from './components/UserManagementView';
import SettingsView from './components/SettingsView';

import {
  Medicine,
  Supplier,
  Customer,
  User,
  Sale,
  PurchaseOrder,
  Prescription,
  InventoryLog,
  SystemSettings,
  initialMedicines,
  initialSuppliers,
  initialCustomers,
  initialUsers,
  initialSales,
  initialPurchases,
  initialPrescriptions,
  initialInventoryLogs,
  defaultSettings
} from './data/mockData';
import { Pill, Lock, Mail } from 'lucide-react';

export default function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]); // Auto-login as Jane Foster (Admin) for instant preview
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // App Tabs State
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Database States
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(initialPurchases);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(initialInventoryLogs);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);

  // Auth Submit Action
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase() && u.status === 'Active');
    if (foundUser) {
      setCurrentUser(foundUser);
      setLoginError('');
      // Set default landing tab based on role permissions
      if (foundUser.role === 'Cashier') {
        setCurrentTab('sales-pos');
      } else {
        setCurrentTab('dashboard');
      }
    } else {
      setLoginError('Invalid email or inactive staff account.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
  };

  // CRUD & Stock Actions
  const handleAddMedicine = (newMed: Omit<Medicine, 'id'>) => {
    const med: Medicine = {
      ...newMed,
      id: (medicines.length + 1).toString()
    };
    setMedicines([...medicines, med]);
    
    // Add Inventory Log
    const newLog: InventoryLog = {
      id: (inventoryLogs.length + 1).toString(),
      medicineId: med.id,
      medicineName: med.name,
      type: 'Stock In',
      qty: med.stockQty,
      reason: 'New product cataloged',
      userName: currentUser?.name || 'System',
      createdAt: new Date().toISOString()
    };
    setInventoryLogs(prev => [...prev, newLog]);
  };

  const handleEditMedicine = (updatedMed: Medicine) => {
    setMedicines(medicines.map(m => m.id === updatedMed.id ? updatedMed : m));
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const handleAddSale = (newSale: any) => {
    const sale: Sale = {
      ...newSale,
      userId: currentUser?.id || '1',
      userName: currentUser?.name || 'System'
    };
    setSales(prev => [...prev, sale]);

    // Update stock levels & logs for each sold item
    newSale.items.forEach((item: any) => {
      setMedicines(prevMeds => prevMeds.map(m => {
        if (m.id === item.medicineId) {
          const nextStock = Math.max(0, m.stockQty - item.qty);
          return { ...m, stockQty: nextStock };
        }
        return m;
      }));

      // Log stock out
      setInventoryLogs(prevLogs => {
        const nextId = (prevLogs.length + 1).toString();
        const newLog: InventoryLog = {
          id: nextId,
          medicineId: item.medicineId,
          medicineName: item.name,
          type: 'Stock Out',
          qty: -item.qty,
          reason: `Sale ${sale.id} transaction`,
          userName: currentUser?.name || 'System',
          createdAt: new Date().toISOString()
        };
        return [...prevLogs, newLog];
      });
    });

    // Update customer loyalty points if customer selected
    if (newSale.customerId) {
      setCustomers(prevCusts => prevCusts.map(c => {
        if (c.id === newSale.customerId) {
          return { ...c, loyaltyPoints: c.loyaltyPoints + Math.floor(newSale.total) };
        }
        return c;
      }));
    }
  };

  const handleAdjustStock = (medId: string, qty: number, type: 'Stock In' | 'Stock Out' | 'Adjustment', reason: string) => {
    setMedicines(prevMeds => prevMeds.map(m => {
      if (m.id === medId) {
        const nextStock = Math.max(0, m.stockQty + qty);
        return { ...m, stockQty: nextStock };
      }
      return m;
    }));

    const medName = medicines.find(m => m.id === medId)?.name || 'Unknown Item';
    const newLog: InventoryLog = {
      id: (inventoryLogs.length + 1).toString(),
      medicineId: medId,
      medicineName: medName,
      type,
      qty,
      reason,
      userName: currentUser?.name || 'System',
      createdAt: new Date().toISOString()
    };
    setInventoryLogs(prev => [...prev, newLog]);
  };

  const handleAddSupplier = (newSup: Omit<Supplier, 'id'>) => {
    setSuppliers(prev => [...prev, { ...newSup, id: (prev.length + 1).toString() }]);
  };

  const handleAddPurchaseOrder = (newPO: Omit<PurchaseOrder, 'id'>) => {
    const po: PurchaseOrder = {
      ...newPO,
      id: `PO-${(purchases.length + 5001).toString()}`
    };
    setPurchases(prev => [...prev, po]);

    // Update supplier outstanding balance
    setSuppliers(prevSups => prevSups.map(s => {
      if (s.id === po.supplierId) {
        return { ...s, balance: s.balance + po.total };
      }
      return s;
    }));
  };

  const handlePaySupplier = (supplierId: string, amount: number) => {
    setSuppliers(prevSups => prevSups.map(s => {
      if (s.id === supplierId) {
        return { ...s, balance: Math.max(0, s.balance - amount) };
      }
      return s;
    }));
  };

  const handleAddCustomer = (newCust: Omit<Customer, 'id'>) => {
    setCustomers(prev => [...prev, { ...newCust, id: (prev.length + 1).toString() }]);
  };

  const handleAddPrescription = (newPres: Omit<Prescription, 'id'>) => {
    setPrescriptions(prev => [...prev, { ...newPres, id: `PR-${(prev.length + 8001).toString()}` }]);
  };

  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...newUser, id: (prev.length + 1).toString() }]);
  };

  const handleUpdateUserStatus = (id: string, status: 'Active' | 'Inactive') => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  // Render correct view tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            medicines={medicines}
            sales={sales}
            purchases={purchases}
            suppliers={suppliers}
            customers={customers}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'medicines':
        return (
          <MedicineView
            medicines={medicines}
            suppliers={suppliers}
            onAddMedicine={handleAddMedicine}
            onEditMedicine={handleEditMedicine}
            onDeleteMedicine={handleDeleteMedicine}
          />
        );
      case 'sales-pos':
        return (
          <SalesPOSView
            medicines={medicines}
            customers={customers}
            prescriptions={prescriptions}
            onAddSale={handleAddSale}
          />
        );
      case 'inventory':
        return (
          <InventoryView
            medicines={medicines}
            inventoryLogs={inventoryLogs}
            onAdjustStock={handleAdjustStock}
          />
        );
      case 'suppliers':
        return (
          <SuppliersView
            suppliers={suppliers}
            purchaseOrders={purchases}
            medicines={medicines}
            onAddSupplier={handleAddSupplier}
            onAddPurchaseOrder={handleAddPurchaseOrder}
            onPaySupplier={handlePaySupplier}
          />
        );
      case 'customers':
        return (
          <CustomersView
            customers={customers}
            sales={sales}
            onAddCustomer={handleAddCustomer}
          />
        );
      case 'prescriptions':
        return (
          <PrescriptionsView
            prescriptions={prescriptions}
            customers={customers}
            medicines={medicines}
            onAddPrescription={handleAddPrescription}
          />
        );
      case 'reports':
        return (
          <ReportsView
            sales={sales}
            medicines={medicines}
            purchases={purchases}
          />
        );
      case 'users':
        return (
          <UserManagementView
            users={users}
            onAddUser={handleAddUser}
            onUpdateUserStatus={handleUpdateUserStatus}
          />
        );
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onSaveSettings={setSettings}
          />
        );
      default:
        return <div>View not implemented.</div>;
    }
  };

  // Login Screen Render
  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '1rem'
      }}>
        <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Pill size={32} />
            </div>
            <h2 style={{ color: '#0f172a', fontWeight: 800 }}>PharmaCare Sign In</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.25rem' }}>
              Access the Pharmacy Operations Management System
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {loginError && (
              <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
                {loginError}
              </div>
            )}
            <div className="form-group">
              <label>Staff Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  required
                  type="email"
                  className="form-control"
                  placeholder="jane@pharmacy.com"
                  style={{ paddingLeft: '2.5rem' }}
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password PIN</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  required
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  style={{ paddingLeft: '2.5rem' }}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              Sign In
            </button>
          </form>

          {/* Quick login credentials list */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '0.5rem' }}>
              Demo Staff Accounts:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <div>• <strong>Admin:</strong> jane@pharmacy.com (Password: any)</div>
              <div>• <strong>Pharmacist:</strong> mark@pharmacy.com (Password: any)</div>
              <div>• <strong>Cashier:</strong> lucy@pharmacy.com (Password: any)</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active App Session Screen Render
  return (
    <div className="app-container">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderTabContent()}
      </main>
    </div>
  );
}
