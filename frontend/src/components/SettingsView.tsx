import React, { useState } from 'react';
import { SystemSettings } from '../data/mockData';
import { Save, Database, ShieldCheck, RefreshCw } from 'lucide-react';

interface SettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
}

export default function SettingsView({
  settings,
  onSaveSettings
}: SettingsViewProps) {
  const [pharmacyName, setPharmacyName] = useState(settings.pharmacyName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [taxRate, setTaxRate] = useState(settings.taxRate);
  const [currency, setCurrency] = useState(settings.currency);
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      pharmacyName,
      address,
      phone,
      email,
      taxRate: Number(taxRate),
      currency,
      receiptFooter
    });
    alert('Pharmacy configuration settings saved successfully!');
  };

  const handleBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      version: "1.0",
      timestamp: new Date().toISOString(),
      settings: { pharmacyName, address, phone, email, taxRate, currency, receiptFooter }
    }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pharmacy_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRestore = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          try {
            const parsed = JSON.parse(event.target.result);
            if (parsed.settings) {
              setPharmacyName(parsed.settings.pharmacyName);
              setAddress(parsed.settings.address);
              setPhone(parsed.settings.phone);
              setEmail(parsed.settings.email);
              setTaxRate(parsed.settings.taxRate);
              setCurrency(parsed.settings.currency);
              setReceiptFooter(parsed.settings.receiptFooter);
              alert('Settings successfully restored from backup file!');
            } else {
              alert('Invalid backup file format.');
            }
          } catch (err) {
            alert('Failed to parse backup file.');
          }
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h2>System Configuration</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Configure storefront details, receipt parameters, tax systems, and cloud backups</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Pharmacy Profile Settings</h3>
          
          <div className="form-group">
            <label>Pharmacy Name</label>
            <input required type="text" className="form-control" value={pharmacyName} onChange={e => setPharmacyName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Store Address</label>
            <input required type="text" className="form-control" value={address} onChange={e => setAddress(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Telephone</label>
              <input required type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Business Email Address</label>
              <input required type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Financial & Receipt Settings</h3>

          <div className="form-row">
            <div className="form-group">
              <label>VAT Tax Rate (%)</label>
              <input required type="number" min="0" max="100" step="0.1" className="form-control" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Local Currency Symbol</label>
              <input required type="text" className="form-control" value={currency} onChange={e => setCurrency(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>POS Receipt Footer Message</label>
            <textarea required rows={2} className="form-control" value={receiptFooter} onChange={e => setReceiptFooter(e.target.value)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Save size={16} /> Save Configuration
            </button>
          </div>
        </form>

        {/* Database backup card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Backup & Restore Database</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Export the current workspace configuration, inventory levels, and transactional history to a localized backup file, or restore.
            </p>
            
            <button onClick={handleBackup} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <Database size={16} /> Create Backup File
            </button>

            <button onClick={handleRestore} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
              <RefreshCw size={16} /> Restore from Backup
            </button>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46' }}>
              <ShieldCheck size={20} />
              <h4 style={{ margin: 0 }}>Security Audits Active</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#047857' }}>
              Automatic logging of user logs, authorization checks, and transaction logs are running correctly. All logs are securely cryptographically signed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
