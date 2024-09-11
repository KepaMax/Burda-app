import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import az from './az.json';
import ru from './ru.json';

const resources = {
  az: {
    translation: az,
  },
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
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
