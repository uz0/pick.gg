import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { YMInitializer } from 'react-yandex-metrika';
import store from 'store';

import 'typeface-roboto';
import './index.css';

import App from './App';
import Start from './start';
import Home from './pages/home';

const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router basename="/" history={history}>
      <Switch>
        <Route exact path="/" component={Start}/>
        <Route exact path="/home" component={Home}/>
        <Route component={App}/>
      </Switch>
    </Router>

    <YMInitializer accounts={[53679490]}/>
  </Provider>,

  document.querySelector('#root'),
);

