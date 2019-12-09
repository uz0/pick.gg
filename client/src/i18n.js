import i18n from 'i18next';

import { en, ru } from './i18';

const currentLocale = localStorage.getItem('_pgg_locale') ? localStorage.getItem('_pgg_locale') : 'en';

i18n.init({
  debug: true,
  lng: currentLocale,
  resources: { en, ru },
});

export default i18n;
