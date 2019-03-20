import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import http from 'services/httpService';
import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import Input from 'components/input';
import Select from 'components/select';
import Button from 'components/button';
import Preloader from 'components/preloader';
import { ReactComponent as CloseIcon } from 'assets/close.svg';

import MatchModal from 'components/match-modal';

import moment from 'moment';
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
};

class Tournaments extends Component {
  constructor() {
    super();
    this.tournamentService = new TournamentService();
    this.notificationService = new NotificationService();
    this.adminService = new AdminService();
  }

  state = {
    tournaments: [],
    tournamentEditingData: {
      name: '',
      date: '',
      champions: [],
    },
    editingMatchId: '',
    isTournamentEditing: false,
    isMatchEditing: false,
    isLoading: false,
  };

  editTournamentInit = (tournamentId) => {
    const tournament = this.state.tournaments.filter(tournament => tournament._id === tournamentId)[0];
    this.setState({
      isTournamentEditing: true,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        ...tournament,
      }
    });
  }

  editTournamentSubmit = async () => {
    this.setState({ isLoading: true });

    await http('/api/admin/tournaments/real', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournamentId: this.state.tournamentEditingData._id,
        tournament: this.state.tournamentEditingData,
      })
    });

    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      isLoading: false,
      tournaments,
    }, () => this.notificationService.show('Tournament was successfully updated!'));
  }

  resetTournamentEditing = () => this.setState({
    isTournamentEditing: false,
    tournamentEditingData: {}
  });

  matchEditingInit = (matchId) => this.setState({
    editingMatchId: matchId,
    isMatchEditing: true
  });

  matchEditingCompleted = () => this.setState({ isMatchEditing: false });

  handleInputChange = (event) => {
    const inputValue = event.target.name === 'date' ? moment(event.target.value).format() : event.target.value;
    this.setState({
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        [event.target.name]: inputValue,
      }
    });
  }

  removeChampionFromTournament = (championId) => {
    const champions = this.state.tournamentEditingData.champions.filter(champion => champion.id !== championId);
    const champions_ids = this.state.tournamentEditingData.champions_ids.filter(id => id !== championId);

    this.setState({
      ...this.state,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        champions,
        champions_ids
      }
    })
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      tournaments,
      isLoading: false,
    });
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const formattedDate = moment(item.date).format('MMM DD');
    const tournamentId = item._id;

    return <div onClick={() => this.editTournamentInit(tournamentId)} className={cx(className, style.tournament_row)} key={item._id}>
      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.name.width }}>
        <span className={textClass}>{item.name}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.date.width }}>
        <span className={textClass}>{formattedDate}</span>
      </div>
    </div>;
  }

  render() {
    const {
      tournaments,
      tournamentEditingData,
      isMatchEditing,
      isTournamentEditing,
      isLoading,
    } = this.state;

    const modalTitle = `Editing ${tournamentEditingData.name}`;
    const editedTournamentDate = moment(tournamentEditingData.date).format('YYYY-MM-DD');

    return <div className={style.tournaments}>
      <Table
        captions={tournamentsTableCaptions}
        items={tournaments}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={isLoading}
        emptyMessage={i18n.t('there_is_no_tournaments_yet')}
      />

      {isTournamentEditing &&
        <Modal
          title={modalTitle}
          close={this.resetTournamentEditing}
          actions={[{
            text: 'Update tournament',
            onClick: this.editTournamentSubmit,
            isDanger: false,
          }]}
        >

          {isLoading &&
            <Preloader />
          }

          <Input
            label="Tournament name"
            name="name"
            value={tournamentEditingData.name || ''}
            onChange={this.handleInputChange}
          />
          <Input
            name="date"
            label="Tournament date"
            type="date"
            value={editedTournamentDate || ''}
            onChange={this.handleInputChange}
          />

          <div className={cx(style.section, style.champions_section)}>
            <div className={style.title}>Tournament players</div>
            <div className={style.champions}>
              {tournamentEditingData.champions.map(champion => <div key={champion._id} className={style.champion}>
                {champion.name}
                <Button
                  icon={<CloseIcon />}
                  onClick={() => this.removeChampionFromTournament(champion.id)}
                  appearance={'_icon-transparent'}
                />
              </div>)}
              <div className={style.champion_add}>
                <Select
                  className={style.select}
                />
                <Button
                  appearance="_basic-accent"
                  text="Add"
                  className={style.button}
                />
              </div>
            </div>
          </div>

          <div className={cx(style.section, style.matches_section)}>
            <div className={style.title}>Tournament Matches</div>
            {tournamentEditingData.matches.map((match, index) => <div
              key={match._id}
              onClick={() => this.matchEditingInit(match.id)}
              className={style.match}
            >
              {`Match ${index}`}
            </div>)}
          </div>

        </Modal>}

      {isMatchEditing &&
        <MatchModal
          matchId={this.state.editingMatchId}
          matchChampions={tournamentEditingData.champions}
          matchEditingCompleted={this.matchEditingCompleted}
        />
      }

    </div>;
  }
}

export default Tournaments;