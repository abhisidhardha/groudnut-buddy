// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en }, // Your English translations
    hi: { translation: hi }, // Hindi
    te: { translation: te }, // Telugu
    ta: { translation: ta }, // Tamil
    mr: { translation: mr }, // Marathi
    bn: { translation: bn }, // Bengali
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
