import React, { useState, useMemo } from 'react';
import { Medicine, Supplier } from '../data/mockData';
import { Plus, Edit2, Trash2, Search, Filter, Thermometer, Lock, BookOpen, FlaskConical } from 'lucide-react';
import catalogData from '../data/ethiopia_pharmacy_medicines_300.json';

interface MedicineViewProps {
  medicines: Medicine[];
  suppliers: Supplier[];
  onAddMedicine: (med: Omit<Medicine, 'id'>) => void;
  onEditMedicine: (med: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
}

const STORAGE_LABELS: Record<string, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  room_temperature:    { label: 'Room Temp',    badgeClass: 'badge-success', icon: <Thermometer size={11} /> },
  refrigerated_2_to_8C: { label: 'Refrigerated', badgeClass: 'badge-info',    icon: <FlaskConical size={11} /> },
  locked_cabinet:      { label: 'Locked Cabinet', badgeClass: 'badge-warning', icon: <Lock size={11} /> },
};

export default function MedicineView({
  medicines,
  suppliers,
  onAddMedicine,
  onEditMedicine,
  onDeleteMedicine,
}: MedicineViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [storageFilter, setStorageFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [showCatalogPicker, setShowCatalogPicker] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [formAndStrength, setFormAndStrength] = useState('');
  const [category, setCategory] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('strip');
  const [barcode, setBarcode] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [stockQty, setStockQty] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(20);
  const [supplierId, setSupplierId] = useState('');
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [storageCondition, setStorageCondition] = useState<Medicine['storageCondition']>('room_temperature');

  const categories = useMemo(() => ['All', ...Array.from(new Set(medicines.map(m => m.category))).sort()], [medicines]);

  const resetForm = () => {
    setName(''); setFormAndStrength(''); setCategory(''); setUnitOfMeasure('strip');
    setBarcode(''); setBatchNo(''); setExpiryDate('');
    setPurchasePrice(0); setSellingPrice(0); setStockQty(0); setLowStockThreshold(20);
    setSupplierId(suppliers[0]?.id || '');
    setRequiresPrescription(false);
    setStorageCondition('room_temperature');
  };

  const handleOpenAdd = () => {
    setEditingMed(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (med: Medicine) => {
    setEditingMed(med);
    setName(med.name);
    setFormAndStrength(med.formAndStrength);
    setCategory(med.category);
    setUnitOfMeasure(med.unitOfMeasure);
    setBarcode(med.barcode);
    setBatchNo(med.batchNo);
    setExpiryDate(med.expiryDate);
    setPurchasePrice(med.purchasePrice);
    setSellingPrice(med.sellingPrice);
    setStockQty(med.stockQty);
    setLowStockThreshold(med.lowStockThreshold);
    setSupplierId(med.supplierId);
    setRequiresPrescription(med.requiresPrescription);
    setStorageCondition(med.storageCondition);
    setIsModalOpen(true);
  };

  const handleCatalogPick = (item: any) => {
    setName(item.generic_name);
    setFormAndStrength(item.form_and_strength);
    setCategory(item.category);
    setUnitOfMeasure(item.unit_of_measure);
    setSellingPrice(item.retail_price_etb);
    setPurchasePrice(Math.round(item.retail_price_etb * 0.70));
    setRequiresPrescription(item.requires_prescription);
    setStorageCondition(item.storage_condition as Medicine['storageCondition']);
    setLowStockThreshold(item.storage_condition === 'locked_cabinet' ? 5 : item.storage_condition === 'refrigerated_2_to_8C' ? 8 : 20);
    setShowCatalogPicker(false);
    setCatalogSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Omit<Medicine, 'id'> = {
      name,
      formAndStrength,
      category,
      unitOfMeasure,
      barcode,
      batchNo,
      expiryDate,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stockQty: Number(stockQty),
      lowStockThreshold: Number(lowStockThreshold),
      supplierId,
      requiresPrescription,
      storageCondition,
    };
    if (editingMed) {
      onEditMedicine({ ...data, id: editingMed.id });
    } else {
      onAddMedicine(data);
    }
    setIsModalOpen(false);
  };

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch =
      (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.barcode || '').includes(searchTerm) ||
      (m.batchNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.formAndStrength || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesStorage = storageFilter === 'All' || m.storageCondition === storageFilter;
    return matchesSearch && matchesCategory && matchesStorage;
  });

  const filteredCatalog = useMemo(() =>
    (catalogData as any[]).filter(m =>
      m.generic_name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      m.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      m.form_and_strength.toLowerCase().includes(catalogSearch.toLowerCase())
    ).slice(0, 30),
    [catalogSearch]
  );

  const getExpiryStatus = (dateStr: string) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { label: 'Expired', class: 'badge-danger' };
    if (diffDays <= 90) return { label: `${diffDays}d left`, class: 'badge-warning' };
    return { label: 'Valid', class: 'badge-success' };
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>Medicine Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {medicines.length} medicines in catalog · Filter, search, and manage your pharmaceutical inventory
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} /> Add Medicine
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, form, barcode, batch, category…"
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
          <select className="form-control" style={{ width: '200px' }} value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <select className="form-control" style={{ width: '175px' }} value={storageFilter} onChange={e => setStorageFilter(e.target.value)}>
          <option value="All">All Storage Types</option>
          <option value="room_temperature">🌡 Room Temp</option>
          <option value="refrigerated_2_to_8C">❄ Refrigerated</option>
          <option value="locked_cabinet">🔒 Locked Cabinet</option>
        </select>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          {filteredMedicines.length} results
        </span>
      </div>

      {/* Medicine Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Medicine / Form</th>
              <th>Category</th>
              <th>Storage</th>
              <th>Expiry</th>
              <th>Purchase / Sell (ETB)</th>
              <th>Stock</th>
              <th>Flags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No medicines found matching the current filters.
                </td>
              </tr>
            ) : (
              filteredMedicines.map(med => {
                const expStatus = getExpiryStatus(med.expiryDate);
                const storage = STORAGE_LABELS[med.storageCondition];
                const profitMargin = med.sellingPrice > 0
                  ? ((med.sellingPrice - med.purchasePrice) / med.sellingPrice * 100).toFixed(0)
                  : '0';
                return (
                  <tr key={med.id}>
                    <td>
                      <div>
                        <strong style={{ fontSize: '0.9rem' }}>{med.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', marginTop: '2px', fontWeight: 500 }}>
                          {med.formAndStrength}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          Batch: {med.batchNo} · {med.unitOfMeasure}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem' }}>{med.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${storage.badgeClass}`} style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                        {storage.icon} {storage.label}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${expStatus.class}`}>{expStatus.label}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{med.expiryDate}</div>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontSize: '0.82rem' }}>{med.purchasePrice.toLocaleString()} / {med.sellingPrice.toLocaleString()} ETB</span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>{profitMargin}% margin</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${med.stockQty <= med.lowStockThreshold ? 'badge-danger' : 'badge-success'}`}>
                        {med.stockQty.toLocaleString()} {med.unitOfMeasure}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {med.requiresPrescription && (
                          <span className="badge badge-warning" style={{ display: 'inline-flex', gap: '3px', alignItems: 'center', fontSize: '0.68rem' }}>
                            <BookOpen size={10} /> Rx
                          </span>
                        )}
                        {med.storageCondition === 'locked_cabinet' && (
                          <span className="badge badge-danger" style={{ display: 'inline-flex', gap: '3px', alignItems: 'center', fontSize: '0.68rem' }}>
                            <Lock size={10} /> Controlled
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => handleOpenEdit(med)} className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => { if (window.confirm(`Delete ${med.name}?`)) onDeleteMedicine(med.id); }}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.6rem', backgroundColor: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)' }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3>{editingMed ? 'Edit Medicine' : 'Add New Medicine'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            </div>

            {/* Catalog quick-fill (only on add) */}
            {!editingMed && (
              <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#f0fdfa', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showCatalogPicker ? '0.75rem' : 0 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#065f46' }}>
                    📋 Auto-fill from Ethiopian Medicine Catalog (300 items)
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
                    onClick={() => setShowCatalogPicker(v => !v)}
                  >
                    {showCatalogPicker ? 'Close' : 'Browse Catalog'}
                  </button>
                </div>
                {showCatalogPicker && (
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search medicine name, category, or form…"
                      value={catalogSearch}
                      onChange={e => setCatalogSearch(e.target.value)}
                      style={{ marginBottom: '0.5rem' }}
                      autoFocus
                    />
                    <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {filteredCatalog.map((item: any) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleCatalogPick(item)}
                          style={{
                            textAlign: 'left', background: 'white', border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', cursor: 'pointer',
                            fontSize: '0.82rem', transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f0fdfa')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                        >
                          <strong>{item.generic_name}</strong>
                          <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>{item.form_and_strength}</span>
                          <span style={{ float: 'right', color: 'var(--accent-color)', fontWeight: 600 }}>{item.retail_price_etb.toLocaleString()} ETB</span>
                        </button>
                      ))}
                      {filteredCatalog.length === 0 && <p style={{ color: 'var(--text-secondary)', padding: '0.5rem', fontSize: '0.82rem' }}>No results.</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Generic Medicine Name</label>
                  <input required type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Form & Strength</label>
                  <input required type="text" className="form-control" placeholder="e.g. 500mg Tablet" value={formAndStrength} onChange={e => setFormAndStrength(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Unit of Measure</label>
                  <select className="form-control" value={unitOfMeasure} onChange={e => setUnitOfMeasure(e.target.value)}>
                    <option value="strip">Strip</option>
                    <option value="bottle">Bottle</option>
                    <option value="vial">Vial</option>
                    <option value="ampoule">Ampoule</option>
                    <option value="sachet">Sachet</option>
                    <option value="pack of 3">Pack of 3</option>
                    <option value="tube">Tube</option>
                    <option value="box">Box</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Drug Category</label>
                  <input required type="text" className="form-control" placeholder="e.g. Antibacterial" value={category} onChange={e => setCategory(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Storage Condition</label>
                  <select className="form-control" value={storageCondition} onChange={e => setStorageCondition(e.target.value as Medicine['storageCondition'])}>
                    <option value="room_temperature">🌡 Room Temperature</option>
                    <option value="refrigerated_2_to_8C">❄ Refrigerated (2–8°C)</option>
                    <option value="locked_cabinet">🔒 Locked Cabinet</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Barcode / UPC</label>
                  <input required type="text" className="form-control" value={barcode} onChange={e => setBarcode(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Batch Number</label>
                  <input required type="text" className="form-control" value={batchNo} onChange={e => setBatchNo(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Purchase Price (ETB)</label>
                  <input required type="number" step="0.01" min="0" className="form-control" value={purchasePrice} onChange={e => setPurchasePrice(Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label>Selling Price (ETB)</label>
                  <input required type="number" step="0.01" min="0" className="form-control" value={sellingPrice} onChange={e => setSellingPrice(Number(e.target.value))} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input required type="date" className="form-control" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input required type="number" min="0" className="form-control" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Low Stock Alert Level</label>
                  <input required type="number" min="0" className="form-control" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <select className="form-control" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                    {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={requiresPrescription}
                    onChange={e => setRequiresPrescription(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-color)' }}
                  />
                  <span>Requires Prescription (Rx)</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingMed ? 'Update Medicine' : 'Save Medicine'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
