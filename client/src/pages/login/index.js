import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import i18n from 'i18next'

import GoogleLogin from 'react-google-login';
import AuthService from '../../services/authService';
import NotificationService from '../../services/notificationService';
import NotificationContainer from '../../components/notification/notification-container';

import Input from '../../components/input';
import Button from '../../components/button';
import config from 'config';

import style from '../../components/style.module.css';

class Login extends Component {
  constructor() {
    super();

    this.auth = new AuthService();
    this.NotificationService = new NotificationService();

    this.state = {
      username: '',
      password: '',
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogin = async event => {
    event.preventDefault();
    const authRequest = await this.auth.login(this.state.username, this.state.password);
    if (authRequest.success){
      this.props.history.replace('/tournaments');
    } else {
      this.NotificationService.show(authRequest.message);
    }
  }

  onSuccessGoogleLogin = async data => {
    const profile = data.getBasicProfile();
    const email = profile.getEmail();

    const authRequest = await this.auth.oauthLogin(email);

    if (authRequest.success){
      this.props.history.replace('/tournaments');
    } else {
      this.NotificationService.show(authRequest.message);
    }
  };

  onFailureGoogleLogin = async data => {
    this.NotificationService.show(i18n.t(data.error));
  };

  componentWillMount() {
    if (this.auth.isLoggedIn()) this.props.history.replace('/');
  }

  render() {
    return (
      <div className={style.login_page}>
        <NotificationContainer />
        
        <div className={style.form_block}>
          <div className={style.info_block}>{i18n.t('login')}</div>

          <form onSubmit={this.handleLogin}>
            <Input
              id="username"
              label={i18n.t('username')}
              name="username"
              placeholder={i18n.t('login')}
              type="text"
              autofocus
              value={this.state.username}
              action={this.handleChange}
            />
            
            <Input
              id="password"
              label={i18n.t('password')}
              name="password"
              placeholder="password"
              type="password"
              value={this.state.password}
              action={this.handleChange}
            />
            
            <div className={style.login_btn}>
              <Button
                appearance={'_basic-accent'}
                type={'submit'}
                text={i18n.t('start')}
              />
              
              <div className={style.bottom_login_btn}>
                <span>{i18n.t('or')} </span>
                <NavLink to="/register">{i18n.t('register_enter')}</NavLink>
              </div>
            </div>

            <div className={style.social}>
              <GoogleLogin
                clientId={config.google_client_id}
                buttonText="Google"
                onSuccess={this.onSuccessGoogleLogin}
                onFailure={this.onFailureGoogleLogin}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
