import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import filter from 'lodash/filter';

import io from "socket.io-client";

import TournamentService from 'services/tournamentService';

import Input from 'components/filters/input';
import Select from 'components/filters/select';
import Table from 'components/table';
import NewTournamentModal from 'components/new-tournament';
import Preloader from 'components/preloader';
import i18n from 'i18n';
import classnames from 'classnames/bind';

import style from './style.module.css';

const cx = classnames.bind(style);

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

class Tournaments extends Component {
  constructor() {
    super();
    this.tournamentService = new TournamentService();
  }

  state = {
    isLoading: false,
    isAddTournamentModalShown: false,
    fantasyTournaments: [],
    realTournaments: [],

    filters: {
      tournament: '',
      date: '',
      entry: null,
    },
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const fantasyTournaments = await this.tournamentService.getFantasyTournaments();
    const realTournaments = await this.tournamentService.getRealTournaments();

    this.setState({
      fantasyTournaments: fantasyTournaments.tournaments,
      realTournaments: realTournaments.tournaments,
      isLoading: false,
    });

    this.socket = io();
    // newTournament без популейта, вообще видно делалось больным человеком, осоторожнее с git blame
    // увидите автора, бегите
    this.socket.on("fantasyTournamentCreated", (newTournament) => {

      this.setState({
        fantasyTournaments: [
          newTournament,
          ...this.state.fantasyTournaments,
        ],
      });
    });
  }

  toggleNewTournamentModal = () => this.setState({ isAddTournamentModalShown: !this.state.isAddTournamentModalShown });

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

  renderRow = ({ className, itemClass, textClass, item }) => {
    console.log(item, 'item');
    const formattedDate = moment(item.tournament.date).format('MMM DD');
    const today = moment().format('MMM DD')
    const entry = item.entry === 0 ? 'Free' : item.entry;
    const disableUrl = moment(formattedDate).isAfter(today);
    const disableUrlStyle = moment(today).isAfter(formattedDate);

    return <NavLink to={`/tournaments/${item._id}`} className={cx( className, {'disable_url': disableUrlStyle})} key={item._id}>
      <div className={itemClass} style={{'--width': tournamentsTableCaptions.name.width}}>
        <span className={textClass}>{item.name}</span>
      </div>

      <div className={itemClass} style={{'--width': tournamentsTableCaptions.date.width}}>
        <span className={textClass}>{formattedDate}</span>
      </div>

      <div className={itemClass} style={{'--width': tournamentsTableCaptions.users.width}}>
        <span className={textClass}>{item.users.length}</span>
      </div>

      <div className={itemClass} style={{'--width': tournamentsTableCaptions.entry.width}}>
        <span className={textClass}>{entry}</span>
      </div>
    </NavLink>;
  }

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
      <h2 className={style.title}>{i18n.t('tournaments')}</h2>

      <div className={style.content}>
        <div className={style.sidebar}>
          <Select
            defaultOption={i18n.t('select_tournament')}
            options={this.state.realTournaments}
            label={i18n.t('tournament_list')}
          />

          <Input
            type="date"
            label={i18n.t('date_from')}
            className={style.filter_item}
            onChange={this.onDateFilterChange}
          />

          <Input
            type="number"
            label={i18n.t('minimal_entry')}
            className={style.filter_item}
            placeholder="$ 0.1"
            onChange={this.onEntryFilterChange}
          />

          <div className={style.action}>
            <div className={style.background}>
              <p className={style.question}>{i18n.t('not_satisfied')}</p>
            </div>

            <button className={style.button} onClick={this.toggleNewTournamentModal}>
              {i18n.t('create_new_tournament')}
            </button>
          </div>
        </div>

        <div className={style.section}>
          <Table
            captions={tournamentsTableCaptions}
            items={tournaments}
            className={style.table}
            renderRow={this.renderRow}
            isLoading={this.state.isLoading}
            emptyMessage={i18n.t('there_is_no_tournaments_yet')}
          />
        </div>
      </div>

      {this.state.isLoading &&
        <Preloader />
      }

      {this.state.isAddTournamentModalShown &&
        <NewTournamentModal onClose={this.toggleNewTournamentModal} />
      }
    </div>;
  }
}

export default Tournaments;