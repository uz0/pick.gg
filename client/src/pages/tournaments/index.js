import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';

import io from "socket.io-client";

import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import UserService from 'services/userService';

import NewTournamentModal from 'components/new-tournament';
import NewStreamerTournamentModal from 'components/new-streamer-tournament';
import TournamentCard from 'components/tournament-card';

import i18n from 'i18n';

import style from './style.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(style);

class Tournaments extends Component {
  constructor() {
    super();
    this.notificationService = new NotificationService();
    this.socket = io();
    this.userService = new UserService({
      onUpdate: () => this.updateProfile(),
    });
    this.tournamentService = new TournamentService();
  }

  state = {
    isLoading: false,
    isAddTournamentModalShown: false,
    isStreamerTournamentModalShown: false,
    groupedFantasyTournaments: [],
    fantasyTournaments: [],
    realTournaments: [],
    profile: {
      user: {},
    },

    filters: {
      tournament: '',
      date: '',
      entry: null,
    },
  };

  updateProfile = async () => {
    let profile = await this.userService.getMyProfile();
    this.setState({ profile });
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const fantasyTournaments = await this.tournamentService.getFantasyTournaments();
    const groupedFantasyTournaments = Object.values(groupBy(fantasyTournaments.tournaments, 'tournament.name'));
    const realTournaments = await this.tournamentService.getRealTournaments();

    this.setState({
      groupedFantasyTournaments,
      fantasyTournaments: fantasyTournaments.tournaments,
      realTournaments: realTournaments.tournaments,
      isLoading: false,
    });

    this.socket.on("fantasyTournamentCreated", ({ newTournamentPopulated }) => {

      this.setState({
        fantasyTournaments: [
          ...this.state.fantasyTournaments,
          newTournamentPopulated,
        ],
      });
    });
    this.updateProfile();
  }

  // componentWillUnmount() {
    // console.log('tournaments are unmounted');
    // this.socket.disconnect();
  // }

  toggleNewTournamentModal = () => this.setState({ isAddTournamentModalShown: !this.state.isAddTournamentModalShown });

  toggleNewStreamerTournamentModal = () => this.setState({ isStreamerTournamentModalShown: !this.state.isStreamerTournamentModalShown });

  tournamentsDefaultSorting = (prev, next) => moment(next.tournament.date).format('YYYYMMDD') - moment(prev.tournament.date).format('YYYYMMDD');

  onTournamentFilterChange = event => this.setState({
    filters: {
      ...this.state.filters,
      tournament: event.target.value,
    },
  });

  onDateFilterChange = event => this.setState({
    filters: {
      ...this.state.filters,
      date: event.target.value,
    },
  });

  onEntryFilterChange = event => this.setState({
    filters: {
      ...this.state.filters,
      entry: parseInt(event.target.value, 10),
    },
  });

  renderTournamentGroupTitle = () => {};
  renderTournamentCard = () => {};

  render() {
    let tournaments = this.state.fantasyTournaments;

    if (this.state.filters.tournament) {
      tournaments = filter(tournaments, fantasy => fantasy.tournament._id === this.state.filters.tournament);
    }

    if (this.state.filters.date) {
      tournaments = filter(tournaments, fantasy => moment(fantasy.tournament.date).isAfter(moment(this.state.filters.date)));
    }

    if (this.state.filters.entry) {
      tournaments = filter(tournaments, fantasy => fantasy.entry >= this.state.filters.entry);
    }

    return <div className={style.tournaments}>
      <div className={style.content}>
        <div className={cx(style.section,{ [style.is_preloader_card]: this.state.isLoading })}>

          {this.state.groupedFantasyTournaments.map(item => {
            return <div key={item[0]._id} className={style.tournament_group}>
              <h3 className={style.title}>{item[0].tournament.name}</h3>
              <div className={style.tournaments_cards}>
                {item.map(element => <TournamentCard key={element._id} {...element} />)}
              </div>
            </div>
          })}

          {this.state.profile.user.isAdmin &&
            <button className={style.button} onClick={this.toggleNewTournamentModal}>
              <i className="material-icons">add</i>
            </button>}

          {this.state.profile.user.isStreamer &&
            <button className={style.button} onClick={this.toggleNewStreamerTournamentModal}>
              <i className="material-icons">add</i>
              Стример
            </button>}
        </div>
      </div>

      {this.state.isAddTournamentModalShown &&
        <NewTournamentModal onClose={this.toggleNewTournamentModal} />
      }

      {this.state.isStreamerTournamentModalShown &&
        <NewStreamerTournamentModal onClose={this.toggleNewStreamerTournamentModal} />
      }
    </div>;
  }
}

export default Tournaments;