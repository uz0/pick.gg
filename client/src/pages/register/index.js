import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

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
        // console.log(response)

        if (!success) {
          // TODO RENDER ERROR!
          console.error(message);
        }
        if (success){
          this.props.history.replace('/tournaments');
        }
      });
  }

  render() {
    return (
      <div className={style.login_page}>
        <div className={style.bg_wrap} />

        <NotificationContainer />

        <div className={style.form_block}>
          <div className={style.info_block}>Register</div>

          <form onSubmit={this.submitForm}>
            <Input
              label="Login"
              name="username"
              type="text"
              action={this.onChange('username')}
              autofocus
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              action={this.onChange('password')}
            />
            
            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              action={this.onChange('confirmPassword')}
            />
            
            <div className={style.login_btn}>
              <Button
                appearance={'_basic-accent'}
                type={'submit'}
                text={'Register'}
              />
              
              <div className={style.bottom_login_btn}>
                <span>or </span>
                <NavLink to="/login">login</NavLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
