import React, { Component } from 'react';

import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import ModalAsk from 'components/modal';
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
    width: window.innerWidth < 480 ? 100 : 175,
  },

  matches: {
    text: i18n.t('matches'),
    width: 75,
  },

  date: {
    text: i18n.t('date'),
    width: 100,
  },

  syncAt: {
    text: i18n.t('syncDate'),
    width: 100,
  },

  syncType: {
    text: 'Sync type',
    width: 60,
  },
};

class Tournaments extends Component {
  constructor(props) {
    super(props);
    this.tournamentService = new TournamentService();
    this.notificationService = new NotificationService();
    this.adminService = new AdminService({
      onUpdate: (data) => this.updateMatch(data),
    });
  }

  state = {
    tournaments: [],
    tournamentEditingData: {
      name: '',
      date: '',
      champions: null,
      matches_ids: [],
    },
    players: [],
    editingMatchId: '',
    selectedChampion: '',
    isTournamentEditing: false,
    isTournamentCreating: false,
    isTournamentDeleting: false,
    isMatchEditing: false,
    isMatchCreating: false,
    isLoading: false,
  };

  createTournamentInit = () => {
    this.setState({
      isTournamentCreating: true,
    });
  }

  syncData = async () => {
    this.setState({ isLoading: true });
    
    try {
      await this.adminService.syncDataWithEscore();
    } catch (error) {
      this.notificationService.show('Oops, something went wrong with synchronization');
    }

    this.notificationService.show('Synchronization completed!');
    this.setState({ isLoading: false });
  }

  createTournamentSubmit = async () => {
    const { tournamentEditingData } = this.state;

    if (!tournamentEditingData.name) {
      this.notificationService.show(i18n.t('please_name_tournament'));

      return;
    }

    if (!tournamentEditingData.date) {
      this.notificationService.show(i18n.t('please_date_tournament'));

      return;
    }

    // if (!tournamentEditingData.champions_ids.length === 0) {
    //   this.notificationService.show('Please, choose tournament players');

    //   return;
    // }

    await this.adminService.createRealTournament({
      ...this.state.tournamentEditingData,
      origin: 'manual',
    });

    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      isTournamentCreating: false,
      tournamentEditingData: {
        name: '',
        date: '',
      },
      tournaments,
    }, () => this.notificationService.show(i18n.t('tournament_created')));
  }

  editTournamentInit = (tournamentId) => {
    const tournament = this.state.tournaments.filter(tournament => tournament._id === tournamentId)[0];
    const tournamentChampions = tournament.champions ? tournament.champions : [];

    this.setState({
      isTournamentEditing: true,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        ...tournament,
        champions: tournamentChampions,
      },
    });
  }

  editTournamentSubmit = async () => {
    this.setState({ isLoading: true });

    await this.adminService.updateRealTournament(this.state.tournamentEditingData._id, this.state.tournamentEditingData);

    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      isLoading: false,
      tournaments,
    }, () => this.notificationService.show(i18n.t('tournament_updated')));
  }

  resetTournament = () => this.setState({
    isTournamentEditing: false,
    isTournamentCreating: false,
    isMatchEditing: false,
    tournamentEditingData: {
      name: '',
      date: '',
      champions: [],
    },
  });

  deleteTournamentConfirmInit = () => {
    this.setState({
      isTournamentDeleting: true,
    });
  }

  deleteTournamentAccept = () => {
    this.setState({
      isTournamentDeleting: false,
    });

    this.deleteTournament();
  }

  deleteTournamentDecline = () => {
    this.setState({
      isTournamentDeleting: false,
    });
  }

  deleteTournament = async () => {
    const tournamentId = this.state.tournamentEditingData._id;
    await this.adminService.deleteRealTournament(tournamentId);

    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      isTournamentEditing: false,
      isTournamentDeleting: false,
      tournaments,
    }, () => this.notificationService.show(i18n.t('tournament_deleted')));
  }

  createMatch = async () => {
    this.setState({ isLoading: true });

    const tournamentId = this.state.tournamentEditingData._id;
    const match = await this.adminService.createMatch(tournamentId);
    const { tournament } = await this.adminService.getRealTournamentById(tournamentId);

    await this.notificationService.show(i18n.t(match.message));

    this.setState({
      isLoading: false,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        matches: tournament.matches,
      },
    });
  }

  deleteMatch = async (matchId) => {
    this.setState({ isLoading: true });

    const tournamentId = this.state.tournamentEditingData._id;
    await this.adminService.deleteMatch(matchId);
    const { tournament } = await this.adminService.getRealTournamentById(tournamentId);

    this.setState({
      isLoading: false,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        matches: tournament.matches,
      },
    });
  };

  updateMatch = ({ match }) => {
    let matches = this.state.tournamentEditingData.matches;
    let updatedMatches = matches.map(item => item._id === match._id ? match : item);

    this.setState({
      isLoading: false,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        matches: updatedMatches,
      },
    });
  }

  matchEditingInit = (matchId) => this.setState({
    editingMatchId: matchId,
    isMatchEditing: true,
  });

  matchCreatingCompleted = () => this.setState({ isMatchCreating: false });

  matchEditingCompleted = () => this.setState({ isMatchEditing: false });

  handleInputChange = (event) => {
    const inputValue = event.target.name === 'date' ? moment(event.target.value).format() : event.target.value;
    this.setState({
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        [event.target.name]: inputValue,
      },
    });
  };

  selectChampion = (event) => {
    if (event.target.value) {
      this.setState({ selectedChampion: event.target.value });
    }

    return;
  };

  addChampionToTournament = async () => {
    const { selectedChampion, tournamentEditingData, players } = this.state;
    const tournamentId = tournamentEditingData._id;

    if (!selectedChampion) {
      this.notificationService.show(i18n.t('player_from_list'));

      return;
    }

    if (tournamentEditingData.champions.find(champion => champion._id === selectedChampion)) {
      this.notificationService.show(i18n.t('player_already'));

      return;
    }

    this.setState({ isLoading: true });

    const champion = players.find(champion => champion._id === selectedChampion);
    const champions = [...this.state.tournamentEditingData.champions, champion];

    await this.adminService.addPlayerToRealTournament(tournamentId, champion);

    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      isLoading: false,
      tournaments,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        champions,
      },
    });
  };

  removeChampionFromTournament = async (playerId) => {
    const { tournamentEditingData } = this.state;
    const champions = tournamentEditingData.champions.filter(champion => champion._id !== playerId);

    this.setState({ isLoading: true });

    await this.adminService.removePlayerFromRealTournament(tournamentEditingData._id, playerId);

    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      isLoading: false,
      tournaments,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        champions,
      },
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
    const formattedSyncDate = moment(item.syncAt).format('DD MMM YYYY');
    const tournamentId = item._id;

    return <div onClick={() => this.editTournamentInit(tournamentId)} className={cx(className, style.tournament_row)} key={item._id}>
      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.name.width }}>
        <span className={textClass}>{item.name}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.matches.width }}>
        <span className={textClass}>{item.matches ? item.matches.length : i18n.t('no_any_matches')}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.date.width }}>
        <span className={textClass}>{formattedDate}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.syncAt.width }}>
        <span className={textClass}>{formattedSyncDate}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.syncType.width }}>
        <span className={textClass}>{item.syncType}</span>
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
      isTournamentDeleting,
      isLoading,
    } = this.state;

    const modalTitle = isTournamentCreating ? i18n.t('create_new_tournament') : `Editing ${tournamentEditingData.name}`;
    const editedTournamentDate = moment(tournamentEditingData.date).format('YYYY-MM-DD');
    const editedTournamentSyncDate = moment(tournamentEditingData.syncAt).format('YYYY-MM-DD');
    const isTournamentHasMatches = tournamentEditingData.matches && tournamentEditingData.matches.length > 0;
    const isTournamentModalActive = isTournamentEditing || isTournamentCreating;

    const isMatchModalActive = isMatchCreating || isMatchEditing;

    let modalActions = [];

    if (!isTournamentEditing) {
      modalActions.push(
        { text: i18n.t('create_tournament'), onClick: this.createTournamentSubmit, isDanger: false },
      );
    }

    if (isTournamentEditing) {
      modalActions.push(
        { text: i18n.t('delete_tournament'), onClick: this.deleteTournamentConfirmInit, isDanger: true },
        { text: i18n.t('update_tournament'), onClick: this.editTournamentSubmit, isDanger: false },
      );
    }

    return <div className={style.tournaments}>

      <div className={style.tournaments_controls}>
        <Button
          appearance="_basic-accent"
          text={i18n.t('sync_data')}
          onClick={this.syncData}
          className={style.button}
        />
        <Button
          appearance="_basic-accent"
          text={i18n.t('create_new_tournament')}
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
          actions={modalActions}
        >

          {isLoading &&
            <Preloader />
          }

          {isTournamentDeleting &&
            <ModalAsk
              textModal={i18n.t('want_delete_tournament')}
              submitClick={this.deleteTournamentAccept}
              closeModal={this.deleteTournamentDecline}
            />
          }

          <div className={style.section}>
            <Input
              label={i18n.t('tournament_name')}
              name="name"
              placeholder="Choose name"
              className={style.tournament_input}
              value={tournamentEditingData.name || ''}
              onChange={this.handleInputChange}
            />
            <Input
              name="date"
              label={i18n.t('tournament_date')}
              placeholder="Choose date"
              type="date"
              className={style.tournament_input}
              value={editedTournamentDate || ''}
              onChange={this.handleInputChange}
            />
            {!isTournamentCreating &&
              <Input
                name="syncAt"
                label="Sync date"
                type="date"
                className={style.tournament_input}
                value={editedTournamentSyncDate || ''}
                onChange={this.handleInputChange}
                disabled
              />
            }
            {!isTournamentCreating &&
              <Input
                name="syncType"
                label="Sync type"
                className={style.tournament_input}
                value={tournamentEditingData.syncType || ''}
                onChange={this.handleInputChange}
                disabled
              />
            }
            {!isTournamentCreating &&
              <Input
                name="origin"
                label="Origin"
                className={style.tournament_input}
                value={tournamentEditingData.origin || ''}
                onChange={this.handleInputChange}
                disabled
              />
            }
          </div>

          {isTournamentEditing &&
            <div className={cx(style.section, style.champions_section)}>
              <div className={style.title}>{i18n.t('tournament_players')}</div>
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
                    defaultOption={i18n.t('select_player')}
                  />
                  <Button
                    appearance="_basic-accent"
                    text={i18n.t('add')}
                    onClick={this.addChampionToTournament}
                    className={style.button}
                  />
                </div>
              </div>
            </div>
          }

          {isTournamentEditing &&
            <div className={cx(style.section, style.matches_section)}>
              <div className={style.title}>{i18n.t('tournament_matches')}</div>

              <Button
                appearance="_basic-accent"
                text={i18n.t('create_match')}
                onClick={this.createMatch}
                className={style.button}
              />

              {isTournamentHasMatches && tournamentEditingData.matches.map((match) =>
                <div
                  key={match._id}
                  className={style.match}
                >
                  <div
                    className={style.match_inner}
                    onClick={() => this.matchEditingInit(match._id)}
                  >
                    {match.name}
                  </div>
                  <Button
                    appearance="_basic-danger"
                    text="X"
                    onClick={() => this.deleteMatch(match._id)}
                    className={style.button}
                  />
                </div>,
              )}
            </div>
          }

        </Modal>}

      {isMatchModalActive &&
        <MatchModal
          matchId={this.state.editingMatchId}
          matchEditingCompleted={this.matchEditingCompleted}
          matchChampions={tournamentEditingData.champions}
        />
      }

    </div>;
  }
}

export default Tournaments;