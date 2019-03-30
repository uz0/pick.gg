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
      },
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
    let userData = await this.userService.getMyProfile();

    this.setState({
      formData: {
        username: userData.user.username,
        email: userData.user.email,
        about: userData.user.about,
      },
      isLoading: false,
    });

  }

  handleSubmit = async e => {
    e.preventDefault();

    let { username, email, about } = this.state.formData;

    await http('/api/users/me', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
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
                  <label>{i18n.t('about')}</label>
                  <textarea
                    name="about"
                    value={this.state.formData.about}
                    onChange={this.handleChange}
                  />
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