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
      this.props.addTournament({
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
    if (!this.props.tournament) {
      this.loadTournament();
    }

    if (isEmpty(this.props.users)) {
      this.loadUsers();
    }
  }

  render() {
    const name = get(this.props, 'tournament.name');

    return (
      <div className={cx('tournament', 'container')}>
        <div className={style.inner_container}>

          <div className={style.tournament_section}>

            <h2 className={style.title}>{name}</h2>

            <div className={style.actions}>
              <Button
                text={i18n.t('suggest_yourself')}
                appearance="_basic-accent"
                className={style.button}
                onClick={this.attendTournament}
              />
            </div>

          </div>

          {this.props.tournament && (
            <div className={cx(style.widgets, style.col_3)}>
              <TournamentInformation
                id={this.props.match.params.id}
                editTournament={this.editTournament}
              />
              <TournamentRules
                id={this.props.match.params.id}
                addRules={this.addRules}
              />
              <TournamentRewards
                id={this.props.match.params.id}
                addRewards={this.addRewards}
              />
            </div>
          )}

          {this.props.tournament && (
            <div className={cx(style.widgets, style.col_3)}>
              <TournamentMatches id={this.props.match.params.id}/>
              <TournamentSummoners
                id={this.props.match.params.id}
                addSummoners={this.addSummoners}
              />
              <TournamentViewers
                id={this.props.match.params.id}
                joinTournament={this.joinTournament}
              />
              <TournamentApplicants id={this.props.match.params.id}/>
            </div>
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
