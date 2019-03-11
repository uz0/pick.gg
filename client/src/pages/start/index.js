import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import style from './style.module.css';
import AuthService from '../../services/authService';
import i18n from "i18next";

class Start extends Component {
  constructor() {
    super();
    this.auth = new AuthService();

    this.state = {
      username: '',
      password: '',
    };
  }
  
  handleChange = event => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogin = async event => {
    event.preventDefault();
    let success = await this.auth.login(this.state.username, this.state.password);
    if (success) this.props.history.replace('/');
  }

  componentWillMount() {
    if (this.auth.isLoggedIn()) this.props.history.replace('/');
  }

  render() {
    let startButtonLink = localStorage.getItem('JWS_TOKEN') ? "/tournaments" : "/login";
    return (
      <div className={style.login_page}>
        <div className={style.bg_wrap} />
        
        <div className={style.start_content}>
          <h1>Fantasy league</h1>
          
          <div className={style.start_btns}>
            <NavLink to={startButtonLink}>
              <button>{i18n.t('start')}</button>
            </NavLink>
            
            <div>
              <span>{i18n.t('or')} </span>
              <NavLink to="/register">{i18n.t('register')}</NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Start;
