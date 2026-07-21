import React, { useState } from 'react';
import { Prescription, Customer, Medicine } from '../data/mockData';
import { Plus, Eye, FileText, User, UserPlus } from 'lucide-react';

interface PrescriptionsViewProps {
  prescriptions: Prescription[];
  customers: Customer[];
  medicines: Medicine[];
  onAddPrescription: (pres: Omit<Prescription, 'id'>) => void;
}

export default function PrescriptionsView({
  prescriptions,
  customers,
  medicines,
  onAddPrescription
}: PrescriptionsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [viewPrescription, setViewPrescription] = useState<Prescription | null>(null);

  const handleOpenAdd = () => {
    setCustomerId(customers[0]?.id || '');
    setDoctorName('');
    setNotes('');
    setSelectedMeds([]);
    setIsModalOpen(true);
  };

  const handleToggleMed = (medName: string) => {
    if (selectedMeds.includes(medName)) {
      setSelectedMeds(selectedMeds.filter(m => m !== medName));
    } else {
      setSelectedMeds([...selectedMeds, medName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;
    onAddPrescription({
      customerId,
      customerName: cust.name,
      doctorName,
      notes,
      prescriptionDate: new Date().toISOString().split('T')[0],
      medicines: selectedMeds
    });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>Prescription Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Verify physician prescriptions and track linked medicine dispensing logs</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          Record Prescription
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Prescription ID</th>
              <th>Patient / Customer</th>
              <th>Prescribing Physician</th>
              <th>Authorized Medicines</th>
              <th>Record Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((pres) => (
              <tr key={pres.id}>
                <td><code>{pres.id}</code></td>
                <td><strong>{pres.customerName}</strong></td>
                <td>Dr. {pres.doctorName}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {pres.medicines.map((m, idx) => (
                      <span key={idx} className="badge badge-info" style={{ textTransform: 'none' }}>{m}</span>
                    ))}
                  </div>
                </td>
                <td>{pres.prescriptionDate}</td>
                <td>
                  <button onClick={() => setViewPrescription(pres)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    <Eye size={12} /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Prescription Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Dispense Prescription Authorization</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Registered Patient</label>
                <select className="form-control" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                  {customers.map(cust => (
                    <option key={cust.id} value={cust.id}>{cust.name} ({cust.phone})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Prescribing Doctor Name</label>
                <input required type="text" className="form-control" placeholder="Dr. Jane Watson" value={doctorName} onChange={e => setDoctorName(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Authorized Drugs / Medicines</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  {medicines.map(med => (
                    <label key={med.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedMeds.includes(med.name)}
                        onChange={() => handleToggleMed(med.name)}
                      />
                      {med.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Doctor's Notes & Instructions</label>
                <textarea required rows={3} className="form-control" placeholder="Dosage, frequency, duration instructions..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">File Authorization</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      {viewPrescription && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Medical Prescription Authorized</h3>
              <button onClick={() => setViewPrescription(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>AUTHORIZATION ID</span>
                  <strong>{viewPrescription.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>PATIENT</span>
                  <strong>{viewPrescription.customerName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>PHYSICIAN</span>
                  <strong>Dr. {viewPrescription.doctorName}</strong>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Authorized Medicines</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {viewPrescription.medicines.map((med, idx) => (
                    <span key={idx} className="badge badge-info">{med}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Dispense Notes / Instructions</h4>
                <p style={{ fontSize: '0.95rem', background: '#fffbeb', borderLeft: '4px solid var(--warning)', padding: '0.75rem', borderRadius: '4px', fontStyle: 'italic' }}>
                  {viewPrescription.notes}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={() => setViewPrescription(null)} className="btn btn-secondary">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
