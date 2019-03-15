import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import i18n from 'i18next'

import AuthService from '../../services/authService';
import NotificationService from '../../services/notificationService';
import NotificationContainer from '../../components/notification/notification-container';

import Input from '../../components/input';
import Button from '../../components/button';
import style from '../../components/style.module.css';

class Register extends Component {
  constructor() {
    super();

    this.NotificationService = new NotificationService();

    this.auth = new AuthService();
    this.state = {
      username: '',
      password: '',
    };
  }

  componentWillMount() {}

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  submitForm = async event => {
    event.preventDefault();

    let { username, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.NotificationService.show("Passwords must be equal");
    }
    if ( username === "" || password === "" || confirmPassword === "" ){
      this.NotificationService.show("Error empty field");
    }
    await fetch('/api/authentication/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(response => response.json())
      .then(({ success, message }) => {
        if (!success) {
          this.NotificationService.show(message)
        }
        if (success){
          this.props.history.replace('/tournaments');
        }
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
              name="username"
              type="text"
              action={this.onChange('username')}
              autofocus
            />
            
            <Input
              label={i18n.t('password')}
              name="password"
              type="password"
              action={this.onChange('password')}
            />
            
            <Input
              label={i18n.t('password_confirm')}
              name="confirmPassword"
              type="password"
              action={this.onChange('confirmPassword')}
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
