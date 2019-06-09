import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as DiscordIcon } from 'assets/icon-discord.svg';

import style from './style.module.css';
import i18n from 'i18n';
import ym from 'react-yandex-metrika';

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
            <p>© {new Date().getFullYear()} uz0</p>

            <NavLink to="#">{i18n.t('terms_and_agreement')}</NavLink>
          </div>

          <div className={style.contacts}>
            <p>{i18n.t('contact_us')}:</p>

            <NavLink to="#">
              <DiscordIcon/>
            </NavLink>
          </div>
        </div>

        <div className={style.lang_settings}>
          <button name="ru" onClick={changeLocale}>RU</button>
          <button name="en" onClick={changeLocale}>EN</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
