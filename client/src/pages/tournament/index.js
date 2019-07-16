import React, { Component } from 'react';
import compose from 'recompose/compose';
import moment from 'moment';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { http } from 'helpers';
import i18n from 'i18n';
import Button from 'components/button';
import Icon from 'components/icon';
import TournamentMatches from 'components/tournament-matches';
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
    const response = await http(`/api/tournaments/${this.props.match.params.id}`);
    const tournament = await response.json();

    if (tournament) {
      this.props.addTournament(tournament);
    }
  };

  loadUsers = async () => {
    const response = await http('/api/admin/user');
    const { users } = await response.json();

    this.props.addUsers(users);
  };

  addRules = () => this.props.toggleModal({
    id: 'add-tournament-rules-modal',

    options: {
      tournamentId: this.props.match.params.id,
    },
  });

  addMatches = () => this.props.toggleModal({
    id: 'add-match-modal',

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

  joinTournament = () => this.props.toggleModal({ id: 'join-tournament-players-modal' });

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
    const creator = get(this.props, 'tournament.creator');
    const currentUser = get(this.props, 'currentUser');
    const description = get(this.props, 'tournament.description');
    const price = get(this.props, 'tournament.price');
    const rules = get(this.props, 'tournament.rules');
    const rewards = get(this.props, 'tournament.rewards');
    const matches = get(this.props, 'tournament.matches');
    const createdAt = moment(get(this.props, 'tournament.createdAt', '')).format('MMM DD, h:mm');

    const isCurrentUserCreator = creator && creator._id === currentUser._id;
    const isTournamentReady = get(this.props, 'tournament.isReady');

    const isRulesAdded = rules && rules.length > 0;
    const isRewardsAdded = rewards && rewards.length > 0;
    const isMatchesAdded = matches && matches.length > 0;

    return (
      <div className={cx('tournament', 'container')}>
        <div className={style.inner_container}>
          <div className={style.tournament_section}>
            <div className={style.main}>
              <h2 className={style.title}>{name}</h2>

              <div className={style.info}>
                <p className={style.text}>{createdAt}</p>

                <p className={style.text}>
                  Created By
                  {creator && (
                    <Link
                      className={style.creator}
                      to={`/user/${creator._id}`}
                    >
                      {creator.username}<Icon name="star"/>
                    </Link>
                  )}
                </p>
              </div>

              <div className={style.tournament_readiness_status}>
                {isCurrentUserCreator && !isTournamentReady && (
                  <div className={style.item}>
                    <p>Добавьте правила турнира</p>
                    <Button
                      appearance="_circle-accent"
                      icon="plus"
                      className={style.button}
                      onClick={this.addRules}
                    />
                  </div>
                )}

                {isCurrentUserCreator && !isTournamentReady && (
                  <div className={style.item}>
                    <p>Добавьте summoners</p>
                    <Button
                      appearance="_circle-accent"
                      icon="plus"
                      className={style.button}
                      onClick={this.addSummoners}
                    />
                  </div>
                )}

                {isCurrentUserCreator && !isTournamentReady && (
                  <div className={style.item}>
                    <p>Добавьте награды для участников</p>
                    <Button
                      appearance="_circle-accent"
                      icon="plus"
                      className={style.button}
                      onClick={this.addRewards}
                    />
                  </div>
                )}

                {isCurrentUserCreator && !isTournamentReady && (
                  <div className={style.item}>
                    <p>Добавьте матчи</p>
                    <Button
                      appearance="_circle-accent"
                      icon="plus"
                      className={style.button}
                      onClick={this.addMatches}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={style.actions}>
              {isCurrentUserCreator && (
                <Button
                  text={i18n.t('edit')}
                  appearance="_basic-accent"
                  className={style.button}
                  onClick={this.editTournament}
                />
              )}

              <Button
                text={i18n.t('join_tournament')}
                appearance="_basic-accent"
                className={style.button}
                onClick={this.joinTournament}
              />

              <Button
                text={i18n.t('suggest_yourself')}
                appearance="_basic-accent"
                className={style.button}
                onClick={this.attendTournament}
              />
            </div>
          </div>

          <h3 className={style.subtitle}>Information</h3>

          <div className={style.list}>
            {description && (
              <div className={style.item}>
                <label className={style.title}>Description</label>
                <p className={style.value}>{description}</p>
              </div>
            )}

            {price && (
              <div className={style.item}>
                <label className={style.title}>Price</label>
                <p className={style.value}>{price} $</p>
              </div>
            )}

            {!isEmpty(rules) && (
              <div className={style.item}>
                <label className={style.title}>Rules</label>
                <p className={style.value}>KDA {Object.values(rules).join('/')}</p>
              </div>
            )}
          </div>

          {this.props.tournament && (
            <div className={style.widgets}>
              <TournamentApplicants id={this.props.match.params.id}/>
              <TournamentSummoners id={this.props.match.params.id}/>
              <TournamentViewers id={this.props.match.params.id}/>
              <TournamentMatches id={this.props.match.params.id}/>
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
