import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
    { code: 'om', label: 'Afaan Oromoo', flag: '🇪🇹' }
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('pharmacy-language', code);
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Change Language"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.45rem 0.75rem',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--card-bg)',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          transition: 'all 0.2s',
          boxShadow: 'var(--shadow-sm)'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
      >
        <Languages size={16} />
        <span>{currentLang.flag}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          backgroundColor: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 100,
          minWidth: '180px',
          overflow: 'hidden'
        }}>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.7rem 1rem',
                border: 'none',
                backgroundColor: i18n.language === lang.code ? '#f0fdfa' : 'white',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: i18n.language === lang.code ? 700 : 500,
                color: i18n.language === lang.code ? 'var(--accent-color)' : 'var(--text-primary)',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = i18n.language === lang.code ? '#f0fdfa' : 'white'}
            >
              <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
