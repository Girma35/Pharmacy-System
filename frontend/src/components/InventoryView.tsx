import React, { useState } from 'react';
import { Medicine, InventoryLog } from '../data/mockData';
import { Plus, ArrowDownUp, ShieldAlert, History, Edit } from 'lucide-react';

interface InventoryViewProps {
  medicines: Medicine[];
  inventoryLogs: InventoryLog[];
  onAdjustStock: (medId: string, qty: number, type: 'Stock In' | 'Stock Out' | 'Adjustment', reason: string) => void;
}

export default function InventoryView({
  medicines,
  inventoryLogs,
  onAdjustStock
}: InventoryViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'status' | 'logs'>('status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustType, setAdjustType] = useState<'Stock In' | 'Stock Out' | 'Adjustment'>('Stock In');
  const [adjustReason, setAdjustReason] = useState('');

  const handleOpenAdjust = (medId?: string) => {
    setSelectedMedId(medId || medicines[0]?.id || '');
    setAdjustQty(0);
    setAdjustType('Stock In');
    setAdjustReason('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedId) return;
    // Stock Out or adjustment negative adjustment
    const netQty = adjustType === 'Stock Out' ? -Math.abs(adjustQty) : adjustQty;
    onAdjustStock(selectedMedId, netQty, adjustType, adjustReason);
    setIsModalOpen(false);
  };

  // Sort logs by date descending
  const sortedLogs = [...inventoryLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>Inventory Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track stock levels, record adjustments, and monitor historical logs</p>
        </div>
        <button onClick={() => handleOpenAdjust()} className="btn btn-primary">
          <Plus size={18} />
          Adjust Stock Levels
        </button>
      </div>

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveSubTab('status')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.5rem 1rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeSubTab === 'status' ? '2px solid var(--accent-color)' : '2px solid transparent',
            color: activeSubTab === 'status' ? 'var(--accent-color)' : 'var(--text-secondary)'
          }}
        >
          Stock Status & Thresholds
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.5rem 1rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeSubTab === 'logs' ? '2px solid var(--accent-color)' : '2px solid transparent',
            color: activeSubTab === 'logs' ? 'var(--accent-color)' : 'var(--text-secondary)'
          }}
        >
          Inventory Audit Logs
        </button>
      </div>

      {activeSubTab === 'status' ? (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Current Stock</th>
                <th>Min Threshold</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => {
                const isLow = med.stockQty <= med.lowStockThreshold;
                return (
                  <tr key={med.id}>
                    <td>
                      <strong>{med.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Batch: {med.batchNo}</div>
                    </td>
                    <td>{med.stockQty} units</td>
                    <td>{med.lowStockThreshold} units</td>
                    <td>
                      {isLow ? (
                        <span className="badge badge-danger" style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                          <ShieldAlert size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="badge badge-success">Good</span>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleOpenAdjust(med.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        <ArrowDownUp size={12} /> Quick Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Medicine</th>
                <th>Transaction Type</th>
                <th>Quantity Change</th>
                <th>Reason/Event</th>
                <th>Modified By</th>
              </tr>
            </thead>
            <tbody>
              {sortedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No audit logs available.
                  </td>
                </tr>
              ) : (
                sortedLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>{log.medicineName}</td>
                    <td>
                      <span className={`badge ${log.type === 'Stock In' ? 'badge-success' : log.type === 'Stock Out' ? 'badge-danger' : 'badge-info'}`}>
                        {log.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: log.qty > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {log.qty > 0 ? `+${log.qty}` : log.qty}
                    </td>
                    <td>{log.reason}</td>
                    <td>{log.userName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Inventory Adjustment</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Medicine Product</label>
                <select className="form-control" value={selectedMedId} onChange={e => setSelectedMedId(e.target.value)}>
                  {medicines.map(med => (
                    <option key={med.id} value={med.id}>{med.name} (Current: {med.stockQty} units)</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Adjustment Type</label>
                  <select className="form-control" value={adjustType} onChange={e => setAdjustType(e.target.value as any)}>
                    <option value="Stock In">Stock In (+)</option>
                    <option value="Stock Out">Stock Out (-)</option>
                    <option value="Adjustment">Custom Adjustment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity Change</label>
                  <input required type="number" min="1" className="form-control" value={adjustQty || ''} onChange={e => setAdjustQty(Number(e.target.value))} />
                </div>
              </div>

              <div className="form-group">
                <label>Detailed Reason / Description</label>
                <textarea required rows={3} className="form-control" placeholder="e.g. Expired batch removal, physical inventory count correction..." value={adjustReason} onChange={e => setAdjustReason(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Process Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
