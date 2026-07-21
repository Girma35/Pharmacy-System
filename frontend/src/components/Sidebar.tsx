import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: { name: string; role: string };
  onLogout: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, currentUser, onLogout }: SidebarProps) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, roles: ['Admin', 'Cashier'] },
    { id: 'medicines', labelKey: 'nav.medicines', icon: Pill, roles: ['Admin'] },
    { id: 'sales-pos', labelKey: 'nav.sales', icon: ShoppingCart, roles: ['Admin', 'Pharmacist', 'Cashier'] },
    { id: 'inventory', labelKey: 'nav.inventory', icon: Boxes, roles: ['Admin'] },
    { id: 'suppliers', labelKey: 'nav.suppliers', icon: Truck, roles: ['Admin'] },
    { id: 'customers', labelKey: 'nav.customers', icon: Users, roles: ['Admin', 'Pharmacist', 'Cashier'] },
    { id: 'prescriptions', labelKey: 'nav.prescriptions', icon: FileText, roles: ['Admin'] },
    { id: 'reports', labelKey: 'nav.reports', icon: BarChart3, roles: ['Admin', 'Pharmacist', 'Cashier'] },
    { id: 'users', labelKey: 'nav.users', icon: UserCog, roles: ['Admin'] },
    { id: 'settings', labelKey: 'nav.settings', icon: SettingsIcon, roles: ['Admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileOpen(false); // auto-close on mobile
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="logo-section">
          <Pill className="logo-icon" size={28} />
          <span>{t('app.title')}</span>
        </div>

        <ul className="nav-links">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <a
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{t(item.labelKey)}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{currentUser.name}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t('auth.' + currentUser.role.toLowerCase())}</span>
          </div>
          <button onClick={onLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', backgroundColor: '#1e293b', color: '#ef4444', border: 'none' }}>
            <LogOut size={16} />
            <span>{t('auth.signOut')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
