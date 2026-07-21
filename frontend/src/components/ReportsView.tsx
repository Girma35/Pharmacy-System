import React, { useState } from 'react';
import { Sale, Medicine, PurchaseOrder } from '../data/mockData';
import { FileDown, Calendar, BarChart3, TrendingUp, ShieldAlert, Award } from 'lucide-react';

interface ReportsViewProps {
  sales: Sale[];
  medicines: Medicine[];
  purchases: PurchaseOrder[];
}

export default function ReportsView({
  sales,
  medicines,
  purchases
}: ReportsViewProps) {
  const [reportPeriod, setReportPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  // Sales totals
  const totalSalesCount = sales.length;
  const grossRevenue = sales.reduce((acc, curr) => acc + curr.total, 0);

  // Profit estimation
  const totalCost = sales.reduce((acc, sale) => {
    return acc + sale.items.reduce((itemCost, item) => {
      const medObj = medicines.find(m => m.id === item.medicineId);
      const purchasePrice = medObj ? medObj.purchasePrice : 0;
      return itemCost + (item.qty * purchasePrice);
    }, 0);
  }, 0);

  const netProfit = Math.max(0, grossRevenue - totalCost);
  const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0';

  // Best selling medicines
  const medicineSalesQty: { [name: string]: number } = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      medicineSalesQty[item.name] = (medicineSalesQty[item.name] || 0) + item.qty;
    });
  });

  const bestSellers = Object.entries(medicineSalesQty)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const maxBestSellerQty = bestSellers[0]?.qty || 1;

  // Inventory stats
  const totalMedicines = medicines.length;
  const totalStockQty = medicines.reduce((acc, m) => acc + m.stockQty, 0);
  const lowStockQty = medicines.filter(m => m.stockQty <= m.lowStockThreshold).length;

  const handleExport = () => {
    alert(`Exporting ${reportPeriod} Report. PDF file download simulated successfully!`);
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>Analytics & Financial Reports</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Review daily sales, margin profit, best sellers, and stock health audits</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select className="form-control" style={{ width: '140px' }} value={reportPeriod} onChange={e => setReportPeriod(e.target.value as any)}>
            <option value="Daily">Daily Report</option>
            <option value="Weekly">Weekly Report</option>
            <option value="Monthly">Monthly Report</option>
          </select>
          <button onClick={handleExport} className="btn btn-primary">
            <FileDown size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Gross Revenue</p>
            <h3>${grossRevenue.toFixed(2)}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Active Period Total</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--info)' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Est. Net Profit</p>
            <h3>${netProfit.toFixed(2)}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>{profitMargin}% net margin</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--danger)' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Low Stock Alert</p>
            <h3>{lowStockQty} items</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Below minimum trigger</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-hover)' }}>
            <Award size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Best Selling Item</p>
            <h3>{bestSellers[0]?.name || 'N/A'}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{bestSellers[0]?.qty || 0} units sold</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Best Sellers Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem' }}>Top 5 Best-Selling Medicines</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {bestSellers.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No sales data logged yet.</p>
            ) : (
              bestSellers.map((med, idx) => {
                const widthPercent = `${(med.qty / maxBestSellerQty) * 100}%`;
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      <span>{med.name}</span>
                      <span>{med.qty} units</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: widthPercent, height: '100%', backgroundColor: 'var(--accent-color)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Audit Period Summary */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem' }}>Active Period Audit Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Sales Transactions:</span>
              <strong>{totalSalesCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Registered Drugs cataloged:</span>
              <strong>{totalMedicines}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Inventory Units in Stock:</span>
              <strong>{totalStockQty}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Procurement Purchases:</span>
              <strong>{purchases.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
