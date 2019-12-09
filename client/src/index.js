import React from 'react';
import ReactDOM from 'react-dom';
import MobileDetect from 'mobile-detect';
import moment from 'moment';

import { isLogged, http } from 'helpers';

import store, { actions as storeActions } from 'store';
import 'moment/locale/ru';

import 'typeface-roboto';
import './index.css';

import Routes from './routes';

const lang = localStorage.getItem('_pgg_locale') || 'en';
moment.locale(lang);

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = Boolean(md.mobile());

store.dispatch(storeActions.setDevice(isMobile ? 'touch' : 'desktop'));

const init = async () => {
  console.log('init');
  console.log(process.env);
  if (process.env.NODE_ENV === 'testing') {
    console.log('testing');
    localStorage.setItem('auth-test-username', 'test1');
  }

  if (isLogged()) {
    let response = await http('/api/users/me');
    response = await response.json();
    store.dispatch(storeActions.setCurrentUser(response));
  }

  ReactDOM.render(
    <Routes/>,
    document.querySelector('#root'),
  );
};

init();

