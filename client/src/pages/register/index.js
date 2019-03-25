import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import i18n from 'i18next';

import AuthService from '../../services/authService';
import NotificationService from '../../services/notificationService';
import NotificationContainer from '../../components/notification/notification-container';

import Input from '../../components/input';
import Button from '../../components/button';
import style from '../../components/style.module.css';

class Register extends Component {
  constructor() {
    super();

    this.notificationService = new NotificationService();
    this.authService = new AuthService();

    this.state = {
      username: '',
      password: '',
    };
  }

  componentWillMount() {}

  handleChange = (event, input) => this.setState({ [input]: event.target.value });

  submitForm = async event => {
    event.preventDefault();

    let { username, password, email, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.notificationService.show(i18n.t('equal_password'));
    }
    if (!username || !password || !confirmPassword || !email ){
      this.notificationService.show(i18n.t('empty_field'));
    }
    await fetch('/api/authentication/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then(response => response.json())
      .then(async({ success, message }) => {
        if (!success) {
          this.notificationService.show(message);
          return;
        }
        await this.authService.login(username, password);
        this.props.history.replace('/tournaments');
      });
  }

  render() {
    return (
      <div className={style.login_page}>
        <NotificationContainer />

        <div className={style.form_block}>
          <div className={style.info_block}>{i18n.t('register')}</div>

          <form onSubmit={this.submitForm}>
            <Input
              label={i18n.t('username')}
              value={this.state.username}
              onInput={(event) => this.handleChange(event, 'username')}
            />

            <Input
              label={i18n.t('email')}
              type="email"
              value={this.state.email}
              onInput={(event) => this.handleChange(event, 'email')}
            />

            <Input
              label={i18n.t('password')}
              type="password"
              value={this.state.password}
              onInput={(event) => this.handleChange(event, 'password')}
            />
            
            <Input
              label={i18n.t('password_confirm')}
              type="password"
              value={this.state.confirmPassword}
              onInput={(event) => this.handleChange(event, 'confirmPassword')}
            />
            
            <div className={style.login_btn}>
              <Button
                appearance={'_basic-accent'}
                type={'submit'}
                text={i18n.t('register_enter')}
              />
              
              <div className={style.bottom_login_btn}>
                <span>{i18n.t('or')} </span>
                <NavLink to="/login">{i18n.t('login_enter')}</NavLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
