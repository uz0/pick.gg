import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import TournamentService from 'services/tournamentService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';

import moment from 'moment';
import i18n from 'i18n';

import style from './style.module.css';

const tournamentsTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: 250,
  },

  date: {
    text: i18n.t('date'),
    width: 100,
  },
};

class Tournaments extends Component {
  constructor(){
    super();
    this.tournamentService = new TournamentService();
  }

  state = {
    tournaments: [],
    isLoading: false,
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { tournaments } = await this.tournamentService.getRealTournaments();

    this.setState({
      tournaments,
      isLoading: false,
    });
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const formattedDate = moment(item.date).format('MMM DD');

    return <NavLink to={`/tournaments/${item._id}`} className={className} key={item._id}>
      <div className={itemClass} style={{'--width': tournamentsTableCaptions.name.width}}>
        <span className={textClass}>{item.name}</span>
      </div>

      <div className={itemClass} style={{'--width': tournamentsTableCaptions.date.width}}>
        <span className={textClass}>{formattedDate}</span>
      </div>
    </NavLink>;
  }

  render() {
    const { tournaments } = this.state;

    return <div className={style.tournaments}>
      <Table
        captions={tournamentsTableCaptions}
        items={tournaments}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={this.state.isLoading}
        emptyMessage={i18n.t('there_is_no_tournaments_yet')}
      />

      <Modal
        title="Tournaments edit"
      />
    </div>;
  }
}

export default Tournaments;
