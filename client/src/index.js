import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import { YMInitializer } from 'react-yandex-metrika';
import store from 'store';

import 'typeface-roboto';
import './index.css';

import App from './App';
import Start from './pages/start';
import Locale from './locale';
// Import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Provider store={store}>
    <YMInitializer accounts={[53679490]}/>
    <Router basename="/" history={history}>
      <Switch>
        <Route exact path="/" component={Start}/>
        <Route exact path="/ru" component={Locale}/>
        <Route exact path="/en" component={Locale}/>
        <Route component={App}/>
      </Switch>
    </Router>
  </Provider>,
  document.querySelector('#root'),
);

// RegisterServiceWorker();
