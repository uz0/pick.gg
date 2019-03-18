import React, { Component } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import Tournaments from './tournaments';
import style from './style.module.css';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {

  }

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
                <NavLink to="/dashboard/champions">Champions</NavLink>
                <NavLink to="/dashboard/matches">Matches</NavLink>
                <NavLink to="/dashboard/results">Match results</NavLink>
              </nav>
            </div>
          </div>

          <div className={style.section}>
            <Switch>
              <Route path="/dashboard/tournaments" component={Tournaments} />
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
