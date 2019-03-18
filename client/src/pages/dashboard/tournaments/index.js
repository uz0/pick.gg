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
    tournamentEditingData: {},
    isTournamentEditing: false,
    isLoading: false,
  };

  editTournamentInit = (tournamentId) => {
    const tournament = this.state.tournaments.filter(tournament => tournament._id === tournamentId)[0];
    this.setState({
      isTournamentEditing: true,
      tournamentEditingData: tournament,
    });
  }

  resetTournamentEditing = () => this.setState({
    isTournamentEditing: false,
    tournamentEditingData: {}
  });

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
    const tournamentId = item._id;

    return <div onClick={() => this.editTournamentInit(tournamentId)} className={className} key={item._id}>
      <div className={itemClass} style={{'--width': tournamentsTableCaptions.name.width}}>
        <span className={textClass}>{item.name}</span>
      </div>

      <div className={itemClass} style={{'--width': tournamentsTableCaptions.date.width}}>
        <span className={textClass}>{formattedDate}</span>
      </div>
    </div>;
  }

  render() {
    const {
      tournaments,
      isTournamentEditing,
      tournamentEditingData,
    } = this.state;

    return <div className={style.tournaments}>
      <Table
        captions={tournamentsTableCaptions}
        items={tournaments}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={this.state.isLoading}
        emptyMessage={i18n.t('there_is_no_tournaments_yet')}
      />

      {isTournamentEditing &&
        <Modal
          title={tournamentEditingData.name}
          close={this.resetTournamentEditing}
        >
          <h1>Modal window</h1>
        </Modal>
      }
    </div>;
  }
}

export default Tournaments;
