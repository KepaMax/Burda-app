import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import az from './az.json';

const resources = {
  az: {
    translation: az,
  },
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'az',
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
});
