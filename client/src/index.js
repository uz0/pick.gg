import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';

import 'typeface-roboto';
import './index.css';

import App from './App';
import Start from './pages/start';
import Locale from './locale';
// import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router basename='/' history={history}>
    <Switch>
      <Route exact path='/' component={Start} />
      <Route exact path='/ru' component={Locale} />
      <Route exact path='/en' component={Locale} />
      <Route component={App} />
    </Switch>
  </Router>,
  document.getElementById('root'),
);

// registerServiceWorker();
