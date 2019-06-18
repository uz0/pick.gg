import React, { Component } from 'react';

import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import DialogWindow from 'components/dialog-window';
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
};

class Tournaments extends Component {
  constructor(props) {
    super(props);
    this.tournamentService = new TournamentService();
    this.notificationService = new NotificationService();
    this.adminService = new AdminService({
      onUpdate: data => this.updateMatch(data),
    });
  }

  state = {
    tournaments: [],
    tournamentEditingData: {
      name: '',
      date: '',
      champions: null,
      matchesIds: [],
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

  editTournamentInit = tournamentId => {
    const tournament = this.state.tournaments.filter(tournament => tournament._id === tournamentId)[0];
    const tournamentChampions = tournament.champions ? tournament.champions : [];

    this.setState({
      isTournamentEditing: true,
      tournamentEditingData: {
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
    }, () => this.notificationService.showSingleNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: i18n.t('tournament_updated'),
    }),
    );
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
    }, () => this.notificationService.showSingleNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: i18n.t('tournament_deleted'),
    }),
    );
  }

  createMatch = async () => {
    this.setState({ isLoading: true });

    const tournamentId = this.state.tournamentEditingData._id;
    const match = await this.adminService.createMatch(tournamentId);
    const { tournament } = await this.adminService.getRealTournamentById(tournamentId);

    this.notificationService.showSingleNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: i18n.t(match.message),
    });

    this.setState({
      isLoading: false,
      tournamentEditingData: {
        matches: tournament.matches,
      },
    });
  }

  deleteMatch = async matchId => {
    this.setState({ isLoading: true });

    const tournamentId = this.state.tournamentEditingData._id;
    await this.adminService.deleteMatch(matchId);
    const { tournament } = await this.adminService.getRealTournamentById(tournamentId);

    this.setState({
      isLoading: false,
      tournamentEditingData: {
        matches: tournament.matches,
      },
    });
  };

  updateMatch = ({ match }) => {
    const { matches } = this.state.tournamentEditingData;
    const updatedMatches = matches.map(item => item._id === match._id ? match : item);

    this.setState({
      isLoading: false,
      tournamentEditingData: {
        matches: updatedMatches,
      },
    });
  }

  matchEditingInit = matchId => this.setState({
    editingMatchId: matchId,
    isMatchEditing: true,
  });

  matchCreatingCompleted = () => this.setState({ isMatchCreating: false });

  matchEditingCompleted = () => this.setState({ isMatchEditing: false });

  handleInputChange = event => {
    const inputValue = event.target.name === 'date' ? moment(event.target.value).format() : event.target.value;
    this.setState({
      tournamentEditingData: {
        [event.target.name]: inputValue,
      },
    });
  };

  selectChampion = event => {
    if (event.target.value) {
      this.setState({ selectedChampion: event.target.value });
    }
  };

  addChampionToTournament = async () => {
    const { selectedChampion, tournamentEditingData, players } = this.state;
    const tournamentId = tournamentEditingData._id;

    if (!selectedChampion) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: i18n.t('player_from_list'),
      });

      return;
    }

    if (tournamentEditingData.champions.find(champion => champion._id === selectedChampion)) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: i18n.t('player_already'),
      });

      return;
    }

    this.setState({ isLoading: true });

    const champion = players.find(champion => champion._id === selectedChampion);
    // eslint-disable-next-line react/no-access-state-in-setstate
    const champions = [...this.state.tournamentEditingData.champions, champion];

    await this.adminService.addPlayerToRealTournament(tournamentId, champion);

    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      isLoading: false,
      tournaments,
      tournamentEditingData: {
        champions,
      },
    });
  };

  removeChampionFromTournament = async playerId => {
    const { tournamentEditingData } = this.state;
    const champions = tournamentEditingData.champions.filter(champion => champion._id !== playerId);

    this.setState({ isLoading: true });

    await this.adminService.removePlayerFromRealTournament(tournamentEditingData._id, playerId);

    const { tournaments } = await this.adminService.getRealTournaments();

    this.setState({
      isLoading: false,
      tournaments,
      tournamentEditingData: {
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
    const tournamentId = item._id;

    // eslint-disable-next-line react/jsx-sort-props
    return (
      <div key={item._id} className={cx(className, style.tournament_row)} onClick={() => this.editTournamentInit(tournamentId)}>
        <div className={itemClass} style={{ '--width': tournamentsTableCaptions.name.width }}>
          <span className={textClass}>{item.name}</span>
        </div>

        <div className={itemClass} style={{ '--width': tournamentsTableCaptions.matches.width }}>
          <span className={textClass}>{item.matches ? item.matches.length : i18n.t('no_any_matches')}</span>
        </div>

        <div className={itemClass} style={{ '--width': tournamentsTableCaptions.date.width }}>
          <span className={textClass}>{formattedDate}</span>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line complexity
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
    const isTournamentHasMatches = tournamentEditingData.matches && tournamentEditingData.matches.length > 0;
    const isTournamentModalActive = isTournamentEditing || isTournamentCreating;

    const isMatchModalActive = isMatchCreating || isMatchEditing;

    const modalActions = [];

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

    return (
      <div className={style.tournaments}>

        <div className={style.tournaments_controls}>
          <Button
            appearance="_basic-accent"
            text={i18n.t('create_new_tournament')}
            className={style.button}
            onClick={this.createTournamentInit}
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

        {isTournamentModalActive && (
          <Modal
            title={modalTitle}
            close={this.resetTournament}
            actions={modalActions}
          >

            {isLoading && (
              <Preloader
                isFullScreen
              />
            )}

            {isTournamentDeleting && (
              <DialogWindow
                text={i18n.t('want_delete_tournament')}
                onSubmit={this.deleteTournamentAccept}
                onClose={this.deleteTournamentDecline}
              />
            )}

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
            </div>

            {isTournamentEditing && (
              <div className={cx(style.section, style.champions_section)}>
                <div className={style.title}>{i18n.t('tournament_players')}</div>
                <div className={style.champions}>
                  {tournamentEditingData.champions && tournamentEditingData.champions.map(champion => (
                    <div key={champion._id} className={style.champion}>
                      {champion.name}
                      <Button
                        icon={<CloseIcon/>}
                        appearance="_icon-transparent"
                        onClick={() => this.removeChampionFromTournament(champion._id)}
                      />
                    </div>
                  ))}
                  <div className={style.champion_add}>
                    <Select
                      options={players}
                      className={style.select}
                      defaultOption={i18n.t('select_player')}
                      onChange={this.selectChampion}
                    />
                    <Button
                      appearance="_basic-accent"
                      text={i18n.t('add')}
                      className={style.button}
                      onClick={this.addChampionToTournament}
                    />
                  </div>
                </div>
              </div>
            )}

            {isTournamentEditing && (
              <div className={cx(style.section, style.matches_section)}>
                <div className={style.title}>{i18n.t('tournament_matches')}</div>

                <Button
                  appearance="_basic-accent"
                  text={i18n.t('create_match')}
                  className={style.button}
                  onClick={this.createMatch}
                />

                {isTournamentHasMatches && tournamentEditingData.matches.map(match => (
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
                      className={style.button}
                      onClick={() => this.deleteMatch(match._id)}
                    />
                  </div>
                ),
                )}
              </div>
            )}

          </Modal>
        )}

        {isMatchModalActive && (
          <MatchModal
            matchId={this.state.editingMatchId}
            matchEditingCompleted={this.matchEditingCompleted}
            matchChampions={tournamentEditingData.champions}
          />
        )}

      </div>
    );
  }
}

export default Tournaments;
