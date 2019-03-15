import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import filter from 'lodash/filter';

import TournamentService from 'services/tournamentService';

import Input from 'components/filters/input';
import Select from 'components/filters/select';
import Table from 'components/table';
import NewTournamentModal from 'components/new-tournament';
import Preloader from 'components/preloader';

import style from './style.module.css';
import i18n from 'i18n';

const tournamentsTableCaptions = {
  name: {
    text: 'Name',
    width: 250,
  },

  date: {
    text: 'Date',
    width: 100,
  },

  users: {
    text: 'Users',
    width: 80,
  },

  entry: {
    text: 'Entry',
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
    const formattedDate = moment(item.tournament.date).format('MMM DD');
    const entry = item.entry === 0 ? 'Free' : item.entry;

    return <NavLink to={`/tournaments/${item._id}`} className={className}>
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
      <h2 className={style.title}>Tournaments</h2>

      <div className={style.content}>
        <div className={style.sidebar}>
          <Select
            defaultOption="Select tournament"
            options={this.state.realTournaments}
            label="Tournament (from list)"
            onChange={this.onTournamentFilterChange}
            className={style.filter_item}
          />

          <Input
            type="date"
            label="Date from"
            className={style.filter_item}
            onChange={this.onDateFilterChange}
          />

          <Input
            type="number"
            label="Minimal entry"
            className={style.filter_item}
            placeholder="$ 0.1"
            onChange={this.onEntryFilterChange}
          />

          <div className={style.action}>
            <div className={style.background}>
              <p className={style.question}>Not satisfied?</p>
            </div>

            <button className={style.button} onClick={this.toggleNewTournamentModal}>
              Create a new tournament
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
            emptyMessage="There is no tournaments yet"
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
