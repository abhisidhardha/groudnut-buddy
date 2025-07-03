// LanguageSwitcher.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css'; // Assuming you have a CSS file for styles
const LANGUAGES = [
  { code: 'en', nameKey: 'english' },
  { code: 'hi', nameKey: 'hindi' },
  { code: 'te', nameKey: 'telugu' },
  { code: 'ta', nameKey: 'tamil' },
  { code: 'mr', nameKey: 'marathi' },
  { code: 'bn', nameKey: 'bengali' },
];

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <button
        className="trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('app.select_language')}
      >
        🌐
      </button>

      {isOpen && (
        <div className="language-popup-overlay" onClick={() => setIsOpen(false)}>
          <div className="language-card" onClick={e => e.stopPropagation()}>
            <h3 className="card-title">{t('app.select_language')}</h3>

            <div className="language-options">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className={`language-option ${i18n.language === lang.code ? 'selected' : ''}`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  {t(`language.${lang.nameKey}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
