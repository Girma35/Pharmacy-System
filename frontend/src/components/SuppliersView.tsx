import React, { useState } from 'react';
import { Supplier, PurchaseOrder, Medicine } from '../data/mockData';
import { Plus, User, Mail, MapPin, DollarSign, HelpCircle } from 'lucide-react';

interface SuppliersViewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  medicines: Medicine[];
  onAddSupplier: (sup: Omit<Supplier, 'id'>) => void;
  onAddPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  onPaySupplier: (supplierId: string, amount: number) => void;
}

export default function SuppliersView({
  suppliers,
  purchaseOrders,
  medicines,
  onAddSupplier,
  onAddPurchaseOrder,
  onPaySupplier
}: SuppliersViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'purchases'>('list');
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Supplier Form
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supAddress, setSupAddress] = useState('');

  // PO Form
  const [poSupplierId, setPoSupplierId] = useState('');
  const [poMedicineId, setPoMedicineId] = useState('');
  const [poQty, setPoQty] = useState(10);
  const [poPrice, setPoPrice] = useState(1.0);

  // Payment Form
  const [paySupplierId, setPaySupplierId] = useState('');
  const [payAmount, setPayAmount] = useState(0);

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSupplier({
      name: supName,
      contact: supContact,
      email: supEmail,
      address: supAddress,
      balance: 0
    });
    setIsSupplierModalOpen(false);
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medicines.find(m => m.id === poMedicineId);
    if (!med) return;
    onAddPurchaseOrder({
      supplierId: poSupplierId,
      supplierName: suppliers.find(s => s.id === poSupplierId)?.name || 'Unknown Supplier',
      items: [{
        medicineId: poMedicineId,
        name: med.name,
        qty: poQty,
        unitPrice: poPrice
      }],
      total: poQty * poPrice,
      status: 'Pending',
      createdAt: new Date().toISOString()
    });
    setIsPOModalOpen(false);
  };

  const handlePaySupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaySupplier(paySupplierId, payAmount);
    setIsPaymentModalOpen(false);
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>Supplier & Procurement Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage wholesale drug suppliers and track restock purchase orders</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => {
            setPaySupplierId(suppliers[0]?.id || '');
            setPayAmount(0);
            setIsPaymentModalOpen(true);
          }} className="btn btn-secondary" style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)', borderStyle: 'solid', borderWidth: '1px' }}>
            Pay Supplier Balance
          </button>
          <button onClick={() => {
            setSupName('');
            setSupContact('');
            setSupEmail('');
            setSupAddress('');
            setIsSupplierModalOpen(true);
          }} className="btn btn-primary">
            <Plus size={18} />
            Add Supplier
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveSubTab('list')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.5rem 1rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeSubTab === 'list' ? '2px solid var(--accent-color)' : '2px solid transparent',
            color: activeSubTab === 'list' ? 'var(--accent-color)' : 'var(--text-secondary)'
          }}
        >
          Suppliers Directory
        </button>
        <button
          onClick={() => {
            setActiveSubTab('purchases');
            if (suppliers.length > 0) setPoSupplierId(suppliers[0].id);
            if (medicines.length > 0) setPoMedicineId(medicines[0].id);
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.5rem 1rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeSubTab === 'purchases' ? '2px solid var(--accent-color)' : '2px solid transparent',
            color: activeSubTab === 'purchases' ? 'var(--accent-color)' : 'var(--text-secondary)'
          }}
        >
          Purchase Orders & Restocking
        </button>
      </div>

      {activeSubTab === 'list' ? (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Primary Contact</th>
                <th>Email</th>
                <th>Address</th>
                <th>Outstanding Balance</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((sup) => (
                <tr key={sup.id}>
                  <td><strong>{sup.name}</strong></td>
                  <td>{sup.contact}</td>
                  <td>{sup.email}</td>
                  <td>{sup.address}</td>
                  <td style={{ fontWeight: 700, color: sup.balance > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    ${sup.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setIsPOModalOpen(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Create Purchase Order
            </button>
          </div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Supplier</th>
                  <th>Order Items</th>
                  <th>Grand Total</th>
                  <th>Status</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr key={po.id}>
                    <td><code>{po.id}</code></td>
                    <td>{po.supplierName}</td>
                    <td>
                      {po.items.map((item, idx) => (
                        <div key={idx}>{item.qty}x {item.name} (${item.unitPrice} each)</div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 700 }}>${po.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${po.status === 'Delivered' ? 'badge-success' : po.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {po.status}
                      </span>
                    </td>
                    <td>{new Date(po.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isSupplierModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Register New Supplier</h3>
              <button onClick={() => setIsSupplierModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleAddSupplier}>
              <div className="form-group">
                <label>Company / Supplier Name</label>
                <input required type="text" className="form-control" value={supName} onChange={e => setSupName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Contact Person Name</label>
                <input required type="text" className="form-control" value={supContact} onChange={e => setSupContact(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input required type="email" className="form-control" value={supEmail} onChange={e => setSupEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Billing / Delivery Address</label>
                <input required type="text" className="form-control" value={supAddress} onChange={e => setSupAddress(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsSupplierModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {isPOModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Purchase Order</h3>
              <button onClick={() => setIsPOModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleCreatePO}>
              <div className="form-group">
                <label>Select Supplier Partner</label>
                <select className="form-control" value={poSupplierId} onChange={e => setPoSupplierId(e.target.value)}>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Select Medicine to Restock</label>
                  <select className="form-control" value={poMedicineId} onChange={e => setPoMedicineId(e.target.value)}>
                    {medicines.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Order Qty (units)</label>
                  <input required type="number" min="1" className="form-control" value={poQty} onChange={e => setPoQty(Number(e.target.value))} />
                </div>
              </div>

              <div className="form-group">
                <label>Unit Purchase Price Offer ($)</label>
                <input required type="number" step="0.01" className="form-control" value={poPrice} onChange={e => setPoPrice(Number(e.target.value))} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsPOModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create & Send PO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Supplier Modal */}
      {isPaymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Pay Supplier Balance</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handlePaySupplierSubmit}>
              <div className="form-group">
                <label>Select Supplier</label>
                <select className="form-control" value={paySupplierId} onChange={e => setPaySupplierId(e.target.value)}>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Bal: ${s.balance.toFixed(2)})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Amount to Pay ($)</label>
                <input required type="number" step="0.01" min="0.01" className="form-control" value={payAmount || ''} onChange={e => setPayAmount(Number(e.target.value))} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Pay Balance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
