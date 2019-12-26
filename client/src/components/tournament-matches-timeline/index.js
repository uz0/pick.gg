/* eslint-disable complexity */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import get from 'lodash/get';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import classnames from 'classnames/bind';
import { actions as tournamentsActions } from 'pages/tournaments';
import moment from 'moment';

import Button from 'components/button';
import Avatar from 'components/avatar';
import Icon from 'components/icon';
import { actions as modalActions } from 'components/modal-container';

import { http, getUserPermissions } from 'helpers';

import { withCaptions } from 'hoc';

import i18n from 'i18next';

import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  name: {
    text: t('name'),
    width: isMobile ? 110 : 250,
  },

  number: {
    text: t('points'),
    width: isMobile ? 40 : 65,
  },
});

class TournamentMatchesTimeline extends Component {
  addMatch = () => this.props.toggleModal({
    id: 'add-match-modal',

    options: {
      tournamentId: this.props.id,
    },
  });

  openMatchResults = matchId => this.props.toggleModal({
    id: 'match-results-modal',
    options: {
      tournamentId: this.props.id,
      matchId,
    },
  });

  openEditMatch = matchId => this.props.toggleModal({
    id: 'edit-match-modal',
    options: {
      tournamentId: this.props.id,
      matchId,
    },
  });

  startMatch = async (tournamentId, matchId) => {
    try {
      const startMatchRequest = await http(`/api/tournaments/${tournamentId}/matches/${matchId}/start`, { method: 'PATCH' });
      const updatedTournament = await startMatchRequest.json();

      this.props.updateTournament({ ...updatedTournament });
    } catch (error) {
      console.log(error, 'error');
    }
  };

  endMatch = async (tournamentId, matchId) => {
    try {
      const endMatchRequest = await http(`/api/tournaments/${tournamentId}/matches/${matchId}/end`, { method: 'PATCH' });
      const updatedTournament = await endMatchRequest.json();

      this.props.updateTournament({ ...updatedTournament });
    } catch (error) {
      console.log(error, 'error');
    }
  };

  openPlayerInfoModal = playerInfo => () => this.props.toggleModal({ id: 'player-info', options: { playerInfo } });

  deleteMatch = async (tournamentId, matchId) => {
    try {
      await http(`/api/tournaments/${tournamentId}/matches/${matchId}`, { method: 'DELETE' });
    } catch (error) {
      console.log(error, 'error');
    }

    const tournamentMatches = get(this.props, 'tournament.matches');
    const matches = filter(tournamentMatches, match => match._id !== matchId);

    this.props.updateTournament({
      ...this.props.tournament,
      matches,
    });
  }

  sortMatches = (prev, next) => {
    if (!prev.startedAt && !next.startedAt) {
      return 1;
    }

    if (!prev.startedAt) {
      return 1;
    }

    if (!next.startedAt) {
      return -1;
    }

    return new Date(prev.startedAt) - new Date(next.startedAt);
  };

  renderMatch = match => {
    let matchStatus = '';

    const {
      _id: tournamentId,
      isEmpty,
      isStarted,
      isApplicationsAvailable,
    } = get(this.props, 'tournament');

    const { isCurrentUserCanEdit } = getUserPermissions(this.props.currentUser, this.props.tournament);

    const isMatchActive = match.isActive;
    const isMatchOver = match.endAt;

    const startMatchTime = moment(match.startedAt).format('HH:mm');
    const endMatchTime = moment(match.endAt).format('HH:mm');

    const isDeleteButtonShown = isApplicationsAvailable || isEmpty;

    if (match.isActive) {
      matchStatus = 'active';
    } else if (match.endAt && endMatchTime) {
      matchStatus = 'finished';
    } else {
      matchStatus = 'pending';
    }

    return (
      <li key={match._id} className={cx(style.match, { [style.isActive]: match.isActive })}>
        <div className={style.time}>{match.startedAt && startMatchTime}</div>
        <div className={style.statusContainer} title={i18n.t(`match_${matchStatus}`)}>
          <div className={cx(style.status, style[matchStatus])}>
            <Icon name={`match_${matchStatus}`}/>
          </div>
        </div>
        <div className={style.battle}>
          {match.isActive && (
            <div className={cx(style.team, style.topTeam)}>
              {[1, 2, 3, 4, 5].map(userId => {
                const user = this.props.currentUser;

                const options = {
                  nickname: 'nick',
                  imageUrl: user.imageUrl,
                  about: 'about',
                  points: 11,
                };

                return (
                  <button
                    key={userId}
                    type="button"
                    href="/player"
                    className={style.player}
                    onClick={this.openPlayerInfoModal(options)}
                  >
                    <Avatar
                      source={user.imageUrl}
                      className={style.avatar}
                    />

                    <div className={style.name}>{user.username}</div>
                  </button>
                );
              })
              }
            </div>
          )}

          <div className={style.title}>
            <h4>{match.name}</h4>
            <div className={style.controls}>
              {isCurrentUserCanEdit && isStarted && !isMatchOver && !isMatchActive && (
                <button
                  type="button"
                  className={cx('control', style.statusControl)}
                  onClick={() => this.startMatch(tournamentId, match._id)}
                >
                  <Icon name="play"/>
                </button>
              )}

              {isCurrentUserCanEdit && isStarted && isMatchActive && (
                <button
                  type="button"
                  className={cx('control', style.statusControl)}
                  onClick={() => this.endMatch(tournamentId, match._id)}
                >
                  <Icon name="stop"/>
                </button>
              )}

              {isCurrentUserCanEdit && isDeleteButtonShown && (
                <button
                  type="button"
                  className={cx(style.button, style.danger)}
                  onClick={() => this.deleteMatch(tournamentId, match._id)}
                >
                  <Icon name="close"/>
                </button>
              )}

              {isCurrentUserCanEdit && isStarted && isMatchOver && (
                <button
                  type="button"
                  className={cx('control')}
                  title="Add match results"
                  onClick={() => this.openEditMatch(match._id)}
                >
                  <Icon name="edit"/>
                </button>
              )}

              {isMatchOver && (
                <button
                  type="button"
                  className={cx('control', style.results)}
                  onClick={() => this.openMatchResults(match._id)}
                >
                  Результаты
                </button>
              )}

            </div>
          </div>

          {match.isActive && (
            <div className={cx(style.team, style.bottomTeam)}>
              {[1, 2, 3, 4, 5].map(userId => {
                const user = this.props.currentUser;

                return (
                  <button key={userId} type="button" href="/player" className={style.player}>
                    <Avatar
                      source={user.imageUrl}
                      className={style.avatar}
                    />

                    <div className={style.name}>{user.username}</div>
                  </button>
                );
              })
              }
            </div>
          )}
        </div>
      </li>
    );
  }

  render() {
    const {
      currentUser,
      tournament,
    } = this.props;

    const matches = get(this.props, 'tournament.matches').sort(this.sortMatches);
    const isStarted = get(this.props, 'tournament.isStarted');

    const isCurrentUserAdmin = currentUser && currentUser.isAdmin;
    const isCurrentUserModerator = currentUser && includes(tournament.moderators, currentUser._id);
    const isCurrentUserCanEdit = isCurrentUserAdmin || isCurrentUserModerator;

    return (
      <div className={style.widget}>
        <div className={style.header}>
          {isCurrentUserCanEdit && !isStarted && <p className={style.empty}>{i18n.t('you_can_add_matches')}</p>}

          {isCurrentUserCanEdit && !isStarted && (
            <Button
              appearance="_small-accent"
              text="Add match"
              className={style.button}
              onClick={this.addMatch}
            />
          )}
        </div>

        {matches.length > 0 && (
          <div className={style.matches}>
            <ul className={style.list}>
              {matches.map(match => this.renderMatch(match))}
            </ul>
          </div>
        )
        }
      </div>
    );
  }
}

export default compose(
  withCaptions(tableCaptions),

  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.id],
      currentUser: state.currentUser,
    }),

    {
      toggleModal: modalActions.toggleModal,
      updateTournament: tournamentsActions.updateTournament,
    },
  ),
)(TournamentMatchesTimeline);
