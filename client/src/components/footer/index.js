
import React from 'react';
import ym from 'react-yandex-metrika';

import i18n from 'i18n';

import style from './style.module.css';

const Footer = () => {
  const changeLocale = event => {
    localStorage.setItem('_pgg_locale', event.target.name);
    i18n.changeLanguage(event.target.name);

    ym('reachGoal', `choosed_${event.target.name}_locale`);
    window.location.reload();
  };

  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <div className={style.info}>
          <div className={style.copyright}>
            <p>PICK.GG</p>
            <p>{new Date().getFullYear()} All right reserved</p>
          </div>
        </div>

        <div className={style.lang_settings}>
          <button type="button" name="ru" onClick={changeLocale}>RU</button>
          <button type="button" name="en" onClick={changeLocale}>EN</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
