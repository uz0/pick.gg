import React, { Component } from 'react';

import NotificationService from 'services/notificationService';
import UserService from 'services/userService';
import http from 'services/httpService';

import Button from 'components/button';
import Preloader from 'components/preloader';

import style from './style.module.css';
import i18n from 'i18n';

class Profile extends Component {
  constructor() {
    super();

    this.userService = new UserService();
    this.notificationService = new NotificationService();

    this.state = {
      formData: {
        username: "",
        email: "",
        about: "",
        photo: "",
      },
      locale: "",
      isLoading: true,
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    let formData = this.state.formData;
    let name = event.target.name;
    let value = event.target.value;
    formData[name] = value;
    this.setState({ formData });
  }


  async componentDidMount() {
    this.setState({ isLoading: true });
    const userData = await this.userService.getMyProfile();
    const locale = localStorage.getItem('_pgg_locale');

    this.setState({
      formData: {
        username: userData.user.username,
        email: userData.user.email,
        photo: userData.user.photo,
        about: userData.user.about,
      },
      locale,
      isLoading: false,
    });
  }

  changeLocale = (event) => {
    this.setState({
      locale: event.target.name,
    })

    localStorage.setItem('_pgg_locale', event.target.name);

    i18n.changeLanguage(event.target.name);
  }

  handleSubmit = async e => {
    e.preventDefault();

    let { username, email, photo, about } = this.state.formData;

    await http('/api/users/me', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        photo,
        about,
      }),
    });

    this.notificationService.show(i18n.t('update_data'));
  }

  render() {
    return (
      <div className={style.home_page}>
        <main>
          <h1>{i18n.t('setting_profile')} – {this.state.formData.username}</h1>

          <div className={style.content}>
            {/* <ProfileSidebar withData={false} /> */}

            <div className={style.form_container}>
              <form className={style.form} onSubmit={this.handleSubmit}>
                <div>
                  <label>{i18n.t('username')}</label>
                  <input
                    type="text"
                    name="username"
                    value={this.state.formData.username}
                    onChange={this.handleChange}
                  />
                </div>

                <div>
                  <label>{i18n.t('email')}</label>
                  <input
                    type="text"
                    name="email"
                    value={this.state.formData.email}
                    onChange={this.handleChange}
                    disabled
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
                    <div className={style.item}>
                      <label>Ru</label>
                      <input
                        name='ru'
                        type='radio'
                        value={this.state.locale}
                        checked={this.state.locale === 'ru'}
                        onChange={this.changeLocale}
                        />
                    </div>
                    <div className={style.item}>
                      <label>En</label>
                      <input
                        name='en'
                        type='radio'
                        value={this.state.locale}
                        checked={this.state.locale === 'en'}
                        onChange={this.changeLocale}
                      />
                    </div>
                  </div>
                </div>

                <Button appearance={'_basic-accent'} text={i18n.t('save_changes')} />
              </form>

              {/* <div className={style.password_recovery}>
                <p>You can also change your password if needed</p>
                <a href="/">Change password</a>
              </div> */}
            </div>
          </div>

          {this.state.isLoading &&
            <Preloader />
          }

        </main>
      </div>
    );
  }
}

export default Profile;