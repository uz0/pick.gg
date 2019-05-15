import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as DiscordIcon } from 'assets/icon-discord.svg';

import style from './style.module.css';
import i18n from 'i18n';

const Footer = () => {
  const changeLocale = (event) => {
    localStorage.setItem('_pgg_locale', event.target.name);
    i18n.changeLanguage(event.target.name);
    window.location.reload();
  };

  return <footer className={style.footer}>
    <div className={style.container}>
      <div className={style.info}>
        <div className={style.copyright}>
          <p>© 2019 uz0</p>

          <NavLink to="#">{i18n.t('terms_and_agreement')}</NavLink>
        </div>

        <div className={style.contacts}>
          <p>{i18n.t('contact_us')}:</p>

          <NavLink to="#">
            <DiscordIcon />
          </NavLink>
        </div>
      </div>

      <div className={style.lang_settings}>
        <button onClick={changeLocale} name='ru'>RU</button>
        <button onClick={changeLocale} name='en'>EN</button>
      </div>
    </div>
  </footer>;
};

export default Footer;
