import { useState, useEffect } from 'react';
import { translations } from '@/utils/il8n/translations';

export function useTranslation(userLang?: keyof typeof translations) {
  const [lang, setLang] = useState<keyof typeof translations>(userLang || 'en');

  useEffect(() => {
    if (userLang) setLang(userLang);
  }, [userLang]);

  const t = (key: keyof typeof translations['en']) => {
    return translations[lang][key] || translations['en'][key];
  };

  return { t, lang, setLang };
}
