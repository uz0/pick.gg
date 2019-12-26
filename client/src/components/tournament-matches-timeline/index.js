/* eslint-disable complexity */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import get from 'lodash/get';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
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

  getMatchStatus = match => {
    let status = '';

    if (match.isActive) {
      status = 'active';
    } else if (match.endAt) {
      status = 'finished';
    } else {
      status = 'pending';
    }

    return status;
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

  renderTeam = (team, className) => {
    const { game } = get(this.props, 'tournament', '');

    return (
      <div className={cx(style.team, className)}>
        {team.users.map(user => {
          return (
            <button
              key={user._id}
              type="button"
              href="/player"
              className={style.player}
              onClick={this.openPlayerInfoModal({
                game,
                ...user,
              })}
            >
              <Avatar
                source={user.imageUrl}
                className={style.avatar}
              />

              <div className={style.name}>{user.gameSpecificName[game]}</div>
            </button>
          );
        })
        }
      </div>
    );
  }

  renderMatch = match => {
    const {
      _id: tournamentId,
      game,
      teams,
      isEmpty: isTournamentEmpty,
      isStarted,
      isApplicationsAvailable,
    } = get(this.props, 'tournament');

    const { isCurrentUserCanEdit } = getUserPermissions(this.props.currentUser, this.props.tournament);

    const matchesTeamsIds = Object.values(match.teams[game]);

    let [blueTeam, redTeam] = filter(teams, team => includes(matchesTeamsIds, team._id));

    if (!isEmpty(this.props.users.list)) {
      blueTeam = {
        ...blueTeam,
        users: blueTeam.users.map(userId => this.props.users.list[userId]),
      };

      redTeam = {
        ...redTeam,
        users: redTeam.users.map(userId => this.props.users.list[userId]),
      };
    }

    const isMatchActive = match.isActive;
    const isMatchOver = match.endAt;
    const matchStatus = this.getMatchStatus(match);
    const startMatchTime = moment(match.startedAt).format('HH:mm');

    const isDeleteButtonShown = isApplicationsAvailable || isTournamentEmpty;

    return (
      <li key={match._id} className={cx(style.match, { [style.isActive]: match.isActive })}>
        <div className={style.time}>{match.startedAt && startMatchTime}</div>
        <div className={style.statusContainer} title={i18n.t(`match_${matchStatus}`)}>
          <div className={cx(style.status, style[matchStatus])}>
            <Icon name={`match_${matchStatus}`}/>
          </div>
        </div>
        <div className={style.battle}>
          {match.isActive && !isEmpty(this.props.users.list) && this.renderTeam(blueTeam, style.topTeam)}

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

          {match.isActive && !isEmpty(this.props.users.list) && this.renderTeam(redTeam, style.bottomTeam)}
        </div>
      </li>
    );
  }

  render() {
    const {
      currentUser,
      tournament,
    } = this.props;

    const { isCurrentUserCanEdit } = getUserPermissions(currentUser, tournament);
    const isStarted = tournament && tournament.isStarted;

    const matches = get(this.props, 'tournament.matches').sort(this.sortMatches);

    return (
      <div className={style.widget}>
        <div className={style.header}>
          {isCurrentUserCanEdit && !isStarted && (
            <p className={style.empty}>{i18n.t('you_can_add_matches')}</p>
          )}

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
      users: state.users,
      tournament: state.tournaments.list[props.id],
      currentUser: state.currentUser,
    }),

    {
      toggleModal: modalActions.toggleModal,
      updateTournament: tournamentsActions.updateTournament,
    },
  ),
)(TournamentMatchesTimeline);
