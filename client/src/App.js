import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import TopMenuComponent from './components/top-menu-component';
import Footer from './components/footer';
import NotificationContainer from './components/old-notification/notification-container';
import NotificationSidebar from './components/old-notification/notification-sidebar';
import Dashboard from './pages/dashboard';
import Tournaments from './pages/tournaments';
import Tournament from './pages/tournament';
import Profile from './pages/profile';
import User from './pages/user';
import MyTournaments from './pages/mytournaments';
import Rewards from './pages/reward';
import Rating from './pages/rating';
import './i18n';

const App = ({ history }) => (
  <Fragment>
    <NotificationSidebar/>
    <NotificationContainer/>

    <TopMenuComponent history={history}/>

    <div className="container">
      <Switch>
        <Route path="/dashboard" component={Dashboard}/>
        <Route exact path="/tournaments" component={Tournaments}/>
        <Route exact path="/tournaments/:id" component={Tournament}/>
        <Route exact path="/profile" component={Profile}/>
        <Route exact path="/user/:id" component={User}/>
        <Route exact path="/mytournaments" component={MyTournaments}/>
        <Route exact path="/rewards" component={Rewards}/>
        <Route exact path="/rating" component={Rating}/>
        <Redirect to="/"/>
      </Switch>
    </div>

    <Footer/>
  </Fragment>
);

export default App;
