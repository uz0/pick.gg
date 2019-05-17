import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import TopMenuComponent from './components/top-menu-component';
import Footer from './components/footer';
import NotificationContainer from './components/notification/notification-container';
import NotificationSidebar from './components/notification/notification-sidebar';
import Dashboard from './pages/dashboard';
import Tournaments from './pages/tournaments';
import Tournament from './pages/tournament';
import Profile from './pages/profile';
import User from './pages/user';
import MyTournaments from './pages/mytournaments';
import './i18n';

const App = ({ history }) => <Fragment>
  <NotificationSidebar />
  <NotificationContainer />

  <TopMenuComponent history={history} />

  <div className="container">
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route exact path="/tournaments" component={Tournaments} />
      <Route exact path="/tournaments/:id" component={Tournament} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/user/:id" component={User} />
      <Route exact path="/mytournaments" component={MyTournaments} />
      <Redirect to="/"/>
    </Switch>
  </div>

  <Footer />
</Fragment>;

export default App;