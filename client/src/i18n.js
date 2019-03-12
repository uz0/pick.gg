import i18n from 'i18next';
import { en, ru } from './i18';

i18n.init({
  debug    : true,
  lng      : 'ru',
  resources: { en, ru },
});

export default i18n;