import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'de' | 'en' | 'cs';

type Dictionary = Record<string, string>;

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18N_STORAGE_KEY = 'art-in-motion-lang';

const dictionaries: Record<Language, Dictionary> = {
  de: {
    'header.tagline': 'Verwalten Sie Ihre Kunstsammlung',
    'tabs.warehouses': 'Lagerhäuser',
    'tabs.artworks': 'Alle Kunstwerke',
    'auth.login': 'Login',
    'auth.logout': 'Abmelden',

    'artworks.header': 'ALLE KUNSTWERKE',
    'search.label': 'Suche',
    'search.placeholder': 'Nach Name oder Künstler suchen…',
    'artworks.none': 'Keine Kunstwerke gefunden, die Ihren Kriterien entsprechen.',

    'location.header': 'STANDORTE',
    'location.all': 'Alle',

    'warehouse.child.etage.singular': 'Etage',
    'warehouse.child.etage.plural': 'Etagen',
    'warehouse.noneDirect': 'Keine Kunstwerke direkt hier gelagert',
    'location.sectionHeader': 'Standort',
    'warehouse.backToWarehouse': 'Zurück zum Lagerhaus',
    'notfound.etage': 'Etage nicht gefunden',
    'notfound.box': 'Box nicht gefunden',
    'warehouse.etagenOf': '{name} Etagen',
    'more.artworks': '+{count} weitere Kunstwerke',

    'box.back': 'Zurück',
    'box.count.singular': 'Kunstwerk',
    'box.count.plural': 'Kunstwerke',
    'box.artist': 'Künstler',
    'box.year': 'Jahr',
    'box.latestLocation': 'Letzter Standort',
    'box.changeLocation': 'Standort ändern',

    'dialog.move.title': 'Kunstwerk verschieben: {name}',
    'dialog.cancel': 'Abbrechen',

    'quick.title': 'Schnellaktionen',
    'quick.returnHome': 'Zur Startseite',
    'quick.scanQr': 'QR-Code scannen',
    'quick.contactUs': 'Kontakt',
    'qr.scanTitle': 'QR-Code scannen',
    'qr.openCamera': 'Kamera öffnen',
    'qr.loading': 'Kamera wird geladen…',
  },
  en: {
    'header.tagline': 'Manage your art collection',
    'tabs.warehouses': 'Warehouses',
    'tabs.artworks': 'All Artworks',
    'auth.login': 'Login',
    'auth.logout': 'Logout',

    'artworks.header': 'ALL ARTWORKS',
    'search.label': 'Search',
    'search.placeholder': 'Search by name or artist…',
    'artworks.none': 'No artworks match your filters.',

    'location.header': 'LOCATIONS',
    'location.all': 'All',

    'warehouse.child.etage.singular': 'Floor',
    'warehouse.child.etage.plural': 'Floors',
    'warehouse.noneDirect': 'No artworks stored directly here',
    'location.sectionHeader': 'Location',
    'warehouse.backToWarehouse': 'Back to warehouse',
    'notfound.etage': 'Floor not found',
    'notfound.box': 'Box not found',
    'warehouse.etagenOf': '{name} Floors',
    'more.artworks': '+{count} more artworks',

    'box.back': 'Back',
    'box.count.singular': 'Artwork',
    'box.count.plural': 'Artworks',
    'box.artist': 'Artist',
    'box.year': 'Year',
    'box.latestLocation': 'Latest Location',
    'box.changeLocation': 'Change Location',

    'dialog.move.title': 'Move artwork: {name}',
    'dialog.cancel': 'Cancel',

    'quick.title': 'Quick Actions',
    'quick.returnHome': 'Return to Home',
    'quick.scanQr': 'Scan QR Code',
    'quick.contactUs': 'Contact us',
    'qr.scanTitle': 'Scan QR Code',
    'qr.openCamera': 'Open Camera',
    'qr.loading': 'Loading camera…',
  },
  cs: {
    'header.tagline': 'Spravujte svou sbírku umění',
    'tabs.warehouses': 'Sklady',
    'tabs.artworks': 'Všechna díla',
    'auth.login': 'Přihlásit se',
    'auth.logout': 'Odhlásit se',

    'artworks.header': 'VŠECHNA DÍLA',
    'search.label': 'Hledat',
    'search.placeholder': 'Hledat podle jména nebo umělce…',
    'artworks.none': 'Žádná díla neodpovídají vašim filtrům.',

    'location.header': 'LOKACE',
    'location.all': 'Vše',

    'warehouse.child.etage.singular': 'Patro',
    'warehouse.child.etage.plural': 'Patra',
    'warehouse.noneDirect': 'Žádná díla nejsou uložena přímo zde',
    'location.sectionHeader': 'Umístění',
    'warehouse.backToWarehouse': 'Zpět do skladu',
    'notfound.etage': 'Patro nenalezeno',
    'notfound.box': 'Krabice nenalezena',
    'warehouse.etagenOf': '{name} Patra',
    'more.artworks': '+{count} dalších děl',

    'box.back': 'Zpět',
    'box.count.singular': 'Dílo',
    'box.count.plural': 'Díla',
    'box.artist': 'Umělec',
    'box.year': 'Rok',
    'box.latestLocation': 'Poslední umístění',
    'box.changeLocation': 'Změnit umístění',

    'dialog.move.title': 'Přesunout dílo: {name}',
    'dialog.cancel': 'Zrušit',

    'quick.title': 'Rychlé akce',
    'quick.returnHome': 'Zpět na domovskou stránku',
    'quick.scanQr': 'Skenovat QR kód',
    'quick.contactUs': 'Kontaktujte nás',
    'qr.scanTitle': 'Skenovat QR kód',
    'qr.openCamera': 'Otevřít kameru',
    'qr.loading': 'Načítání kamery…',
  },
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('de');

  useEffect(() => {
    const stored = localStorage.getItem(I18N_STORAGE_KEY) as Language | null;
    if (stored && ['de', 'en', 'cs'].includes(stored)) {
      setLanguage(stored);
      return;
    }
    const browser = (navigator.language || 'de').toLowerCase();
    if (browser.startsWith('cs')) setLanguage('cs');
    else if (browser.startsWith('en')) setLanguage('en');
    else setLanguage('de');
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const translate = (key: string, vars?: Record<string, string | number>) => {
      const dict = dictionaries[language] || {};
      let str = dict[key] || key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`{${k}}`, 'g'), String(v));
        });
      }
      return str;
    };
    const setter = (lang: Language) => {
      setLanguage(lang);
      try { localStorage.setItem(I18N_STORAGE_KEY, lang); } catch {}
    };
    return { language, setLanguage: setter, t: translate };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};


