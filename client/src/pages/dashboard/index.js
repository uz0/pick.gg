import React, { Component } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import Tournaments from './tournaments';
import FantasyTournaments from './fantasy-tournaments';
import Rules from './rules';
import Champions from './champions';
import Users from './users';
import style from './style.module.css';

class Dashboard extends Component {
  constructor() {
    super();
  }

  state = {
    isLoading: false,
    fantasyTournaments: [],
    realTournaments: [],
  };

  render() {
    return (
      <div className={style.dashboard}>
        <h1 className={style.title}>Dashboard</h1>
        
        <div className={style.content}>
          <div className={style.sidebar}>
            <div className={style.menu}>
              <h4>Menu</h4>
              <nav>
                <NavLink to="/dashboard/tournaments">Tournaments</NavLink>
                <NavLink to="/dashboard/rules">Tournament rules</NavLink>
                <NavLink to="/dashboard/fantasy">Fantasy Tournaments</NavLink>
                <NavLink to="/dashboard/champions">Champions</NavLink>
                <NavLink to="/dashboard/users">Users</NavLink>
              </nav>
            </div>
          </div>

          <div className={style.section}>
            <Switch>
              <Route path="/dashboard/tournaments" component={Tournaments} />
              <Route path="/dashboard/rules" component={Rules} />
              <Route path="/dashboard/fantasy" component={FantasyTournaments} />
              <Route path="/dashboard/champions" component={Champions} />
              <Route path="/dashboard/users" component={Users} />
              {/* <Route exact path="/tournaments/:id" component={Tournament} />
              <Route exact path="/tournaments/:id" component={Tournament} />
              <Route exact path="/tournaments/:id" component={Tournament} /> */}
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
