import React, { useState, useMemo } from 'react';
import { Sale } from '../data/mockData';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

interface ReportsViewProps {
  sales: Sale[];
}

type Period = 'Daily' | 'Weekly' | 'Monthly';

export default function ReportsView({ sales }: ReportsViewProps) {
  const [period, setPeriod] = useState<Period>('Daily');

  const now = new Date();

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      const diffMs = now.getTime() - saleDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      switch (period) {
        case 'Daily': return diffDays < 1;
        case 'Weekly': return diffDays < 7;
        case 'Monthly': return diffDays < 30;
        default: return true;
      }
    });
  }, [sales, period]);

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const totalTransactions = filteredSales.length;

  const periodButtons: { value: Period; label: string }[] = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
  ];

  return (
    <div>
      <div className="top-header">
        <div>
          <h2 style={{ fontSize: '1.5rem' }}>Sales Report</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {totalTransactions} sale{totalTransactions !== 1 ? 's' : ''} this period
          </p>
        </div>
      </div>

      {/* Big filter buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        {periodButtons.map(btn => (
          <button
            key={btn.value}
            onClick={() => setPeriod(btn.value)}
            style={{
              flex: 1,
              padding: '1rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              backgroundColor: period === btn.value ? 'var(--accent-color)' : '#e2e8f0',
              color: period === btn.value ? '#fff' : 'var(--text-primary)',
              transition: 'all 0.2s',
              boxShadow: period === btn.value ? '0 4px 12px rgba(13,148,136,0.3)' : 'none'
            }}
            onMouseEnter={e => { if (period !== btn.value) e.currentTarget.style.backgroundColor = '#cbd5e1'; }}
            onMouseLeave={e => { if (period !== btn.value) e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Big stat cards */}
      <div className="grid-4">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success)', width: '60px', height: '60px' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Revenue</p>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--success)' }}>${totalRevenue.toFixed(2)}</h2>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--info)', width: '60px', height: '60px' }}>
            <ShoppingCart size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Transactions</p>
            <h2 style={{ fontSize: '1.8rem' }}>{totalTransactions}</h2>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-color)', width: '60px', height: '60px' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Avg per Sale</p>
            <h2 style={{ fontSize: '1.8rem' }}>
              ${totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : '0.00'}
            </h2>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning)', width: '60px', height: '60px' }}>
            <BarChart3 size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Sales</p>
            <h2 style={{ fontSize: '1.8rem' }}>{filteredSales.reduce((sum, s) => sum + s.items.length, 0)} items</h2>
          </div>
        </div>
      </div>

      {/* Recent sales list */}
      {filteredSales.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            {period} Transactions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredSales.slice(0, 20).map(sale => (
              <div
                key={sale.id}
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid var(--accent-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                {/* Top row: date + total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    🕐 {new Date(sale.createdAt).toLocaleDateString('en-GB')} {new Date(sale.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1rem' }}>
                    +{sale.total.toLocaleString()} ETB
                  </span>
                </div>

                {/* Customer & cashier */}
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>👤 {sale.customerName || 'Walk-in'}</span>
                  <span>💊 {sale.userName || 'Pharmacist'}</span>
                  <span style={{ marginLeft: 'auto' }}>💳 {sale.paymentMethod || 'Cash'}</span>
                </div>

                {/* Medicine items */}
                {sale.items && sale.items.length > 0 ? (
                  <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {sale.items.map((item: any, idx: number) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem',
                        padding: '0.2rem 0.5rem',
                        backgroundColor: '#fff',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <span style={{ fontWeight: 500 }}>
                          {item.name}
                        </span>
                        <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                          x{item.qty} × {Number(item.price).toLocaleString()} ETB
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    No item details available
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredSales.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            No sales in this period
          </p>
        </div>
      )}
    </div>
  );
}
