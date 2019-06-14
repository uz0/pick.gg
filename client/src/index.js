import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { YMInitializer } from 'react-yandex-metrika';
import Notification from 'components/notification';
import store, { actions as storeActions } from 'store';
import { isLogged, http } from 'helpers';

import 'typeface-roboto';
import './index.css';

import App from './App';
import Start from './start';
import Home from './pages/home';

export const history = createBrowserHistory();

const render = async () => {
  if (isLogged()) {
    let response = await http('/api/users/me');
    response = await response.json();
    store.dispatch(storeActions.setCurrentUser(response.user));
  }

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
      <Notification />
    </Provider>,

    document.querySelector('#root'),
  );
};

render();

