import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Medicine, Customer, Prescription, SaleItem } from '../data/mockData';
import { Search, ShoppingCart, User, Plus, Minus, Tag, Trash2, Printer, CheckCircle, FileText, BarChart3 } from 'lucide-react';

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
    tax: number;
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
  onViewReport
}: SalesPOSViewProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ med: Medicine; qty: number; discount: number }[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState('');
  const [discountVal, setDiscountVal] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer'>('Cash');
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  // Search medicines
  const filteredMeds = medicines.filter(m => 
    m.stockQty > 0 && 
    (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.barcode.includes(searchTerm))
  );

  // Add to cart
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
  const taxRate = 0.16; // 16% Tax
  const finalTax = Math.max(0, subtotal - discountAmount) * taxRate;
  const totalVal = Math.max(0, subtotal - discountAmount) + finalTax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const selectedCustObj = customers.find(c => c.id === selectedCustomerId);
    
    const saleItems: SaleItem[] = cart.map(item => ({
      medicineId: item.med.id,
      name: item.med.name,
      qty: item.qty,
      price: item.med.sellingPrice,
      discount: item.discount
    }));

    const newSale = {
      customerId: selectedCustomerId || undefined,
      customerName: selectedCustObj ? selectedCustObj.name : 'Walk-in Customer',
      items: saleItems,
      subtotal,
      discount: discountAmount,
      tax: finalTax,
      total: totalVal,
      paymentMethod,
      id: `S-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString()
    };

    onAddSale(newSale);
    setActiveReceipt(newSale);
    // Reset Cart
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Search medicines and select items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Fast Product Lookup</h3>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                className="form-control"
                placeholder={t('pos.searchPlaceholder')}
                style={{ paddingLeft: '2.5rem' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
              {filteredMeds.map(med => (
                <div
                  key={med.id}
                  onClick={() => addToCart(med)}
                  style={{
                    padding: '1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{med.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                    {t('pos.qtyLabel')} {med.stockQty} {t('pos.qtyLeft')} | {med.category}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-color)' }}>${med.sellingPrice.toFixed(2)}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{t('pos.add')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Cart and billing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Current Cart</h3>
              <span className="badge badge-info" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <ShoppingCart size={14} /> {cart.length} {t('pos.items')}
              </span>
            </div>

            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {cart.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>{t('pos.cartEmpty')}</p>
              ) : (
                cart.map(item => (
                  <div key={item.med.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ flexGrow: 1 }}>
                      <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.med.name}</span>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>${item.med.sellingPrice.toFixed(2)} {t('pos.perUnit')}</span>
                        <input
                          type="number"
                          placeholder={t('pos.disc')}
                          style={{ width: '60px', padding: '0.2rem', fontSize: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                          value={item.discount || ''}
                          onChange={(e) => updateItemDiscount(item.med.id, Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <button onClick={() => updateQty(item.med.id, -1)} className="btn btn-secondary" style={{ padding: '0.2rem 0.4rem' }}><Minus size={12} /></button>
                        <span style={{ fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.med.id, 1)} className="btn btn-secondary" style={{ padding: '0.2rem 0.4rem' }}><Plus size={12} /></button>
                      </div>
                      <span style={{ fontWeight: 600, width: '60px', textAlign: 'right' }}>
                        ${((item.qty * item.med.sellingPrice) - item.discount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer & Prescription Linkage */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} /> {t('pos.linkCustomer')}</label>
                <select className="form-control" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}>
                  <option value="">{t('pos.walkInCustomer')}</option>
                  {customers.map(cust => (
                    <option key={cust.id} value={cust.id}>{cust.name} ({cust.phone})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FileText size={14} /> {t('pos.linkPrescription')}</label>
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

            {/* Calculations and Billing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('pos.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Tag size={12} /> {t('pos.cartDiscount')}
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="form-control"
                  style={{ width: '80px', padding: '0.25rem', height: '28px', fontSize: '0.8rem', textAlign: 'right' }}
                  value={discountVal || ''}
                  onChange={e => setDiscountVal(Number(e.target.value))}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('pos.tax')}</span>
                <span>${finalTax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, marginTop: '0.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                <span>{t('pos.totalAmount')}</span>
                <span style={{ color: 'var(--accent-color)' }}>${totalVal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
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

            <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>
              <CheckCircle size={18} />
              {t('pos.processTransaction')}
            </button>
          </div>
        </div>
      </div>

      {/* POS Receipt Modal View */}
      {activeReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', padding: '1.5rem', fontFamily: 'Courier New, Courier, monospace' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h2>PHARMACARE CO.</h2>
              <p style={{ fontSize: '0.8rem' }}>456 Wellness Street, Health City</p>
              <p style={{ fontSize: '0.8rem' }}>Tel: +1 (555) 987-6543</p>
            </div>
            
            <div style={{ borderBottom: '1px dashed #000', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 700 }}>{activeReceipt.items.map((i: any) => i.name).join(', ')}</div>
              <div>{t('pos.date')} {new Date(activeReceipt.createdAt).toLocaleString()}</div>
              <div>{t('pos.cashier')} Lucy Heart</div>
              <div>{t('pos.customer')} {activeReceipt.customerName}</div>
            </div>

            <div style={{ borderBottom: '1px dashed #000', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              {activeReceipt.items.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.25rem 0' }}>
                  <div>{item.qty}x {item.name}</div>
                  <div>${((item.qty * item.price) - item.discount).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div>{t('pos.subtotalLabel')} ${activeReceipt.subtotal.toFixed(2)}</div>
              {activeReceipt.discount > 0 && <div>{t('pos.discountLabel')} -${activeReceipt.discount.toFixed(2)}</div>}
              <div>{t('pos.tax')} ${activeReceipt.tax.toFixed(2)}</div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{t('pos.totalPaid')} ${activeReceipt.total.toFixed(2)}</div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '1.5rem' }}>
              <p>{t('pos.thankYou')}</p>
              <p>{t('pos.getWell')}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'center' }}>
              <button onClick={() => window.print()} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                <Printer size={14} /> {t('pos.print')}
              </button>
              <button onClick={() => { setActiveReceipt(null); onViewReport?.(); }} className="btn btn-primary" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--info)', border: 'none' }}>
                <BarChart3 size={14} /> {t('pos.viewReport')}
              </button>
              <button onClick={() => setActiveReceipt(null)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                {t('pos.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
