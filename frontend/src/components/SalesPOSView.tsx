import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Medicine, Customer, Prescription, SaleItem } from '../data/mockData';
import { Search, ShoppingCart, User, Plus, Minus, Tag, Trash2, Printer, CheckCircle, FileText, BarChart3, Lock, BookOpen } from 'lucide-react';

interface SalesPOSViewProps {
  medicines: Medicine[];
  customers: Customer[];
  prescriptions: Prescription[];
  onAddSale: (sale: {
    customerId?: string;
    customerName?: string;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: 'Cash' | 'Bank Transfer';
  }) => void;
  onViewReport?: () => void;
}

export default function SalesPOSView({
  medicines,
  customers,
  prescriptions,
  onAddSale,
  onViewReport,
}: SalesPOSViewProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ med: Medicine; qty: number; discount: number }[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState('');
  const [discountVal, setDiscountVal] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer'>('Cash');
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  const ETB = 'ETB';

  // Search medicines with stock > 0
  const filteredMeds = medicines.filter(m =>
    m.stockQty > 0 &&
    ((m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.formAndStrength || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.barcode || '').includes(searchTerm) ||
      (m.category || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (med: Medicine) => {
    const existing = cart.find(item => item.med.id === med.id);
    if (existing) {
      if (existing.qty >= med.stockQty) {
        alert('Cannot add more than available stock.');
        return;
      }
      setCart(cart.map(item => item.med.id === med.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { med, qty: 1, discount: 0 }]);
    }
  };

  const updateQty = (medId: string, delta: number) => {
    const existing = cart.find(item => item.med.id === medId);
    if (!existing) return;
    const nextQty = existing.qty + delta;
    if (nextQty <= 0) {
      setCart(cart.filter(item => item.med.id !== medId));
    } else if (nextQty > existing.med.stockQty) {
      alert('Cannot exceed available stock.');
    } else {
      setCart(cart.map(item => item.med.id === medId ? { ...item, qty: nextQty } : item));
    }
  };

  const updateItemDiscount = (medId: string, disc: number) => {
    setCart(cart.map(item => item.med.id === medId ? { ...item, discount: disc } : item));
  };

  // Calculations
  const subtotal = cart.reduce((acc, curr) => {
    const itemTotal = curr.qty * curr.med.sellingPrice;
    return acc + (itemTotal - curr.discount);
  }, 0);

  const discountAmount = Number(discountVal) || 0;
  const totalVal = Math.max(0, subtotal - discountAmount);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const selectedCustObj = customers.find(c => c.id === selectedCustomerId);

    const saleItems: SaleItem[] = cart.map(item => ({
      medicineId: item.med.id,
      name: `${item.med.name} (${item.med.formAndStrength})`,
      qty: item.qty,
      price: item.med.sellingPrice,
      discount: item.discount,
    }));

    const newSale = {
      customerId: selectedCustomerId || undefined,
      customerName: selectedCustObj ? selectedCustObj.name : 'Walk-in Customer',
      items: saleItems,
      subtotal,
      discount: discountAmount,
      total: totalVal,
      paymentMethod,
      id: `S-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
    };

    onAddSale(newSale);
    setActiveReceipt(newSale);
    setCart([]);
    setSelectedCustomerId('');
    setSelectedPrescriptionId('');
    setDiscountVal(0);
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>{t('pos.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('pos.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-info" style={{ fontSize: '0.78rem' }}>ETB</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Medicine search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Fast Product Lookup</h3>
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, form, barcode, category…"
                style={{ paddingLeft: '2.5rem' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxHeight: '480px', overflowY: 'auto' }}>
              {filteredMeds.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No medicines found.
                </div>
              )}
              {filteredMeds.map(med => (
                <div
                  key={med.id}
                  onClick={() => addToCart(med)}
                  style={{
                    padding: '0.875rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,148,136,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Flags row */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    {med.requiresPrescription && (
                      <span className="badge badge-warning" style={{ fontSize: '0.62rem', padding: '1px 5px', display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
                        <BookOpen size={9} /> Rx
                      </span>
                    )}
                    {med.storageCondition === 'locked_cabinet' && (
                      <span className="badge badge-danger" style={{ fontSize: '0.62rem', padding: '1px 5px', display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
                        <Lock size={9} /> Controlled
                      </span>
                    )}
                    {med.storageCondition === 'refrigerated_2_to_8C' && (
                      <span className="badge badge-info" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>❄ Cold Chain</span>
                    )}
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '0.88rem', lineHeight: '1.3', marginBottom: '2px' }}>{med.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 500, marginBottom: '2px' }}>{med.formAndStrength}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Stock: {med.stockQty} {med.unitOfMeasure}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-color)', fontSize: '0.9rem' }}>
                      {med.sellingPrice.toLocaleString()} ETB
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>+ Add</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Cart & billing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Current Cart</h3>
              <span className="badge badge-info" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <ShoppingCart size={14} /> {cart.length} {t('pos.items')}
              </span>
            </div>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {cart.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>{t('pos.cartEmpty')}</p>
              ) : (
                cart.map(item => (
                  <div key={item.med.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ flexGrow: 1 }}>
                      <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>{item.med.name}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)' }}>{item.med.formAndStrength}</div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '3px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {item.med.sellingPrice.toLocaleString()} ETB/{item.med.unitOfMeasure}
                        </span>
                        <input
                          type="number"
                          placeholder="Disc"
                          style={{ width: '55px', padding: '0.15rem 0.35rem', fontSize: '0.72rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                          value={item.discount || ''}
                          onChange={e => updateItemDiscount(item.med.id, Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <button onClick={() => updateQty(item.med.id, -1)} className="btn btn-secondary" style={{ padding: '0.15rem 0.35rem' }}><Minus size={11} /></button>
                        <span style={{ fontWeight: 600, width: '22px', textAlign: 'center', fontSize: '0.9rem' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.med.id, 1)} className="btn btn-secondary" style={{ padding: '0.15rem 0.35rem' }}><Plus size={11} /></button>
                      </div>
                      <span style={{ fontWeight: 600, width: '72px', textAlign: 'right', fontSize: '0.85rem' }}>
                        {((item.qty * item.med.sellingPrice) - item.discount).toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer & Prescription */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={13} /> {t('pos.linkCustomer')}</label>
                <select className="form-control" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}>
                  <option value="">{t('pos.walkInCustomer')}</option>
                  {customers.map(cust => (
                    <option key={cust.id} value={cust.id}>{cust.name} ({cust.phone})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FileText size={13} /> {t('pos.linkPrescription')}</label>
                <select className="form-control" value={selectedPrescriptionId} onChange={e => setSelectedPrescriptionId(e.target.value)}>
                  <option value="">{t('pos.noPrescription')}</option>
                  {prescriptions.map(pres => (
                    <option key={pres.id} value={pres.id}>
                      {pres.id} — Dr. {pres.doctorName} ({pres.customerName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Totals */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('pos.subtotal')}</span>
                <span>{subtotal.toLocaleString()} {ETB}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Tag size={12} /> {t('pos.cartDiscount')}
                </span>
                <input
                  type="number"
                  placeholder="0"
                  className="form-control"
                  style={{ width: '80px', padding: '0.2rem 0.4rem', height: '26px', fontSize: '0.8rem', textAlign: 'right' }}
                  value={discountVal || ''}
                  onChange={e => setDiscountVal(Number(e.target.value))}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, marginTop: '0.4rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                <span>{t('pos.totalAmount')}</span>
                <span style={{ color: 'var(--accent-color)' }}>{totalVal.toLocaleString(undefined, { maximumFractionDigits: 2 })} {ETB}</span>
              </div>
            </div>

            {/* Payment method */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {(['Cash', 'Bank Transfer'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`btn ${paymentMethod === method ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '0.5rem' }}
                >
                  {method === 'Cash' ? t('pos.cash') : t('pos.bankTransfer')}
                </button>
              ))}
            </div>

            <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1.1rem', fontWeight: 700, gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={20} />
              {t('pos.sell') || 'Sell'}
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {activeReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', padding: '1.5rem', fontFamily: 'Courier New, monospace' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem' }}>ADDIS PHARMACY</h2>
              <p style={{ fontSize: '0.8rem' }}>Bole Road, Addis Ababa, Ethiopia</p>
              <p style={{ fontSize: '0.8rem' }}>Tel: +251 11 123 4567</p>
            </div>

            <div style={{ borderBottom: '1px dashed #000', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <div>{t('pos.date')} {new Date(activeReceipt.createdAt).toLocaleString()}</div>
              <div>{t('pos.customer')} {activeReceipt.customerName}</div>
              <div>Payment: {activeReceipt.paymentMethod}</div>
            </div>

            <div style={{ borderBottom: '1px dashed #000', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              {activeReceipt.items.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.25rem 0' }}>
                  <div>{item.qty}x {item.name}</div>
                  <div>{((item.qty * item.price) - item.discount).toLocaleString()} {ETB}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div>Subtotal: {activeReceipt.subtotal.toLocaleString()} {ETB}</div>
              {activeReceipt.discount > 0 && <div>Discount: -{activeReceipt.discount.toLocaleString()} {ETB}</div>}
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                TOTAL: {activeReceipt.total.toLocaleString(undefined, { maximumFractionDigits: 2 })} {ETB}
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.78rem', marginTop: '1rem', borderTop: '1px dashed #000', paddingTop: '0.75rem' }}>
              <p>Thank you for choosing Addis Pharmacy.</p>
              <p>Stay healthy! 💊</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', justifyContent: 'center' }}>
              <button onClick={() => window.print()} className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem' }}>
                <Printer size={14} /> {t('pos.print')}
              </button>
              <button onClick={() => { setActiveReceipt(null); onViewReport?.(); }} className="btn btn-primary" style={{ padding: '0.45rem 0.9rem', backgroundColor: 'var(--info)', border: 'none' }}>
                <BarChart3 size={14} /> {t('pos.viewReport')}
              </button>
              <button onClick={() => setActiveReceipt(null)} className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem' }}>
                {t('pos.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
