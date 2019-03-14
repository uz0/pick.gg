import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import AuthService from '../../services/authService';
import UserService from '../../services/userService';
import TournamentService from '../../services/tournamentService';

import Input from '../../components/input';
import Select from 'components/select'
import NewTournament from '../../components/new-tournament';
import Preloader from '../../components/preloader';

import style from './style.module.css';

class App extends Component {
  constructor() {
    super();
    this.AuthService = new AuthService();
    this.UserService = new UserService();
    this.TournamentService = new TournamentService();
  }

  state = {
    newTournamentIsOpen: false,
    tournaments: [],
    fantasyTournaments: [],
    tournaments: [],
    entryFilter: '',
    dateFilter: '',
    loader: true,
  }

  preloader = () =>
    this.setState({
      loader: false,
    })

  openNewTournament = () =>
    this.setState({
      newTournamentIsOpen: true,
    })

  closeNewTournament = () =>
    this.setState({
      newTournamentIsOpen: false,
    })

  filterByDate = async event => {
    if (event.target.value === '') {
      let fantasyTournaments = await this.TournamentService.getFantasyTournaments();

      this.setState({
        fantasyTournaments: fantasyTournaments.tournaments,
        dateFilter: '',
      });

      return;
    }

    this.setState(
      {
        dateFilter: event.target.value,
      },
      async () => {
        let tournaments = await this.TournamentService.filterTournamentsByDate(this.state.dateFilter);
        this.setState({ fantasyTournaments: tournaments });
      },
    );
  }

  filterByEntry = async e => {
    if (e.target.value <= 0) {
      let fantasyTournaments = await this.TournamentService.getFantasyTournaments();
      this.setState({
        fantasyTournaments: fantasyTournaments.tournaments,
        entryFilter: '',
      });
      return;
    }

    this.setState(
      {
        entryFilter: e.target.value,
      },
      async () => {
        let tournaments = await this.TournamentService.filterTournamentsByEntry(this.state.entryFilter);
        this.setState({ fantasyTournaments: tournaments });
      },
    );
  }

  filterBySelect = async event =>{

    this.setState(
      {
        selectFilter: event.target.value,
      },
      async () => {
        let tournaments = await this.TournamentService.filterTournamentsBySelect(this.state.selectFilter);
        this.setState({ fantasyTournaments: tournaments });
      },
    );
    
  }

  async componentDidMount() {
    const fantasyTournaments = await this.TournamentService.getFantasyTournaments();
    const { tournaments } = await this.TournamentService.getRealTournaments();

    this.setState({
      fantasyTournaments: fantasyTournaments.tournaments,
      tournaments,
    });

    this.preloader();
  }

  render() {
    const isFreeTournament = entry => entry === 0 ? 'Free' : `$${entry}`;
    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />

        {this.state.loader && <Preloader />}
        
        <div className={style.filters}>
          <h2>Tournaments</h2>

          <div className={style.block_filters}>
            <form>
              <Select
                action={this.filterBySelect}
                name="tournament"
                values={this.state.tournaments}
                option={item => `${moment(item.date).format("DD MMM YYYY")} - ${item.name}`}
                label="Tournament (from list)"
              />

              <Input
                type="date"
                name="date"
                label="Date from"
                min="2019-01-01"
                max="2020-12-31"
                action={this.filterByDate}
                value={this.state.filterByDate}
              />
              
              <Input
                type="number"
                value={this.state.entryFilter}
                action={this.filterByEntry}
                label="Minimal entry"
                placeholder="$ 0.1"
                name="entry"
                min="0"
              />
            </form>

            <div className={style.create_tournament}>
              <p>Not satisfied?</p>

              <button onClick={this.openNewTournament} type="submit">
                Create a new tournament
              </button>
            </div>
          </div>
        </div>

        {this.state.newTournamentIsOpen &&
          <NewTournament
            onClose={this.closeNewTournament}
            history={this.props.history}
          />
        }

        <div className={style.tournaments_block}>
          <div className={style.header_tournaments}>
            <p>Tournament Name</p>
            <p>End Date</p>
            <p>Users</p>
            <p>Entry</p>
          </div>

          {this.state.fantasyTournaments.map(item => (
            <NavLink className={style.card_tournament} key={item._id} to={`/tournaments/${item._id}`}>
              <p>{item.name}</p>
              {/* <p>{moment(item.tournament.date).format('MMM DD')}</p> */}
              <p>{item.users.length}</p>
              <p>{isFreeTournament(item.entry)}</p>
            </NavLink>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
