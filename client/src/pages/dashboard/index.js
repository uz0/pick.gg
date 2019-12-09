import React, { Component } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import i18n from 'i18n';

import Users from './users';
import Rewards from './rewards';
import style from './style.module.css';

class Dashboard extends Component {
  render() {
    return (
      <div className="container">
        <div className={style.dashboard}>
          <h1 className={style.title}>{i18n.t('dashboard')}</h1>

          <div className={style.content}>
            <div className={style.navigation}>
              <NavLink to="/dashboard/rewards">{i18n.t('rewards')}</NavLink>
              <NavLink to="/dashboard/users">{i18n.t('users')}</NavLink>
            </div>
            <div className={style.section}>
              <Switch>
                <Route path="/dashboard/rewards" component={Rewards}/>
                <Route path="/dashboard/users" component={Users}/>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
