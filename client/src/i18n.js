import i18n from 'i18next';
import { en, ru } from './i18';
import { reactI18nextModule } from 'react-i18next';

i18n.use(reactI18nextModule).init({
  debug    : true,
  lng      : 'en',
  react    : {defaultTransParent: 'div', wait: true},
  resources: { en, ru },
});

export default i18n;