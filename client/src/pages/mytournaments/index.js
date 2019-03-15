import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import AuthService from '../../services/authService';
import TournamentService from '../../services/tournamentService';

import Table from 'components/table';
import Preloader from 'components/preloader';

import style from './style.module.css';
import i18n from 'i18n';

const tournamentsTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: 250,
  },

  date: {
    text: i18n.t('date'),
    width: 100,
  },

  users: {
    text: i18n.t('users'),
    width: 80,
  },

  entry: {
    text: i18n.t('entry'),
    width: 80,
  },
};

class App extends Component {
  constructor() {
    super();
    this.AuthService = new AuthService();
    this.TournamentService = new TournamentService();
    this.state = {
      tournaments: [],
      isLoading: false,
      zeroTournaments: true,
      fantasyTournaments: [],
    };
  }

  async componentDidMount() {
    let tournaments = await this.TournamentService.getMyTournaments();
    const fantasyTournaments = await this.TournamentService.getFantasyTournaments();
    console.log(tournaments.tournaments)
    this.setState({
      tournaments: tournaments.tournaments,
      fantasyTournaments: fantasyTournaments.tournaments,
    });
    this.zeroTournaments = () => {
      if (tournaments.tournaments.length !== 0) {
        this.setState({
          zeroTournaments: false,
        });
      }
    };
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const formattedDate = moment(item.tournament.date).format('MMM DD');
    const entry = item.entry === 0 ? 'Free' : item.entry;

    return <NavLink to={`/tournaments/${item._id}`} className={className}>
      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.name.width }}>
        <span className={textClass}>{item.name}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.date.width }}>
        <span className={textClass}>{formattedDate}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.users.width }}>
        <span className={textClass}>{item.users.length}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.entry.width }}>
        <span className={textClass}>{entry}</span>
      </div>
    </NavLink>;
  }

  render() {
    let tournaments = this.state.tournaments;
    console.log(tournaments)
    return (
      <div className={style.home_page}>
        <div className={style.main_block}>
          <h2>My tournaments</h2>

          <div className={style.section}>
            <Table
              captions={tournamentsTableCaptions}
              items={tournaments}
              className={style.table}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
              emptyMessage={i18n.t('not_yet_tournaments')}
            />
          </div>

          {this.state.isLoading &&
            <Preloader />
          }
        </div>
      </div>
    );
  }
}

export default App;
