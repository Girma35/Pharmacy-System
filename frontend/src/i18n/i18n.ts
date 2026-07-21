import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import am from './locales/am.json';
import om from './locales/om.json';

const savedLang = localStorage.getItem('pharmacy-language');

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
      om: { translation: om }
    },
    lng: savedLang || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'pharmacy-language',
      caches: ['localStorage']
    }
  });

export default i18n;
