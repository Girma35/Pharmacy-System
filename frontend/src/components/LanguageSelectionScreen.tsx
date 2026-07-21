import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Check } from 'lucide-react';

interface Props {
  onLanguageSelected: () => void;
}

export default function LanguageSelectionScreen({ onLanguageSelected }: Props) {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', label: t('language.en'), flag: '🇬🇧' },
    { code: 'am', label: t('language.am'), flag: '🇪🇹' },
    { code: 'om', label: t('language.om'), flag: '🇪🇹' }
  ];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('pharmacy-language', code);
    onLanguageSelected();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '1rem'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '3rem 2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 8px 24px rgba(13, 148, 136, 0.3)'
        }}>
          <Languages size={36} />
        </div>

        <h2 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {t('language.select')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {t('language.description')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                transition: 'all 0.2s',
                width: '100%'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-color)';
                e.currentTarget.style.backgroundColor = '#f0fdfa';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              <span style={{ fontSize: '1.4rem', marginRight: '0.75rem' }}>{lang.flag}</span>
              <span style={{ flexGrow: 1, textAlign: 'left' }}>{lang.label}</span>
              {i18n.language === lang.code && (
                <Check size={18} style={{ color: 'var(--accent-color)' }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
