/* eslint-disable complexity */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import includes from 'lodash/includes';
import ym from 'react-yandex-metrika';
import { connect } from 'react-redux';
import moment from 'moment';
import classnames from 'classnames/bind';
import { actions as usersActions } from 'pages/dashboard/users';
import { actions as tournamentsActions } from 'pages/tournaments';

import Preloader from 'components/preloader';
import TournamentInformation from 'components/tournament-information';
import { Tabs, Tab, Panel } from 'components/tabs';
import TournamentMatchesTimeline from 'components/tournament-matches-timeline';
import TournamentSummoners from 'components/tournament-summoners';
import TournamentModerators from 'components/tournament-moderators';
import TournamentViewers from 'components/tournament-viewers';
import TournamentApplicants from 'components/tournament-applicants';
import TournamentInvite from 'components/tournament-invite';
import Button from 'components/button';
import Icon from 'components/icon';
import { actions as modalActions } from 'components/modal-container';
import { actions as notificationActions } from 'components/notification';

import { http } from 'helpers';

import i18n from 'i18next';

import style from './style.module.css';

const cx = classnames.bind(style);

class Tournament extends Component {
  state = {
    isLoading: true,
  }

  loadTournament = async () => {
    const tournamentRequest = await http(`/public/tournaments/${this.props.match.params.id}`);
    const rewardsRequest = await http(`/public/tournaments/${this.props.match.params.id}/rewards`);

    const tournament = await tournamentRequest.json();
    const unfoldedRewards = await rewardsRequest.json();

    if (tournament.errors) {
      this.props.history.push('/404');

      return;
    }

    if (tournament) {
      this.props.updateTournament({
        ...tournament,
        unfoldedRewards,
      });
    }
  };

  loadUsers = async () => {
    const response = await http('/public/users');
    const { users } = await response.json();

    this.props.addUsers(users);
  };

  enableForecasting = async () => {
    const response = await http(`/api/tournaments/${this.props.match.params.id}/forecastStatus`, { method: 'PATCH' });
    const tournament = await response.json();

    this.props.updateTournament({
      ...tournament,
    });
  };

  startMatches = async () => {
    const response = await http(`/api/tournaments/${this.props.match.params.id}/start`, { method: 'PATCH' });
    const tournament = await response.json();

    this.props.updateTournament({
      ...tournament,
    });
  };

  finalizeTournament = async () => {
    const response = await http(`/api/tournaments/${this.props.match.params.id}/finalize`, { method: 'PATCH' });
    const tournament = await response.json();

    ym('reachGoal', 'streamer_finalized_tournament');

    this.props.updateTournament({
      ...tournament,
    });
  };

  addRules = isCurrentUserAdminOrCreator => this.props.toggleModal({
    id: 'tournament-rules-modal',

    options: {
      isCurrentUserAdminOrCreator,
      tournamentId: this.props.match.params.id,
    },
  });

  editRules = isCurrentUserAdminOrCreator => this.props.toggleModal({
    id: 'tournament-rules-modal',

    options: {
      isCurrentUserAdminOrCreator,
      tournamentId: this.props.match.params.id,
      isEditing: true,
    },
  });

  addSummoners = () => this.props.toggleModal({
    id: 'add-summoners-modal',

    options: {
      tournamentId: this.props.match.params.id,
      selectedSummoners: this.props.tournament.summoners,
      summoners: this.props.users,
      game: this.props.tournament.game,
    },
  });

  addModerators = () => this.props.toggleModal({
    id: 'add-moderators-modal',

    options: {
      tournamentId: this.props.match.params.id,
      selectedModerators: this.props.tournament.moderators,
      moderators: this.props.users,
      game: this.props.tournament.game,
    },
  });

  addRewards = isCurrentUserAdminOrCreator => this.props.toggleModal({
    id: 'tournament-rewards',

    options: {
      isCurrentUserAdminOrCreator,
      tournamentId: this.props.match.params.id,
    },
  });

  editRewards = isCurrentUserAdminOrCreator => this.props.toggleModal({
    id: 'tournament-rewards',

    options: {
      isCurrentUserAdminOrCreator,
      isEditing: true,
      tournamentId: this.props.match.params.id,
    },
  });

  editTournament = () => this.props.toggleModal({
    id: 'edit-tournament-modal',

    options: {
      tournamentId: this.props.match.params.id,
    },
  });

  joinTournament = () => this.props.toggleModal({
    id: 'join-tournament-players-modal',

    options: {
      tournamentId: this.props.match.params.id,
      currentUserId: this.props.currentUser._id,
      tournamentSummoners: this.props.tournament.summoners,
      tournamentViewers: this.props.tournament.viewers,
      summoners: this.props.users,
    },
  });

  async componentDidMount() {
    try {
      await this.loadTournament();
    } catch (error) {
      console.log(error);
    }

    if (isEmpty(this.props.users)) {
      await this.loadUsers();
    }

    this.setState({ isLoading: false });
  }

  render() {
    const tournament = get(this.props, 'tournament');
    const name = get(this.props, 'tournament.name');
    const createdAt = moment(get(this.props, 'tournament.createdAt', '')).format('D MMMM');
    const dateDetails = get(this.props, 'tournament.dateDetails');
    const creator = get(this.props, 'tournament.creator');
    const currentUser = get(this.props, 'currentUser');
    const moderators = get(this.props, 'tournament.moderators');

    const isEmpty = get(this.props, 'tournament.isEmpty');
    const isApplicationsAvailable = get(this.props, 'tournament.isApplicationsAvailable');
    const isForecastingActive = get(this.props, 'tournament.isForecastingActive');
    const isStarted = get(this.props, 'tournament.isStarted');
    const isFinalized = get(this.props, 'tournament.isFinalized');

    const isCurrentUserCreator = (creator && currentUser) && creator._id === currentUser._id;
    const isCurrentUserAdmin = currentUser && currentUser.isAdmin;
    const isCurrentUserModerator = currentUser && includes(moderators, currentUser._id);
    const isEditingAvailable = isCurrentUserCreator || isCurrentUserAdmin || isCurrentUserModerator;

    const isApplicantsWidgetVisible = isApplicationsAvailable && isCurrentUserCreator;
    const isSummonersWidgetVisible = !isEmpty;
    const isInviteWidgetVisible = isApplicationsAvailable || isForecastingActive;

    const isAllowForecastButtonDisabled = tournament && tournament.summoners.length < 2;
    const isFinalizeButtonDisabled = tournament && !tournament.matches.every(match => match.endAt);

    return (
      <div className={cx('tournament', 'container')}>

        {this.state.isLoading && (
          <Preloader isFullScreen/>
        )}

        <div className={style.inner_container}>

          <div className={style.tournament_section}>
            <div className={style.info}>
              <div className={style.date}>
                <h2 className={style.createdAt}>{createdAt}</h2>
                {dateDetails && <p className={style.dateDetails}>({dateDetails})</p>}

                {isEditingAvailable && (
                  <button
                    type="button"
                    className={style.button}
                    onClick={this.editTournament}
                  >
                    <Icon name="edit"/>
                  </button>
                )}
              </div>
              <h3 className={style.title}>{name}</h3>
            </div>

            {isEditingAvailable && isApplicationsAvailable && (
              <Button
                disabled={isAllowForecastButtonDisabled}
                text="Allow forecasts"
                appearance="_basic-accent"
                onClick={this.enableForecasting}
              />
            )}

            {isEditingAvailable && isForecastingActive && (
              <Button
                text={i18n.t('start_tournament')}
                appearance="_basic-accent"
                onClick={this.startMatches}
              />
            )}

            {isEditingAvailable && isStarted && !isFinalized && (
              <Button
                disabled={isFinalizeButtonDisabled}
                text="Finalize tournament"
                appearance="_basic-accent"
                onClick={debounce(this.finalizeTournament, 1000)}
              />
            )}
          </div>

          {tournament && (
            <>
              <div className={cx(
                style.widgets,
                { [style.is_empty]: isEmpty },
                { [style.applications_available]: isApplicationsAvailable },
                { [style.applications_available_streamer]: isApplicantsWidgetVisible },
                { [style.forecasting_is_available]: isForecastingActive },
                { [style.is_started]: isStarted }
              )}
              >
                <div className={style.widgetsColumn}>
                  <TournamentInformation
                    id={this.props.match.params.id}
                    className={style.information_widget}
                    isCurrentUserAdminOrCreator={isEditingAvailable}
                    addRewards={this.addRewards}
                    editRewards={this.editRewards}
                    addRules={this.addRules}
                    editRules={this.editRules}
                  />

                  <TournamentViewers
                    id={this.props.match.params.id}
                    className={style.viewers_widget}
                    joinTournament={this.joinTournament}
                  />

                  {isInviteWidgetVisible && (
                    <TournamentInvite
                      className={style.invite_widget}
                      showNotification={this.props.showNotification}
                    />
                  )}
                </div>

                <Tabs>
                  <Tab>Матчи</Tab>
                  <Tab>Игроки</Tab>
                  {isEditingAvailable && <Tab>Модераторы</Tab>}

                  <Panel>
                    <TournamentMatchesTimeline id={this.props.match.params.id}/>
                  </Panel>

                  <Panel>
                    {isSummonersWidgetVisible && (
                      <TournamentSummoners
                        id={this.props.match.params.id}
                        className={style.summoners_widget}
                        addSummoners={this.addSummoners}
                      />
                    )}

                    {isApplicantsWidgetVisible && (
                      <TournamentApplicants
                        id={this.props.match.params.id}
                        className={style.applicants_widget}
                      />
                    )}
                  </Panel>

                  {isEditingAvailable && (
                    <Panel>
                      <TournamentModerators
                        id={this.props.match.params.id}
                        className={style.moderators_widget}
                        addModerators={this.addModerators}
                      />
                    </Panel>
                  )
                  }
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.match.params.id],
      users: state.users.list,
      currentUser: state.currentUser,
    }),

    {
      addTournament: tournamentsActions.addTournament,
      addUsers: usersActions.loadUsers,
      updateTournament: tournamentsActions.updateTournament,
      toggleModal: modalActions.toggleModal,
      showNotification: notificationActions.showNotification,
    },
  ),
)(Tournament);