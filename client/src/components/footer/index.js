import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as DiscordIcon } from 'assets/icon-discord.svg';

import style from './style.module.css';
import i18n from 'i18n';

class Footer extends Component {
  constructor() {
    super();
    this.state = {
      profile: {
        user: {},
      },
    };
  }

  render() {
    return (
      <div className={style.footer}>
        <div className={style.footer_wrap}>
          <div className={style.one_row}>
            <div className={style.info_footer}>

              <p>© 2019 uz0</p>

              <NavLink to="#">{i18n.t('terms_and_agreement')}</NavLink>
            </div>

            <div className={style.contact}>
              <p>Contact us:</p>

              <NavLink to="#">
                <DiscordIcon />
              </NavLink>
            </div>
          </div>

          <div className={style.change_lng}>
            <NavLink to="/ru">RU</NavLink>

            <NavLink to="/en">EN</NavLink>
          </div>

        </div>
      </div>
    );
  }
}

export default Footer;
