'use client';

import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { localeNames, localeFlags } from '../i18n/settings';

export default function TestI18n() {
  const params = useParams();
  const pathname = usePathname();
  
  // Extraire la langue depuis les paramètres ou l'URL
  const locale = params?.lang || 'fr';
  const locales = ['fr', 'es', 'en', 'he'];
  const defaultLocale = 'fr';

  const t = useMemo(() => {
    return (key) => {
      try {
        const translations = require(`../i18n/locales/${locale}.json`);
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
    const currentPath = pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Test Internationalisation 🌍
          </h1>

          {/* Sélecteur de langue */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Sélectionner la langue :</h2>
            <div className="flex flex-wrap gap-2">
              {locales.map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    locale === lang
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <span className="mr-2">{localeFlags[lang]}</span>
                  {localeNames[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Tests de traduction */}
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Navigation :</h3>
              <p><strong>Accueil :</strong> {t('navigation.home')}</p>
              <p><strong>Menu :</strong> {t('navigation.menu')}</p>
              <p><strong>Réservation :</strong> {t('navigation.reservation')}</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Page d'accueil :</h3>
              <p><strong>Titre :</strong> {t('home.title')}</p>
              <p><strong>Sous-titre :</strong> {t('home.subtitle')}</p>
              <p><strong>Description :</strong> {t('home.description')}</p>
              <p><strong>Bouton commander :</strong> {t('home.orderButton')}</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Footer :</h3>
              <p><strong>Titre :</strong> {t('footer.title')}</p>
              <p><strong>Description :</strong> {t('footer.description')}</p>
              <p><strong>Téléphone :</strong> {t('footer.phone')}</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Informations techniques :</h3>
              <p><strong>Langue actuelle :</strong> {locale}</p>
              <p><strong>Langues disponibles :</strong> {locales.join(', ')}</p>
              <p><strong>Langue par défaut :</strong> {locale}</p>
            </div>
          </div>

          {/* Test d'URL */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Test des URLs :</h3>
            <p className="text-sm text-gray-600">
              Essayez d'accéder directement aux URLs suivantes :
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li><code>/fr</code> - Site en français</li>
              <li><code>/es</code> - Site en espagnol</li>
              <li><code>/en</code> - Site en anglais</li>
              <li><code>/he</code> - Site en hébreu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 