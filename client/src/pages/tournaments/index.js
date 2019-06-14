import React, { Component } from 'react';
import moment from 'moment';
import groupBy from 'lodash/groupBy';

import io from 'socket.io-client';

import TournamentService from 'services/tournamentService';
import UserService from 'services/userService';
import NotificationService from 'services/notificationService';

import NewTournamentModal from 'components/new-tournament';
import NewStreamerTournamentModal from 'components/new-streamer-tournament';
import TournamentCard from 'components/tournament-card';
import Button from 'components/button';

import style from './style.module.css';
import classnames from 'classnames/bind';
import i18n from 'i18n';

const cx = classnames.bind(style);

class Tournaments extends Component {
  constructor() {
    super();
    this.socket = io();
    this.userService = new UserService({
      onUpdate: () => this.updateProfile(),
    });
    this.tournamentService = new TournamentService();
    this.notificationService = new NotificationService();
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

  isEscoreTournament = (tournamentName) => {
    const escoreTournamentsNames = ['LPL', 'LCS', 'LCK'];
    const tournamentNameFirstWord = tournamentName.split(' ')[0];

    return escoreTournamentsNames.includes(tournamentNameFirstWord);
  }

  groupTournamentsByOrigin = (tournaments) => {
    let escoreTournaments = [];
    let streamerTournaments = [];

    tournaments.forEach(item => {
      if (this.isEscoreTournament(item[0].tournament.name)) {
        escoreTournaments.push(item);
      } else {
        streamerTournaments.push(item);
      }
    });

    return streamerTournaments.concat(escoreTournaments);
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const fantasyTournaments = await this.tournamentService.getFantasyTournaments();

    let groupedFantasyTournaments = Object.values(groupBy(fantasyTournaments.tournaments, 'tournament.name'));
    groupedFantasyTournaments = this.groupTournamentsByOrigin(groupedFantasyTournaments);
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

  toggleNewStreamerTournamentModal = () => {
    if (this.state.profile.user.summonerName === '') {
      this.notificationService.showSingleNotification({
        type: 'warning',
        shouldBeAddedToSidebar: false,
        message: i18n.t('notifications.warnings.empty_summoner_name'),
        link: `profile`,
      });
    } else {
      this.setState({
        isStreamerTournamentModalShown: !this.state.isStreamerTournamentModalShown,
      });
    }
  }


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

  render() {

    const isStreamer = this.state.profile.user.isStreamer;

    return <div className={style.tournaments}>
      <div className={style.content}>
        <div className={cx(style.section, { [style.is_preloader_card]: this.state.isLoading })}>

          {this.state.groupedFantasyTournaments.map(item => {
            return <div key={item[0]._id} className={style.tournament_group}>
              <h3 className={style.title}>{item[0].tournament.name}</h3>
              <div className={style.tournaments_cards}>
                {item.map(element => <TournamentCard key={element._id} {...element} />)}
              </div>
            </div>;
          })}

          {this.state.profile && this.state.profile.user && isStreamer &&
            <Button
              appearance="_icon-accent"
              className={cx(style.button, "pulse")}
              icon={<i className="material-icons">add</i>}
              onClick={this.toggleNewStreamerTournamentModal}
            />
          }
        </div>
      </div>

      {this.state.isAddTournamentModalShown &&
        <NewTournamentModal onClose={this.toggleNewTournamentModal} />
      }

      {this.state.isStreamerTournamentModalShown &&
        <NewStreamerTournamentModal closeModal={this.toggleNewStreamerTournamentModal} />
      }
    </div>;
  }
}

export default Tournaments;