import React, { useState } from 'react';
import { Customer, Sale } from '../data/mockData';
import { Plus, User, Phone, Mail, Award, Eye } from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  sales: Sale[];
  onAddCustomer: (cust: Omit<Customer, 'id'>) => void;
}

export default function CustomersView({
  customers,
  sales,
  onAddCustomer
}: CustomersViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [activeCustSales, setActiveCustSales] = useState<Sale[] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCustomer({
      name,
      phone,
      email,
      loyaltyPoints: 10 // Start with 10 signup bonus points!
    });
    setIsModalOpen(false);
  };

  const handleViewHistory = (customerId: string) => {
    const custSales = sales.filter(s => s.customerId === customerId);
    setActiveCustSales(custSales);
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>Customer Relationship Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage patient database profile registry and track loyalty point logs</p>
        </div>
        <button onClick={() => {
          setName('');
          setPhone('');
          setEmail('');
          setIsModalOpen(true);
        }} className="btn btn-primary">
          <Plus size={18} />
          Register Patient
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Phone Number</th>
              <th>Email Address</th>
              <th>Loyalty points</th>
              <th>Purchase History</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                      {cust.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <strong>{cust.name}</strong>
                  </div>
                </td>
                <td>{cust.phone}</td>
                <td>{cust.email}</td>
                <td>
                  <span className="badge badge-info" style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                    <Award size={12} /> {cust.loyaltyPoints} pts
                  </span>
                </td>
                <td>
                  <button onClick={() => handleViewHistory(cust.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    <Eye size={12} /> View Sales ({sales.filter(s => s.customerId === cust.id).length})
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Register New Patient Profile</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Patient Name</label>
                <input required type="text" className="form-control" placeholder="e.g. John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Contact Phone Number</label>
                <input required type="tel" className="form-control" placeholder="e.g. +1 (555) 019-2834" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email Address (Optional)</label>
                <input type="email" className="form-control" placeholder="e.g. john.doe@mail.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales History Modal */}
      {activeCustSales && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Patient Transaction History</h3>
              <button onClick={() => setActiveCustSales(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
              {activeCustSales.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                  No historical sales found for this customer profile.
                </p>
              ) : (
                activeCustSales.map(sale => (
                  <div key={sale.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>{sale.items.map(i => i.name).join(', ')}</strong>
                      <span>{new Date(sale.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {sale.items.map((item, idx) => (
                        <div key={idx}>{item.qty}x {item.name} (${item.price} each)</div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem', fontWeight: 700 }}>
                      <span>Grand Total:</span>
                      <span style={{ color: 'var(--accent-color)' }}>${sale.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setActiveCustSales(null)} className="btn btn-secondary">Close View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
