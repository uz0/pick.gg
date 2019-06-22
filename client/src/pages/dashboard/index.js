import React, { Component } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import Tournaments from './tournaments';
import Users from './users';
import style from './style.module.css';
import i18n from 'i18n';

class Dashboard extends Component {
  render() {
    return (
      <div className="container">
        <div className={style.dashboard}>
          <h1 className={style.title}>{i18n.t('dashboard')}</h1>

          <div className={style.content}>
            <div className={style.sidebar}>
              <div className={style.menu}>
                <h4>{i18n.t('menu')}</h4>
                <nav>
                  <NavLink to="/dashboard/tournaments">{i18n.t('tournaments')}</NavLink>
                  <NavLink to="/dashboard/users">{i18n.t('users')}</NavLink>
                </nav>
              </div>
            </div>

            <div className={style.section}>
              <Switch>
                <Route path="/dashboard/tournaments" component={Tournaments}/>
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
