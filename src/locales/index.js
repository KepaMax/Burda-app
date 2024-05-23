import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import az from './az.json'
import ru from './ru.json'

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
  az: {
    translation: az,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'az',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false
  }
});