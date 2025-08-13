'use client';

import { useRouter } from 'next/router';
import { useMemo } from 'react';

export function useTranslation() {
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;

  const t = useMemo(() => {
    return (key) => {
      try {
        const translations = require(`./locales/${locale}.json`);
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
          value = value[k];
          if (value === undefined) {
            console.warn(`Translation key not found: ${key} for locale: ${locale}`);
            return key;
          }
        }
        
        return value;
      } catch (error) {
        console.warn(`Translation file not found for locale: ${locale}`);
        return key;
      }
    };
  }, [locale]);

  const changeLanguage = (newLocale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return {
    t,
    locale,
    locales,
    defaultLocale,
    changeLanguage,
  };
} 