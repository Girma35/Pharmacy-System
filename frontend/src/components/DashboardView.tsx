import React from 'react';
import { Medicine, Sale, PurchaseOrder, Supplier, Customer } from '../data/mockData';
import { DollarSign, AlertCircle, CalendarRange, ArrowUpDown, TrendingUp } from 'lucide-react';

interface DashboardViewProps {
  medicines: Medicine[];
  sales: Sale[];
  purchases: PurchaseOrder[];
  suppliers: Supplier[];
  customers: Customer[];
  setCurrentTab: (tab: string) => void;
}

export default function DashboardView({
  medicines,
  sales,
  purchases,
  suppliers,
  customers,
  setCurrentTab
}: DashboardViewProps) {
  // Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.createdAt.startsWith(todayStr));
  const todayRevenue = todaySales.reduce((acc, curr) => acc + curr.total, 0);

  const lowStockMedicines = medicines.filter(m => m.stockQty <= m.lowStockThreshold);

  // Expiring medicines (in next 90 days or already expired)
  const todayVal = new Date();
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(todayVal.getDate() + 90);

  const expiringMedicines = medicines.filter(m => {
    const expiry = new Date(m.expiryDate);
    return expiry <= ninetyDaysFromNow;
  });

  const totalCustomers = customers.length;
  const recentSales = [...sales].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  // Revenue chart calculations (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(todayVal.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const chartData = last7Days.map(dateStr => {
    const dailySales = sales.filter(s => s.createdAt.startsWith(dateStr));
    const revenue = dailySales.reduce((acc, curr) => acc + curr.total, 0);
    const dayLabel = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
    return { dayLabel, revenue };
  });

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 100);

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>Operational Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time overview of pharmacy activities</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-success">System Online</span>
        </div>
      </div>

      {/* Low Stock Banner Alert */}
      {lowStockMedicines.length > 0 && (
        <div className="alert-banner alert-banner-danger">
          <AlertCircle size={20} />
          <div>
            <strong>Low Stock Alert!</strong> {lowStockMedicines.length} medicines are running low on inventory. 
            <span style={{ textDecoration: 'underline', marginLeft: '0.5rem', cursor: 'pointer' }} onClick={() => setCurrentTab('inventory')}>
              Review Inventory
            </span>
          </div>
        </div>
      )}

      {/* Expiring Banner Alert */}
      {expiringMedicines.length > 0 && (
        <div className="alert-banner alert-banner-warning">
          <CalendarRange size={20} />
          <div>
            <strong>Expiring Soon!</strong> {expiringMedicines.length} medicines are expired or expiring in the next 90 days. 
            <span style={{ textDecoration: 'underline', marginLeft: '0.5rem', cursor: 'pointer' }} onClick={() => setCurrentTab('medicines')}>
              Manage Batches
            </span>
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid-4">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Today's Revenue</p>
            <h3>${todayRevenue.toFixed(2)}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>{todaySales.length} Transactions</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--danger)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Low Stock Alert</p>
            <h3>{lowStockMedicines.length} Items</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Requires reorder</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning)' }}>
            <CalendarRange size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Expiring Medicines</p>
            <h3>{expiringMedicines.length} Items</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Within 90 days</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--info)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Customers</p>
            <h3>{totalCustomers} Users</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Loyalty enrolled</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '2.5rem' }}>
        {/* Daily Revenue Summary Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Daily Revenue Summary (Last 7 Days)</h3>
          <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            {chartData.map((data, idx) => {
              const heightPercentage = `${Math.max((data.revenue / maxRevenue) * 100, 8)}%`;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, maxWidth: '60px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    ${data.revenue.toFixed(0)}
                  </span>
                  <div
                    style={{
                      width: '32px',
                      height: heightPercentage,
                      background: 'linear-gradient(180deg, var(--accent-color) 0%, var(--accent-hover) 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {data.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Recent Transactions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
            {recentSales.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', margin: 'auto' }}>
                No recent transactions
              </p>
            ) : (
              recentSales.map((sale) => (
                <div key={sale.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>{sale.items.map(i => i.name).join(', ')}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {sale.paymentMethod}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    +${sale.total.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
