import React, { useState } from 'react';
import { Medicine, Supplier } from '../data/mockData';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

interface MedicineViewProps {
  medicines: Medicine[];
  suppliers: Supplier[];
  onAddMedicine: (med: Omit<Medicine, 'id'>) => void;
  onEditMedicine: (med: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
}

export default function MedicineView({
  medicines,
  suppliers,
  onAddMedicine,
  onEditMedicine,
  onDeleteMedicine
}: MedicineViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [barcode, setBarcode] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [stockQty, setStockQty] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [supplierId, setSupplierId] = useState('');

  const categories = ['All', ...Array.from(new Set(medicines.map(m => m.category)))];

  const handleOpenAdd = () => {
    setEditingMed(null);
    setName('');
    setCategory('');
    setBarcode('');
    setBatchNo('');
    setExpiryDate('');
    setPurchasePrice(0);
    setSellingPrice(0);
    setStockQty(0);
    setLowStockThreshold(10);
    setSupplierId(suppliers[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (med: Medicine) => {
    setEditingMed(med);
    setName(med.name);
    setCategory(med.category);
    setBarcode(med.barcode);
    setBatchNo(med.batchNo);
    setExpiryDate(med.expiryDate);
    setPurchasePrice(med.purchasePrice);
    setSellingPrice(med.sellingPrice);
    setStockQty(med.stockQty);
    setLowStockThreshold(med.lowStockThreshold);
    setSupplierId(med.supplierId);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      category,
      barcode,
      batchNo,
      expiryDate,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stockQty: Number(stockQty),
      lowStockThreshold: Number(lowStockThreshold),
      supplierId
    };

    if (editingMed) {
      onEditMedicine({ ...data, id: editingMed.id });
    } else {
      onAddMedicine(data);
    }
    setIsModalOpen(false);
  };

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.barcode.includes(searchTerm) || 
                          m.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getExpiryStatus = (dateStr: string) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: 'Expired', class: 'badge-danger' };
    if (diffDays <= 90) return { label: `${diffDays} days left`, class: 'badge-warning' };
    return { label: 'Valid', class: 'badge-success' };
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>Medicine Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Catalog your pharmaceutical products and properties</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      {/* Filter and search bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, barcode, batch number..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
          <select
            className="form-control"
            style={{ width: '180px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Medicine Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Category</th>
              <th>Batch No</th>
              <th>Expiry Status</th>
              <th>Purchase / Sell</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No medicines found matching criteria.
                </td>
              </tr>
            ) : (
              filteredMedicines.map((med) => {
                const status = getExpiryStatus(med.expiryDate);
                const profitMargin = ((med.sellingPrice - med.purchasePrice) / med.sellingPrice * 100).toFixed(0);
                return (
                  <tr key={med.id}>
                    <td>
                      <div>
                        <strong>{med.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>UPC: {med.barcode}</div>
                      </div>
                    </td>
                    <td>{med.category}</td>
                    <td><code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{med.batchNo}</code></td>
                    <td>
                      <span className={`badge ${status.class}`}>{status.label}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{med.expiryDate}</div>
                    </td>
                    <td>
                      <div>
                        <span>${med.purchasePrice.toFixed(2)} / ${med.sellingPrice.toFixed(2)}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>{profitMargin}% margin</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${med.stockQty <= med.lowStockThreshold ? 'badge-danger' : 'badge-success'}`}>
                        {med.stockQty} units
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEdit(med)} className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDeleteMedicine(med.id)} className="btn btn-danger" style={{ padding: '0.4rem', backgroundColor: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingMed ? 'Edit Medicine' : 'Add New Medicine'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Medicine Name</label>
                <input required type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input required type="text" className="form-control" placeholder="e.g. Analgesics" value={category} onChange={e => setCategory(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Barcode / UPC</label>
                  <input required type="text" className="form-control" value={barcode} onChange={e => setBarcode(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Batch Number</label>
                  <input required type="text" className="form-control" value={batchNo} onChange={e => setBatchNo(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input required type="date" className="form-control" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Purchase Price ($)</label>
                  <input required type="number" step="0.01" className="form-control" value={purchasePrice} onChange={e => setPurchasePrice(Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label>Selling Price ($)</label>
                  <input required type="number" step="0.01" className="form-control" value={sellingPrice} onChange={e => setSellingPrice(Number(e.target.value))} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input required type="number" className="form-control" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label>Low-stock Alert Level</label>
                  <input required type="number" className="form-control" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))} />
                </div>
              </div>

              <div className="form-group">
                <label>Supplier Partner</label>
                <select className="form-control" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                  {suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingMed ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
