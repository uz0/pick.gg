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
      locale: '',
    };
  }
  async componentDidMount(){
    const locale = localStorage.getItem('_pgg_locale');

    this.setState({
      locale,
    });
  }
  changeLocale = (event) => {
    this.setState({
      locale: event.target.name,
    });

    localStorage.setItem('_pgg_locale', event.target.name);

    i18n.changeLanguage(event.target.name);
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
              <p>{i18n.t('contact_us')}:</p>

              <NavLink to="#">
                <DiscordIcon />
              </NavLink>
            </div>
          </div>

          {/* <div className={style.change_lng}>
            <NavLink to="/ru">RU</NavLink>

            <NavLink to="/en">EN</NavLink>
          </div> */}
          <div  className={style.change_lng}>
                    <div className={style.item}>
                      <label>Ru
                      <input
                        name='ru'
                        type='radio'
                        value={this.state.locale}
                        checked={this.state.locale === 'ru'}
                        onChange={this.changeLocale}
                      />
                      </label>
                      
                    </div>
                    <div className={style.item}>
                      <label>En
                      <input
                        name='en'
                        type='radio'
                        value={this.state.locale}
                        checked={this.state.locale === 'en'}
                        onChange={this.changeLocale}
                      />
                      </label>
                      
                    </div>
                  </div>
               

        </div>
      </div>
    );
  }
}

export default Footer;
