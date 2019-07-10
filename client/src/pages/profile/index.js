import React, { Component } from 'react';

import Button from 'components/button';
import Preloader from 'components/preloader';

import style from './style.module.css';
import i18n from 'i18n';
import classnames from 'classnames/bind';

const cx = classnames.bind(style);

class Profile extends Component {
  state = {
    formData: {
      username: '',
      email: '',
      about: '',
      photo: '',
      summonerName: '',
      isStreamer: '',
      lolApiKey: '',
    },
    locale: '',
    isLoading: true,
  };

  handleChange = event => {
    event.preventDefault();
    const { formData } = this.state;
    const { name, value } = event.target;
    formData[name] = value;
    this.setState({ formData });
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    const locale = localStorage.getItem('_pgg_locale');
  }

  changeLocale = event => {
    this.setState({
      locale: event.target.name,
    });

    localStorage.setItem('_pgg_locale', event.target.name);

    i18n.changeLanguage(event.target.name);
  }

  handleSubmit = async event => {
    event.preventDefault();
  }

  render() {
    const LOCALES = ['en', 'ru'];

    return (
      <div className="container">
        <div className={style.home_page}>
          <main>
            <div className={style.content}>
              <div className={cx(style.form_container, { [style.is_preloader_form]: this.state.isLoading })}>
                <form className={cx(style.form)} onSubmit={this.handleSubmit}>
                  <div>
                    <label>{i18n.t('username')}</label>
                    <input
                      type="text"
                      name="username"
                      value={this.state.formData.username}
                      onChange={this.handleChange}
                    />
                  </div>

                  {this.state.formData.isStreamer && (
                    <>
                      <div>
                        <label>{i18n.t('summonerName')}</label>
                        <input
                          type="text"
                          name="summonerName"
                          value={this.state.formData.summonerName}
                          onChange={this.handleChange}
                        />
                      </div>
                      <div>
                        <label>{i18n.t('lolApiKey')}</label>
                        <input
                          type="text"
                          name="lolApiKey"
                          value={this.state.formData.lolApiKey}
                          onChange={this.handleChange}
                        />
                      </div>
                    </>
                  )
                  }

                  <div>
                    <label>{i18n.t('email')}</label>
                    <input
                      disabled
                      type="text"
                      name="email"
                      value={this.state.formData.email}
                      onChange={this.handleChange}
                    />
                  </div>

                  <div>
                    <label>Photo</label>
                    <input
                      type="text"
                      name="photo"
                      value={this.state.formData.photo}
                      onChange={this.handleChange}
                    />
                  </div>

                  <div>
                    <label>{i18n.t('about')}</label>
                    <textarea
                      name="about"
                      value={this.state.formData.about}
                      onChange={this.handleChange}
                    />
                  </div>

                  <div className={style.localization}>
                    <label>{i18n.t('settings_locale')}</label>
                    <div>
                      {
                        LOCALES.map(locale => (
                          <div key={locale} className={style.item}>
                            <label>{locale.toUpperCase()}</label>
                            <input
                              type="radio"
                              name={locale}
                              value={this.state.locale}
                              checked={this.state.locale === locale}
                              onChange={this.changeLocale}
                            />
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  <Button
                    appearance="_basic-accent"
                    text={i18n.t('save_changes')}
                  />
                </form>
              </div>
            </div>

            {this.state.isLoading &&
              <Preloader/>
            }
          </main>
        </div>
      </div>
    );
  }
}

export default Profile;
