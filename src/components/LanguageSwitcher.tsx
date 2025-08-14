import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Globe } from 'lucide-react';
import { useI18n, Language } from '@/context/I18nContext';

const LANG_OPTIONS: Array<{ code: Language; short: string; label: string; flag: string }> = [
  { code: 'de', short: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', short: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'cs', short: 'CS', label: 'Čeština', flag: '🇨🇿' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();
  const current = LANG_OPTIONS.find(l => l.code === language) || LANG_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 sm:h-9 px-2 sm:px-3 inline-flex items-center gap-2"
          aria-label="Change language"
        >
          <Globe size={16} className="opacity-80" />
          {/* Short on very small screens, full label on sm+ */}
          <span className="inline sm:hidden font-medium tracking-wide min-w-[2ch] text-xs">
            {current.short}
          </span>
          <span className="hidden sm:inline font-medium tracking-wide text-xs sm:text-sm">
            {current.flag} {current.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {LANG_OPTIONS.map(opt => (
          <DropdownMenuItem
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
            </span>
            {opt.code === language && <Check size={16} className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;


