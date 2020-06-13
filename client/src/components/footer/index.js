
import React from 'react';
import ym from 'react-yandex-metrika';

import i18n from 'i18n';

import style from './style.module.css';

const Footer = () => {
  const changeLocale = event => {
    localStorage.setItem('_pgg_locale', event.target.name);
    i18n.changeLanguage(event.target.name);

    ym('reachGoal', `choosed_${event.target.name}_locale`);

    if (window.location.hostname.includes('pick.gg')) {
      if (event.target.name === 'ru') {
        window.location.hostname = 'ru.pick.gg';
      } else {
        window.location.hostname = 'pick.gg';
      }
    } else {
      window.location.reload();
    }
  };

  const underline = lang => {
    if (localStorage.getItem('_pgg_locale') === lang) {
      return style.underline;
    }
  };

  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <div className={style.info}>
          <div className={style.copyright}>
            <p>PICK.GG</p>
            <p>{new Date().getFullYear()} {i18n.t('home.all_rights')}</p>
          </div>
        </div>

        <div className={style.lang_settings}>
          <button className={underline('ru')} type="button" name="ru" onClick={changeLocale}>RU</button>
          <button className={underline('en')} type="button" name="en" onClick={changeLocale}>EN</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
