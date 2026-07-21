import React from 'react';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingCart, 
  Boxes, 
  Truck, 
  Users, 
  FileText, 
  BarChart3, 
  UserCog, 
  Settings as SettingsIcon, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: { name: string; role: string };
  onLogout: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, currentUser, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Pharmacist', 'Cashier'] },
    { id: 'medicines', label: 'Medicines', icon: Pill, roles: ['Admin', 'Pharmacist'] },
    { id: 'sales-pos', label: 'POS / Sales', icon: ShoppingCart, roles: ['Admin', 'Pharmacist', 'Cashier'] },
    { id: 'inventory', label: 'Inventory', icon: Boxes, roles: ['Admin', 'Pharmacist'] },
    { id: 'suppliers', label: 'Suppliers', icon: Truck, roles: ['Admin', 'Pharmacist'] },
    { id: 'customers', label: 'Customers', icon: Users, roles: ['Admin', 'Pharmacist', 'Cashier'] },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText, roles: ['Admin', 'Pharmacist'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['Admin'] },
    { id: 'users', label: 'Users', icon: UserCog, roles: ['Admin'] },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, roles: ['Admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <Pill className="logo-icon" size={28} />
        <span>PharmaCare</span>
      </div>

      <ul className="nav-links">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <a
                onClick={() => setCurrentTab(item.id)}
                className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{currentUser.name}</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{currentUser.role}</span>
        </div>
        <button onClick={onLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', backgroundColor: '#1e293b', color: '#ef4444', border: 'none' }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
