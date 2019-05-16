import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import { YMInitializer } from 'react-yandex-metrika';

import 'typeface-roboto';
import './index.css';

import App from './App';
import Start from './pages/start';
import Locale from './locale';
// import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <>
    <Router basename='/' history={history}>
      <Switch>
        <Route exact path='/' component={Start} />
        <Route exact path='/ru' component={Locale} />
        <Route exact path='/en' component={Locale} />
        <Route component={App} />
      </Switch>
    </Router>
    <YMInitializer accounts={[53679490]} />
  </>,
  document.getElementById('root'),
);

// registerServiceWorker();
