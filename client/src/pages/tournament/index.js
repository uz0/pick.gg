import React, { Component } from 'react';
import compose from 'recompose/compose';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { http } from 'helpers';
import Button from 'components/button';
import Preloader from 'components/preloader';
import TournamentInformation from 'components/tournament-information';
import TournamentMatches from 'components/tournament-matches';
import TournamentRewards from 'components/tournament-rewards';
import TournamentRules from 'components/tournament-rules';
import TournamentSummoners from 'components/tournament-summoners';
import TournamentViewers from 'components/tournament-viewers';
import TournamentApplicants from 'components/tournament-applicants';
import TournamentInvite from 'components/tournament-invite';
import { actions as usersActions } from 'pages/dashboard/users';
import { actions as tournamentsActions } from 'pages/tournaments';
import { actions as modalActions } from 'components/modal-container';
import { actions as notificationActions } from 'components/notification';
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

    this.props.updateTournament({
      ...tournament,
    });
  };

  addRules = () => this.props.toggleModal({
    id: 'tournament-rules-modal',

    options: {
      tournamentId: this.props.match.params.id,
    },
  });

  editRules = () => this.props.toggleModal({
    id: 'tournament-rules-modal',

    options: {
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
    },
  });

  addRewards = () => this.props.toggleModal({
    id: 'tournament-rewards',

    options: {
      tournamentId: this.props.match.params.id,
    },
  });

  editRewards = () => this.props.toggleModal({
    id: 'tournament-rewards',

    options: {
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
    const creator = get(this.props, 'tournament.creator');
    const currentUser = get(this.props, 'currentUser');

    const isEmpty = get(this.props, 'tournament.isEmpty');
    const isApplicationsAvailable = get(this.props, 'tournament.isApplicationsAvailable');
    const isForecastingActive = get(this.props, 'tournament.isForecastingActive');
    const isStarted = get(this.props, 'tournament.isStarted');
    const isFinalized = get(this.props, 'tournament.isFinalized');

    const isCurrentUserCreator = (creator && currentUser) && creator._id === currentUser._id;
    const isCurrentUserAdmin = currentUser && currentUser.isAdmin;
    const isCurrentUserAdminOrCreator = isCurrentUserCreator || isCurrentUserAdmin;

    const isApplicantsWidgetVisible = isApplicationsAvailable && isCurrentUserCreator;
    const isSummonersWidgetVisible = !isEmpty;
    const isViewersWidgetVisible = isForecastingActive || isStarted;
    const isInviteWidgetVisible = isApplicationsAvailable || isForecastingActive;

    const isAllowForecastButtonDisabled = tournament && tournament.summoners.length < 2;
    const isFinalizeButtonDisabled = tournament && !tournament.matches.every(match => match.endAt);

    return (
      <div className={cx('tournament', 'container')}>

        {this.state.isLoading && (
          <Preloader isFullScreen />
        )}

        <div className={style.inner_container}>

          <div className={style.tournament_section}>
            <h2 className={style.title}>{name}</h2>

            {isCurrentUserAdminOrCreator && isApplicationsAvailable && (
              <Button
                disabled={isAllowForecastButtonDisabled}
                text="Allow forecasts"
                appearance="_basic-accent"
                onClick={this.enableForecasting}
              />
            )}

            {isCurrentUserAdminOrCreator && isForecastingActive && (
              <Button
                text="Start tournament"
                appearance="_basic-accent"
                onClick={this.startMatches}
              />
            )}

            {isCurrentUserAdminOrCreator && isStarted && !isFinalized && (
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
                <TournamentInformation
                  id={this.props.match.params.id}
                  className={style.information_widget}
                  editTournament={this.editTournament}
                />

                <TournamentRules
                  id={this.props.match.params.id}
                  className={style.rules_widget}
                  addRules={this.addRules}
                  editRules={this.editRules}
                />

                <TournamentRewards
                  id={this.props.match.params.id}
                  className={style.rewards_widget}
                  addRewards={this.addRewards}
                  editRewards={this.editRewards}
                />

                {isInviteWidgetVisible && (
                  <TournamentInvite
                    className={style.invite_widget}
                    showNotification={this.props.showNotification}
                  />
                )}

                <TournamentMatches
                  className={style.matches_widget}
                  id={this.props.match.params.id}
                />

                {isSummonersWidgetVisible && (
                  <TournamentSummoners
                    id={this.props.match.params.id}
                    className={style.summoners_widget}
                    addSummoners={this.addSummoners}
                  />
                )}

                {isViewersWidgetVisible && (
                  <TournamentViewers
                    id={this.props.match.params.id}
                    className={style.viewers_widget}
                    joinTournament={this.joinTournament}
                  />
                )}

                {isApplicantsWidgetVisible && (
                  <TournamentApplicants
                    id={this.props.match.params.id}
                    className={style.applicants_widget}
                  />
                )}
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
