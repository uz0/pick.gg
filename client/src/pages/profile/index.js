import React, { Component } from 'react';

import NotificationService from 'services/notificationService';
import UserService from 'services/userService';

// import io from "socket.io-client";

import Button from 'components/button';

import style from './style.module.css';
import i18n from 'i18n';
import classnames from 'classnames/bind';

const cx = classnames.bind(style);

class Profile extends Component {
  constructor() {
    super();

    this.userService = new UserService();
    this.notificationService = new NotificationService();

    this.state = {
      formData: {
        username: '',
        email: '',
        about: '',
        photo: '',
        summonerName: '',
        isStreamer: '',
      },
      locale: '',
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
        summonerName: userData.user.summonerName,
        isStreamer: userData.user.isStreamer,
      },
      locale,
      isLoading: false,
    });
  }

  changeLocale = (event) => {
    this.setState({
      locale: event.target.name,
    });

    localStorage.setItem('_pgg_locale', event.target.name);

    i18n.changeLanguage(event.target.name);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { formData } = this.state;

    this.userService.updateProfile(formData);
    this.notificationService.showSingleNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: i18n.t('update_data'),
    });
  }

  render() {
    return (
      <div className={style.home_page}>
        <main>
          {/* <h1>{i18n.t('setting_profile')} – {this.state.formData.username}</h1> */}

          <div className={style.content}>
            {/* <ProfileSidebar withData={false} /> */}

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

                {this.state.formData.isStreamer && <div>
                    <label>{i18n.t('summonerName')}</label>
                    <input
                      type="text"
                      name="summonerName"
                      value={this.state.formData.summonerName}
                      onChange={this.handleChange}
                    />
                  </div>
                }

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