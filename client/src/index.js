import React from 'react';
import ReactDOM from 'react-dom';
import store, { actions as storeActions } from 'store';
import { isLogged, http } from 'helpers';
import MobileDetect from 'mobile-detect';

import 'typeface-roboto';
import './index.css';

import Routes from './routes';

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = Boolean(md.mobile());

store.dispatch(storeActions.setDevice(isMobile ? 'touch' : 'desktop'));

const init = async () => {
  if (isLogged()) {
    let response = await http('/api/users/me');
    response = await response.json();
    store.dispatch(storeActions.setCurrentUser(response.user));
  }

  ReactDOM.render(
    <Routes/>,
    document.querySelector('#root'),
  );
};

init();

