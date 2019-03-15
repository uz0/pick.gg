import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import AuthService from '../../services/authService';
import TournamentService from '../../services/tournamentService';

import style from './style.module.css';
import i18n from 'i18n';

class App extends Component {
  constructor() {
    super();
    this.AuthService = new AuthService();
    this.TournamentService = new TournamentService();
    this.state = {
      tournaments: [],
      zeroTournaments: true,
    };
  }

  async componentDidMount() {
    let tournaments = await this.TournamentService.getMyTournaments();

    this.setState({
      tournaments: tournaments.tournaments,
    });
    this.zeroTournaments = () => {
      if (tournaments.tournaments.length !== 0) {
        this.setState({
          zeroTournaments: false,
        });
      }
    };
  }

  render() {
    return (
      <div className={style.home_page}>
        
        <div className={style.main_block}>
          <h2>{i18n.t('my_tournaments')}</h2>
          <div className={style.tournaments_block}>
            {!this.state.zeroTournaments && <div className={style.zero_info}>{i18n.t('zero_tournaments')}</div>}
            
            {!this.state.zeroTournaments && <div className={style.header_tournaments}>
              <p>{i18n.t('tournaments_name')}</p>
              <p>{i18n.t('date')}</p>
              <p>{i18n.t('users')}</p>
              <p>{i18n.t('entry')}</p>
            </div>}

            {this.state.tournaments.map(item => (
              <NavLink key={item._id} to={`/tournaments/${item._id}`}>
                <div className={style.card_tournament}>
                  <p>{item.name}</p>
                  <p>{moment(item.date).format('MMM DD')}</p>
                  <p>{item.users.length}</p>
                  <p>$ {item.entry}</p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
