import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import 'typeface-roboto';
import './index.css';

import App from './App';
import Login from './pages/login';
import Register from './pages/register';
import Start from './pages/start';
import Locale from './locale';
// import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Start} />
      <Route exact path="/ru" component={Locale} />
      <Route exact path="/en" component={Locale} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route component={App} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);

// registerServiceWorker();
