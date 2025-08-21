
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../i18n/translations';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: SupportedLanguage; name: string }[] = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
    { code: 'cs', name: 'Čeština' }
  ];

  return (
    <div className="relative inline-block text-left">
      <div className="group">
        <button
          className="flex items-center space-x-1 text-white opacity-80 hover:opacity-100"
          aria-label={t('language.select')}
        >
          <Globe size={16} className="mr-1" />
          <span className="hidden md:inline text-sm">{t('language.select')}</span>
        </button>
        
        <div className="absolute z-10 mt-2 -right-2 md:right-0 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  language === lang.code ? 'bg-gray-100 text-warehouse-blue font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t(`language.${lang.code}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
