import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import http from 'services/httpService';
import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import Input from 'components/input';
import Select from 'components/filters/select';
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

  matches: {
    text: 'matches',
    width: 250,
  },

  date: {
    text: i18n.t('date'),
    width: 100,
  },
};

class Tournaments extends Component {
  constructor(props) {
    super(props);
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
      addedChampionsIds: [],
      removedChampionsIds: [],
      matches_ids: [],
    },
    players: [],
    editingMatchId: '',
    selectedChampion: '',
    isTournamentEditing: false,
    isTournamentCreating: false,
    isMatchEditing: false,
    isMatchCreating: false,
    isLoading: false,
  };

  createTournamentInit = () => {
    this.setState({
      isTournamentCreating: true,
    });
  }

  createTournamentSubmit = async () => {
    const { tournamentEditingData } = this.state;

    if (!tournamentEditingData.name) {
      this.notificationService.show('Please, write tournament name');

      return;
    }

    if (!tournamentEditingData.date) {
      this.notificationService.show('Please, choose tournament date');

      return;
    }

    if (!tournamentEditingData.champions.length === 0) {
      this.notificationService.show('Please, choose tournament players');

      return;
    }

    await http(`/api/admin/tournaments/real`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournament: this.state.tournamentEditingData,
      })
    });

    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      isTournamentCreating: false,
      tournaments,
    }, () => this.notificationService.show('Tournament was created'));
  }

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

    await http(`/api/admin/tournaments/real/${this.state.tournamentEditingData._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournament: this.state.tournamentEditingData,
      })
    });

    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      isLoading: false,
      tournaments,
    }, () => this.notificationService.show('Tournament was successfully updated!'));
  }

  resetTournament = () => this.setState({
    isTournamentEditing: false,
    isTournamentCreating: false,
    isMatchEditing: false,
    tournamentEditingData: {
      name: '',
      date: '',
      champions: [],
      addedChampionsIds: [],
      removedChampionsIds: [],
    }
  });

  matchCreatingInit = () => this.setState({
    isMatchCreating: true
  });

  matchCreatingCompleted = () => this.setState({ isMatchCreating: false });

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
  };

  selectChampion = (event) => {
    if (event.target.value) {
      this.setState({ selectedChampion: event.target.value })
    }

    return;
  };

  addChampionToTournament = () => {
    const { selectedChampion, players } = this.state;
    const tournamentChampions = this.state.tournamentEditingData.champions;

    if (!selectedChampion) {
      this.notificationService.show('Please, choose player from list');

      return;
    }

    if (tournamentChampions.find(champion => champion._id === selectedChampion)) {
      this.notificationService.show('This player is already taking part in the tournament');

      return;
    }

    const champion = players.find(champion => champion._id === selectedChampion);
    const champions = [...this.state.tournamentEditingData.champions, champion];
    const addedChampionsIds = [...this.state.tournamentEditingData.addedChampionsIds, champion._id];
    const removedChampionsIds = this.state.tournamentEditingData.removedChampionsIds.filter(item => item !== champion._id);

    this.setState({
      ...this.state,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        champions,
        addedChampionsIds,
        removedChampionsIds
      }
    });
  };

  removeChampionFromTournament = (championId) => {
    const champions = this.state.tournamentEditingData.champions.filter(champion => champion._id !== championId);
    const removedChampionsIds = [...this.state.tournamentEditingData.removedChampionsIds, championId];
    const addedChampionsIds = this.state.tournamentEditingData.addedChampionsIds.filter(item => item !== championId)

    this.setState({
      ...this.state,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        champions,
        addedChampionsIds,
        removedChampionsIds
      }
    });
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { tournaments } = await this.adminService.getRealTournaments();
    const { players } = await this.adminService.getAllChampions();

    this.setState({
      tournaments,
      players,
      isLoading: false,
    });
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const formattedDate = moment(item.date).format('DD MMM YYYY');
    const tournamentId = item._id;

    return <div onClick={() => this.editTournamentInit(tournamentId)} className={cx(className, style.tournament_row)} key={item._id}>
      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.name.width }}>
        <span className={textClass}>{item.name}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.matches.width }}>
        <span className={textClass}>{item.matches ? item.matches.length : "There's no any matches yet"}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.date.width }}>
        <span className={textClass}>{formattedDate}</span>
      </div>
    </div>;
  }

  render() {
    const {
      tournaments,
      players,
      tournamentEditingData,
      isMatchEditing,
      isMatchCreating,
      isTournamentEditing,
      isTournamentCreating,
      isLoading,
    } = this.state;

    const modalTitle = isTournamentCreating ? `Create new tournament` : `Editing ${tournamentEditingData.name}`;
    const editedTournamentDate = moment(tournamentEditingData.date).format('YYYY-MM-DD');
    const isTournamentHasMatches = tournamentEditingData.matches && tournamentEditingData.matches.length > 0;
    const isTournamentModalActive = isTournamentEditing || isTournamentCreating;

    const isMatchModalActive = isMatchCreating || isMatchEditing;

    const tournamentModalActionText = isTournamentEditing ? 'Update tournament' : 'Create tournament';
    const tournamentModalAction = isTournamentEditing ? this.editTournamentSubmit : this.createTournamentSubmit;

    return <div className={style.tournaments}>

      <div className={style.tournaments_controls}>
        <Button
          appearance="_basic-accent"
          text="Create new tournament"
          onClick={this.createTournamentInit}
          className={style.button}
        />
      </div>

      <Table
        captions={tournamentsTableCaptions}
        items={tournaments}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={isLoading}
        emptyMessage={i18n.t('there_is_no_tournaments_yet')}
      />

      {isTournamentModalActive &&
        <Modal
          title={modalTitle}
          close={this.resetTournament}
          actions={[{
            text: tournamentModalActionText,
            onClick: tournamentModalAction,
            isDanger: false,
          }]}
        >

          {isLoading &&
            <Preloader />
          }

          <Input
            label="Tournament name"
            name="name"
            placeholder="Choose name"
            value={tournamentEditingData.name || ''}
            onChange={this.handleInputChange}
          />
          <Input
            name="date"
            label="Tournament date"
            placeholder="Choose date"
            type="date"
            value={editedTournamentDate || ''}
            onChange={this.handleInputChange}
          />

          <div className={cx(style.section, style.champions_section)}>
            <div className={style.title}>Tournament players</div>
            <div className={style.champions}>
              {tournamentEditingData.champions && tournamentEditingData.champions.map(champion => <div key={champion._id} className={style.champion}>
                {champion.name}
                <Button
                  icon={<CloseIcon />}
                  onClick={() => this.removeChampionFromTournament(champion._id)}
                  appearance={'_icon-transparent'}
                />
              </div>)}
              <div className={style.champion_add}>
                <Select
                  options={players}
                  className={style.select}
                  onChange={this.selectChampion}
                  defaultOption={'Select player'}
                />
                <Button
                  appearance="_basic-accent"
                  text="Add"
                  onClick={this.addChampionToTournament}
                  className={style.button}
                />
              </div>
            </div>
          </div>

          <div className={cx(style.section, style.matches_section)}>
            <div className={style.title}>Tournament Matches</div>
            <Button
              appearance="_basic-accent"
              text="Add match"
              onClick={this.matchCreatingInit}
              className={style.button}
            />

            {!isTournamentHasMatches && isTournamentEditing &&
              <div>There's no any matches yet</div>
            }

            {!isTournamentHasMatches && !isTournamentEditing &&
              <div>You can add matches after tournament is created</div>
            }

            {isTournamentHasMatches && tournamentEditingData.matches.map((match, index) => <div
              key={match._id}
              onClick={() => this.matchEditingInit(match._id)}
              className={style.match}
            >
              {`Match ${index + 1}`}
            </div>)}
          </div>

        </Modal>}

      {isMatchModalActive &&
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