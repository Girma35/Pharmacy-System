import React, { useState } from 'react';
import { User } from '../data/mockData';
import { Plus, Trash2, Key, Edit, ShieldAlert } from 'lucide-react';

interface UserManagementViewProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUserStatus: (id: string, status: 'Active' | 'Inactive') => void;
}

export default function UserManagementView({
  users,
  onAddUser,
  onUpdateUserStatus
}: UserManagementViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Pharmacist' | 'Cashier'>('Cashier');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({
      name,
      email,
      role,
      status: 'Active'
    });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>User Accounts & Permissions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Configure pharmacy employee accounts and role access permissions</p>
        </div>
        <button onClick={() => {
          setName('');
          setEmail('');
          setRole('Cashier');
          setIsModalOpen(true);
        }} className="btn btn-primary">
          <Plus size={18} />
          Create Account
        </button>
      </div>

      {/* Permissions Guide Info Card */}
      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem', background: '#f8fafc', borderLeft: '4px solid var(--accent-color)' }}>
        <ShieldAlert size={28} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
        <div>
          <strong>Role Permission Hierarchy:</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>
            • <strong>Admin</strong> has complete write clearance across all core billing modules, financial statistics, audits and general settings.
            <br />• <strong>Pharmacist</strong> has edit capability for medicines, inventory logs, suppliers, prescriptions and sales POS.
            <br />• <strong>Cashier</strong> is restricted solely to the Sales POS and basic Customer profile logs.
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>System Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((usr) => (
              <tr key={usr.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.85rem', backgroundColor: usr.role === 'Admin' ? 'var(--primary-color)' : usr.role === 'Pharmacist' ? 'var(--accent-color)' : '#64748b' }}>
                      {usr.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <strong>{usr.name}</strong>
                  </div>
                </td>
                <td>{usr.email}</td>
                <td>
                  <span className={`badge ${usr.role === 'Admin' ? 'badge-danger' : usr.role === 'Pharmacist' ? 'badge-info' : 'badge-success'}`}>
                    {usr.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${usr.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                    {usr.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => onUpdateUserStatus(usr.id, usr.status === 'Active' ? 'Inactive' : 'Active')}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                    >
                      {usr.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => alert('Simulating password reset. Email notification dispatched!')} className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                      <Key size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Create Staff Account</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Staff Full Name</label>
                <input required type="text" className="form-control" placeholder="e.g. Samuel Green" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input required type="email" className="form-control" placeholder="e.g. samuel@pharmacy.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>System Access Role</label>
                <select className="form-control" value={role} onChange={e => setRole(e.target.value as any)}>
                  <option value="Cashier">Cashier (Restricted to POS)</option>
                  <option value="Pharmacist">Pharmacist (Medicines/Inventory/POS)</option>
                  <option value="Admin">System Administrator (Full access)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
