import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import store from 'store';

import Start from './start';
import Layout from './layout';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Tournaments from './pages/tournaments';
import Tournament from './pages/tournament';
import Profile from './pages/profile';
import User from './pages/user';
import MyTournaments from './pages/mytournaments';
import Rewards from './pages/reward';
import Rating from './pages/rating';
import FAQ from './pages/faq';
import NotFound from './pages/404';

export default () => (
  <Provider store={store}>
    <BrowserRouter basename="/">
      <>
        <Route exact path="/" component={Start}/>
        <Route exact path="/home" component={Home}/>
        <Layout>
          <Switch>
            <Route path="/dashboard" component={Dashboard}/>
            <Route exact path="/tournaments" component={Tournaments}/>
            <Route exact path="/tournaments/:id" component={Tournament}/>
            <Route exact path="/profile" component={Profile}/>
            <Route exact path="/user/:id" component={User}/>
            <Route exact path="/mytournaments" component={MyTournaments}/>
            <Route exact path="/rewards" component={Rewards}/>
            <Route exact path="/rating" component={Rating}/>
            <Route exact path="/faq" component={FAQ}/>

            <Route component={NotFound}/>
          </Switch>
        </Layout>
      </>
    </BrowserRouter>
  </Provider>
);
