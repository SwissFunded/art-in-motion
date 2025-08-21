
export type SupportedLanguage = 'de' | 'en' | 'cs';

export const translations = {
  de: {
    app: {
      title: 'TichyOcean',
      subtitle: 'Art in Motion',
      demoMode: 'Demo'
    },
    auth: {
      title: 'FileMaker Data API Token',
      placeholder: 'Geben Sie Ihr Bearer-Token ein',
      login: 'Anmelden',
      authenticating: 'Authentifizierung...',
      demoModeButton: 'Mit Demo-Modus fortfahren',
      demoModeInfo: 'Demo-Modus verwendet Beispiel-Kunstwerk-Daten',
      demoModeNoToken: 'Kein FileMaker API-Token erforderlich',
      invalidToken: 'Bitte geben Sie ein gültiges Token ein',
      validationError: 'Token konnte nicht validiert werden',
      or: 'oder'
    },
    artwork: {
      details: 'Kunstwerk-Details',
      id: 'ID',
      by: 'von',
      currentLocation: 'Aktueller Standort',
      newLocation: 'Neuer Standort',
      back: 'Zurück',
      update: 'Aktualisieren',
      saving: 'Speichere...',
      locationUpdateError: 'Bitte wählen Sie einen anderen Standort',
      updateFailed: 'Standortaktualisierung fehlgeschlagen'
    },
    batch: {
      title: 'Stapel-Verschiebe-Warteschlange',
      inQueue: 'Artikel in der Warteschlange für Stapelverarbeitung',
      moveAll: 'Alle verschieben',
      moveAllTo: 'Alle Artikel verschieben nach:',
      processing: 'Verarbeite...',
      clear: 'Leeren',
      removeItem: 'Artikel entfernen',
      empty: 'Keine Artikel in der Warteschlange'
    },
    modes: {
      single: 'Einzel-Modus',
      batch: 'Stapel-Modus',
      batchActive: 'Stapel-Modus'
    },
    actions: {
      logout: 'Abmelden',
      loading: 'Laden...',
      backToScanner: 'Zurück zum Scanner'
    },
    demo: {
      active: 'Demo-Modus aktiv',
      description: 'Sie verwenden Beispieldaten. In diesem Modus können Sie das Scannen von QR-Codes simulieren.',
      simulateScan: 'QR-Scan simulieren'
    },
    notifications: {
      locationUpdated: 'Standort aktualisiert',
      movedTo: 'Verschoben nach',
      addedToQueue: 'zu der Warteschlange hinzugefügt',
      alreadyInQueue: 'ist bereits in der Warteschlange',
      batchUpdateComplete: 'Stapelaktualisierung abgeschlossen',
      itemsMoved: 'Objekte wurden verschoben nach',
      batchModeEnabled: 'Stapel-Modus aktiviert',
      batchModeDisabled: 'Stapel-Modus deaktiviert',
      scanMultiple: 'Scannen Sie mehrere Artikel, bevor Sie sie verschieben',
      switchToSingle: 'Wechsel zum Einzel-Modus'
    },
    notFound: {
      title: '404',
      message: 'Hoppla! Seite nicht gefunden',
      backToHome: 'Zurück zur Startseite'
    },
    language: {
      select: 'Sprache',
      de: 'Deutsch',
      en: 'English',
      cs: 'Čeština'
    }
  },
  en: {
    app: {
      title: 'TichyOcean',
      subtitle: 'Art in Motion',
      demoMode: 'Demo'
    },
    auth: {
      title: 'FileMaker Data API Token',
      placeholder: 'Enter your Bearer token',
      login: 'Login',
      authenticating: 'Authenticating...',
      demoModeButton: 'Continue with Demo Mode',
      demoModeInfo: 'Demo mode uses sample artwork data',
      demoModeNoToken: 'No FileMaker API token required',
      invalidToken: 'Please enter a valid token',
      validationError: 'Token could not be validated',
      or: 'or'
    },
    artwork: {
      details: 'Artwork Details',
      id: 'ID',
      by: 'by',
      currentLocation: 'Current Location',
      newLocation: 'New Location',
      back: 'Back',
      update: 'Update',
      saving: 'Saving...',
      locationUpdateError: 'Please select a different location',
      updateFailed: 'Location update failed'
    },
    batch: {
      title: 'Batch Moving Queue',
      inQueue: 'items in queue for batch processing',
      moveAll: 'Move All',
      moveAllTo: 'Move all items to:',
      processing: 'Processing...',
      clear: 'Clear',
      removeItem: 'Remove item',
      empty: 'No items in queue'
    },
    modes: {
      single: 'Single Mode',
      batch: 'Batch Mode',
      batchActive: 'Batch Mode'
    },
    actions: {
      logout: 'Logout',
      loading: 'Loading...',
      backToScanner: 'Back to Scanner'
    },
    demo: {
      active: 'Demo Mode Active',
      description: 'You are using sample data. In this mode, you can simulate scanning QR codes.',
      simulateScan: 'Simulate QR scan'
    },
    notifications: {
      locationUpdated: 'Location updated',
      movedTo: 'Moved to',
      addedToQueue: 'added to the moving queue',
      alreadyInQueue: 'is already in the moving queue',
      batchUpdateComplete: 'Batch update completed',
      itemsMoved: 'items were moved to',
      batchModeEnabled: 'Batch mode enabled',
      batchModeDisabled: 'Batch mode disabled',
      scanMultiple: 'Scan multiple items before moving them',
      switchToSingle: 'Switching to single item mode'
    },
    notFound: {
      title: '404',
      message: 'Oops! Page not found',
      backToHome: 'Back to Home'
    },
    language: {
      select: 'Language',
      de: 'Deutsch',
      en: 'English',
      cs: 'Čeština'
    }
  },
  cs: {
    app: {
      title: 'TichyOcean',
      subtitle: 'Umění v pohybu',
      demoMode: 'Demo'
    },
    auth: {
      title: 'FileMaker Data API Token',
      placeholder: 'Zadejte svůj Bearer token',
      login: 'Přihlásit se',
      authenticating: 'Ověřování...',
      demoModeButton: 'Pokračovat v demo režimu',
      demoModeInfo: 'Demo režim používá ukázková data uměleckých děl',
      demoModeNoToken: 'FileMaker API token není vyžadován',
      invalidToken: 'Zadejte prosím platný token',
      validationError: 'Token nemohl být ověřen',
      or: 'nebo'
    },
    artwork: {
      details: 'Detaily uměleckého díla',
      id: 'ID',
      by: 'od',
      currentLocation: 'Aktuální umístění',
      newLocation: 'Nové umístění',
      back: 'Zpět',
      update: 'Aktualizovat',
      saving: 'Ukládání...',
      locationUpdateError: 'Vyberte prosím jiné umístění',
      updateFailed: 'Aktualizace umístění selhala'
    },
    batch: {
      title: 'Fronta dávkového přesunu',
      inQueue: 'položek ve frontě pro dávkové zpracování',
      moveAll: 'Přesunout vše',
      moveAllTo: 'Přesunout všechny položky do:',
      processing: 'Zpracování...',
      clear: 'Vyčistit',
      removeItem: 'Odebrat položku',
      empty: 'Žádné položky ve frontě'
    },
    modes: {
      single: 'Jednotlivý režim',
      batch: 'Dávkový režim',
      batchActive: 'Dávkový režim'
    },
    actions: {
      logout: 'Odhlásit se',
      loading: 'Načítání...',
      backToScanner: 'Zpět na skener'
    },
    demo: {
      active: 'Demo režim aktivní',
      description: 'Používáte ukázková data. V tomto režimu můžete simulovat skenování QR kódů.',
      simulateScan: 'Simulovat QR sken'
    },
    notifications: {
      locationUpdated: 'Umístění aktualizováno',
      movedTo: 'Přesunuto do',
      addedToQueue: 'přidáno do fronty na přesun',
      alreadyInQueue: 'je již ve frontě na přesun',
      batchUpdateComplete: 'Dávková aktualizace dokončena',
      itemsMoved: 'položek bylo přesunuto do',
      batchModeEnabled: 'Dávkový režim povolen',
      batchModeDisabled: 'Dávkový režim zakázán',
      scanMultiple: 'Naskenujte více položek před jejich přesunem',
      switchToSingle: 'Přepínání do režimu jednotlivých položek'
    },
    notFound: {
      title: '404',
      message: 'Jejda! Stránka nenalezena',
      backToHome: 'Zpět na úvodní stránku'
    },
    language: {
      select: 'Jazyk',
      de: 'Deutsch',
      en: 'English',
      cs: 'Čeština'
    }
  }
};
