import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar';
import LanguageSelectionScreen from './components/LanguageSelectionScreen';
import LanguageSwitcher from './components/LanguageSwitcher';
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
  defaultSettings
} from './data/mockData';
import { Pill, Lock, Mail } from 'lucide-react';

export default function App() {
  const { t } = useTranslation();

  // Language selection state (shown before login)
  const [languageSelected, setLanguageSelected] = useState(() => !!localStorage.getItem('pharmacy-language'));

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // App Tabs State
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Database States
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Need an endpoint for users if managing them, else empty for now
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  // Show Language Selection first
  if (!languageSelected) {
    return <LanguageSelectionScreen onLanguageSelected={() => setLanguageSelected(true)} />;
  }

  // Auth Submit Action (Now calls Backend)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }

      const { user, token } = await res.json();
      localStorage.setItem('auth_token', token);
      setCurrentUser(user);
      setLoginError('');
      if (user.role === 'Cashier' || user.role === 'Pharmacist') {
        setCurrentTab('sales-pos');
      } else {
        setCurrentTab('dashboard');
      }
      
      // Load initial data upon login
      fetchData();
    } catch (err: any) {
      setLoginError(err.message || t('auth.error'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('auth_token');
    setLoginEmail('');
    setLoginPassword('');
    // Clear state
    setMedicines([]);
    setSuppliers([]);
    setCustomers([]);
    setSales([]);
    setPrescriptions([]);
  };

  // Fetch all necessary data from the backend
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [medsRes, suppsRes, custsRes, salesRes, prescRes] = await Promise.all([
        fetch('/api/medicines').then(r => r.json()),
        fetch('/api/suppliers').then(r => r.json()),
        fetch('/api/customers').then(r => r.json()),
        fetch('/api/sales').then(r => r.json()),
        fetch('/api/prescriptions').then(r => r.json())
      ]);

      setMedicines(medsRes);
      setSuppliers(suppsRes);
      setCustomers(custsRes);
      setSales(salesRes);
      setPrescriptions(prescRes);
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('Failed to load system data from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD & Actions connecting to backend
  const handleAddMedicine = async (newMed: Omit<Medicine, 'id'>) => {
    try {
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMed)
      });
      if (!res.ok) throw new Error('Failed to add medicine');
      const addedMed = await res.json();
      setMedicines([addedMed, ...medicines]);
    } catch (err) {
      console.error(err);
      alert('Error adding medicine');
    }
  };

  const handleEditMedicine = async (updatedMed: Medicine) => {
    try {
      const res = await fetch(`/api/medicines/${updatedMed.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMed)
      });
      if (!res.ok) throw new Error('Failed to update medicine');
      const newMed = await res.json();
      setMedicines(medicines.map(m => m.id === newMed.id ? newMed : m));
    } catch (err) {
      console.error(err);
      alert('Error updating medicine');
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    try {
      const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete medicine');
      setMedicines(medicines.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting medicine');
    }
  };

  const handleAddSale = async (newSale: any) => {
    try {
      const payload = {
        ...newSale,
        userId: currentUser?.id
      };
      
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Checkout failed');
      
      // Refresh medicines to get updated stock and refresh sales
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error processing sale checkout');
    }
  };

  const handleAddPurchase = (newPo: PurchaseOrder) => {
    setPurchases([...purchases, newPo]);
    // NOTE: Purchases backend not fully implemented yet, only updating local state temporarily
  };

  // Render Login Screen if not authenticated
  if (!currentUser) {
    return (
      <div className="login-container">
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <LanguageSwitcher />
        </div>
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <Pill size={32} color="white" />
            </div>
            <h1>{t('auth.title')}</h1>
            <p>{t('auth.subtitle')}</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            {loginError && (
              <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '0.9rem', textAlign: 'center' }}>
                {loginError}
              </div>
            )}
            
            <div className="form-group">
              <label><Mail size={16} /> {t('auth.email')}</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="Enter email (e.g. jane@pharmacy.com)"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label><Lock size={16} /> {t('auth.password')}</label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="Enter password (e.g. admin123)"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" disabled={authLoading}>
              {authLoading ? 'Signing in...' : t('auth.loginBtn')}
            </button>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <p>For demo purposes, use:</p>
              <p><strong>jane@pharmacy.com</strong></p>
              <p>Password: <strong>admin123</strong></p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        userRole={currentUser.role}
        onLogout={handleLogout}
      />
      <div className="main-content">
        {isLoading ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Loading system data...</div>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && <DashboardView medicines={medicines} sales={sales} />}
            {currentTab === 'sales-pos' && (
              <SalesPOSView 
                medicines={medicines} 
                customers={customers} 
                prescriptions={prescriptions}
                onAddSale={handleAddSale}
                onViewReport={() => setCurrentTab('reports')}
              />
            )}
            {currentTab === 'medicines' && (
              <MedicineView 
                medicines={medicines} 
                suppliers={suppliers}
                onAddMedicine={handleAddMedicine}
                onEditMedicine={handleEditMedicine}
                onDeleteMedicine={handleDeleteMedicine}
              />
            )}
            {currentTab === 'inventory' && (
              <InventoryView 
                medicines={medicines} 
                logs={inventoryLogs}
                purchases={purchases}
                onAddPurchase={handleAddPurchase}
              />
            )}
            {currentTab === 'suppliers' && <SuppliersView suppliers={suppliers} />}
            {currentTab === 'customers' && <CustomersView customers={customers} />}
            {currentTab === 'prescriptions' && <PrescriptionsView prescriptions={prescriptions} />}
            {currentTab === 'reports' && <ReportsView sales={sales} />}
            {currentTab === 'users' && <UserManagementView users={users} />}
            {currentTab === 'settings' && <SettingsView settings={settings} onUpdateSettings={setSettings} />}
          </>
        )}
      </div>
    </div>
  );
}
