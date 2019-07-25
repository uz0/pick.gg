import React, { Component } from 'react';
import compose from 'recompose/compose';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { http } from 'helpers';
import i18n from 'i18n';
import Button from 'components/button';
import TournamentInformation from 'components/tournament-information';
import TournamentMatches from 'components/tournament-matches';
import TournamentRewards from 'components/tournament-rewards';
import TournamentRules from 'components/tournament-rules';
import TournamentSummoners from 'components/tournament-summoners';
import TournamentViewers from 'components/tournament-viewers';
import TournamentApplicants from 'components/tournament-applicants';
import { actions as usersActions } from 'pages/dashboard/users';
import { actions as tournamentsActions } from 'pages/tournaments';
import { actions as modalActions } from 'components/modal-container';
import style from './style.module.css';

const cx = classnames.bind(style);

class Tournament extends Component {
  loadTournament = async () => {
    const tournamentRequest = await http(`/public/tournaments/${this.props.match.params.id}`);
    const rewardsRequest = await http(`/public/tournaments/${this.props.match.params.id}/rewards`);

    const tournament = await tournamentRequest.json();
    const unfoldedRewards = await rewardsRequest.json();

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

  addRules = () => this.props.toggleModal({
    id: 'add-tournament-rules-modal',

    options: {
      tournamentId: this.props.match.params.id,
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
    id: 'add-tournament-rewards',

    options: {
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

  attendTournament = async () => {
    const response = await http(`/api/tournaments/${this.props.match.params.id}/attend`, { method: 'PATCH' });
    const tournament = await response.json();
    this.props.updateTournament(tournament);
  };

  componentDidMount() {
    this.loadTournament();

    if (isEmpty(this.props.users)) {
      this.loadUsers();
    }
  }

  render() {
    const tournament = get(this.props, 'tournament');
    const name = get(this.props, 'tournament.name');
    const creator = get(this.props, 'tournament.creator');

    const isEmpty = get(this.props, 'tournament.isEmpty');
    const isApplicationsAvailable = get(this.props, 'tournament.isApplicationsAvailable');
    const isReadyForForecasts = get(this.props, 'tournament.isReadyForForecasts');
    const isStarted = get(this.props, 'tournament.isStarted');
    const isFinalized = get(this.props, 'tournament.isFinalized');

    const isApplicantsWidgetVisible = !isApplicationsAvailable && isReadyForForecasts;
    const isSummonersWidgetVisible = !isEmpty;
    const isViewersWidgetVisible = !isApplicationsAvailable && isReadyForForecasts;

    return (
      <div className={cx('tournament', 'container')}>
        <div className={style.inner_container}>

          <div className={style.tournament_section}>

            <h2 className={style.title}>{name}</h2>

            {isApplicationsAvailable && (
              <div className={style.actions}>
                <Button
                  text={i18n.t('suggest_yourself')}
                  appearance="_basic-accent"
                  className={style.button}
                  onClick={this.attendTournament}
                />
              </div>
            )}

          </div>

          {tournament && (
            <>
              <div className={cx(style.widgets, { [style.is_empty]: isEmpty })}>
                <TournamentInformation
                  className={style.information_widget}
                  id={this.props.match.params.id}
                  editTournament={this.editTournament}
                />

                <TournamentRules
                  className={style.rules_widget}
                  id={this.props.match.params.id}
                  addRules={this.addRules}
                />

                <TournamentRewards
                  className={style.rewards_widget}
                  id={this.props.match.params.id}
                  addRewards={this.addRewards}
                />

                <TournamentMatches
                  className={style.matches_widget}
                  id={this.props.match.params.id}
                />

                {isSummonersWidgetVisible && (
                  <TournamentSummoners
                    className={style.summoners_widget}
                    id={this.props.match.params.id}
                    addSummoners={this.addSummoners}
                  />
                )}

                {isViewersWidgetVisible && (
                  <TournamentViewers
                    className={style.viewers_widget}
                    id={this.props.match.params.id}
                    joinTournament={this.joinTournament}
                  />
                )}

                {isApplicantsWidgetVisible && (
                  <TournamentApplicants
                    className={style.applicants_widget}
                    id={this.props.match.params.id}
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
    },
  ),
)(Tournament);
