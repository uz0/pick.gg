import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import i18n from 'i18next'

import AuthService from '../../services/authService';
import NotificationService from '../../services/notificationService';
import NotificationContainer from '../../components/notification/notification-container';

import Input from '../../components/input';
import Button from '../../components/button';
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

  componentWillMount() {
    if (this.auth.isLoggedIn()) this.props.history.replace('/');
    
  }

  render() {
    return (
      <div className={style.login_page}>
        <NotificationContainer />
        
        <div className={style.bg_wrap} />

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
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
