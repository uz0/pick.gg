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
import Icon from 'components/icon';
import { actions as modalActions } from 'components/modal-container';

import { http } from 'helpers';

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

  renderMatch = ({ className, itemClass, textClass, item, captions }) => {
    const nameStyle = { '--width': captions.name.width };

    const { _id, name } = item;

    const tournamentId = get(this.props, 'tournament._id');
    const creator = get(this.props, 'tournament.creator');
    const currentUser = get(this.props, 'currentUser');
    const tournament = get(this.props, 'tournament');

    const isEmpty = get(this.props, 'tournament.isEmpty');
    const isStarted = get(this.props, 'tournament.isStarted');
    const isApplicationsAvailable = get(this.props, 'tournament.isApplicationsAvailable');
    const isMatchActive = item.isActive;
    const isMatchOver = item.endAt;
    const startMatchTime = moment(item.startedAt).format('hh:mm');
    const endMatchTime = moment(isMatchOver).format('hh:mm');

    const isCurrentUserCreator = (currentUser && creator) && creator._id === currentUser._id;
    const isCurrentUserAdmin = currentUser && currentUser.isAdmin;
    const isCurrentUserModerator = includes(tournament.moderators, currentUser._id);
    const isEditingAvailable = isCurrentUserCreator || isCurrentUserAdmin || isCurrentUserModerator;

    const isDeleteButtonShown = (isApplicationsAvailable || isEmpty);

    return (
      <div key={_id} className={cx(className, { [style.is_active]: isMatchActive }, { [style.is_over]: isMatchOver })}>
        <div className={itemClass} style={nameStyle}>
          <span className={textClass}>{name}</span>
        </div>

        {isMatchOver && (
          <div>
            <div className={cx(style.status_match, { [style.is_active_match]: isMatchActive })}>
              <span className={cx(textClass, style.time_match)}>{startMatchTime} - {endMatchTime}</span>
            </div>

            <div className={style.status_match}>
              <span className={textClass}>{i18n.t('is_over_match')}</span>
            </div>
          </div>
        )}

        {isMatchActive && (
          <div>
            <div className={cx(style.status_match, { [style.is_active_match]: isMatchActive })}>
              <span className={cx(textClass, style.time_match)}>{startMatchTime}</span>
            </div>
            <div className={cx(style.status_match, { [style.is_active_match]: isMatchActive })}>
              <span className={textClass}>{i18n.t('is_active_match')}</span>
            </div>
          </div>
        )}

        {isEditingAvailable && isStarted && !isMatchOver && !isMatchActive && (
          <button
            type="button"
            className={style.button}
            title="Start match"
            onClick={() => this.startMatch(tournamentId, _id)}
          >
            <Icon name="play"/>
          </button>
        )}

        {isEditingAvailable && isStarted && isMatchActive && (
          <button
            type="button"
            className={style.button}
            title="End match"
            onClick={() => this.endMatch(tournamentId, _id)}
          >
            <Icon name="stop"/>
          </button>
        )}

        {isEditingAvailable && isStarted && isMatchOver && (
          <button
            type="button"
            className={style.button}
            title="Add match results"
            onClick={() => this.openEditMatch(_id)}
          >
            <Icon name="info"/>
          </button>
        )}

        {isMatchOver && (
          <button className={style.button} type="button" onClick={() => this.openMatchResults(_id)}>
            <Icon name="list"/>
          </button>
        )}

        {isEditingAvailable && isDeleteButtonShown && (
          <button
            type="button"
            className={cx(style.button, style.danger)}
            onClick={() => this.deleteMatch(tournamentId, _id)}
          >
            <Icon name="close"/>
          </button>
        )}
      </div>
    );
  };

  renderNewMatch = match => {
    let matchStatus = '';
    const tournamentId = get(this.props, 'tournament._id');

    if (matchStatus.isActive) {
      matchStatus = 'active';
    } else if (matchStatus.endAt) {
      matchStatus = 'finished';
    } else {
      matchStatus = 'pending';
    }

    return (
      <li className={style.match}>
        <div className={style.time}>{match.startedAt && match.startedAt}</div>
        <div className={cx(style.status, style[matchStatus])} title={i18n.t(`match_${matchStatus}`)}>
          <Icon name={`match_${matchStatus}`}/>
        </div>
        <div className={style.battle}>
          {/* <div className={style.team}>
            {[1, 2, 3, 4, 5].map(match => (
              <a key={match} href="#" className={style.player}>
                <div className={style.avatar} style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/a-/AAuE7mDaFmmgPUop7zXorRQKrlRdXgMCLJNogOpyKUMChQ=s96-c)' }}/>
                <div className={style.name}>Player Name {match === 1 ? 'asdasdasdasdasdasdasdasdasd' : ''}</div>
                <div className={style.role}>Cool support</div>
              </a>
            ))
            }
          </div> */}

          <div className={style.title}>
            <h4>{match.name}</h4>
            <div className={style.controls}>
              <button type="button" className={cx('control', style.statusControl)} onClick={() => {}}>
                <Icon name="play"/>
              </button>
              <button type="button" className={cx('control', style.results)} onClick={() => this.openMatchResults(match._id)}>
                <Icon name="list"/>
              </button>
              <button type="button" className={cx('control', style.delete)} onClick={() => this.deleteMatch(tournamentId, match._id)}>
                <Icon name="close"/>
              </button>
            </div>
          </div>

          {/* <div className={style.team}>
            {[1, 2, 3, 4, 5].map(match => (
              <a key={match} href="#" className={style.player}>
                <div className={style.avatar} style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/a-/AAuE7mDaFmmgPUop7zXorRQKrlRdXgMCLJNogOpyKUMChQ=s96-c)' }}/>
                <div className={style.name}>Player Name</div>
                <div className={style.role}>Cool support</div>
              </a>
            ))
            }
          </div> */}
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

    const creator = get(this.props, 'tournament.creator');
    const isStarted = get(this.props, 'tournament.isStarted');

    const isCurrentUserCreator = (currentUser && creator) && creator._id === currentUser._id;
    const isCurrentUserAdmin = currentUser && currentUser.isAdmin;
    const isCurrentUserModerator = includes(tournament.moderators, currentUser._id);
    const isCurrentUserCanEdit = isCurrentUserAdmin || isCurrentUserModerator;

    const isEditingAvailable = (isCurrentUserCreator || isCurrentUserAdmin || isCurrentUserModerator) && matches.length > 0 && !isStarted;

    console.log(isEditingAvailable, 'isEditingAvailable');
    console.log(matches.length, 'matches.length');
    console.log(!isStarted, '!isStarted');

    return (
      <div className={style.widget}>
        <div className={style.header}>
          {isCurrentUserCanEdit && <p className={style.empty}>{i18n.t('you_can_add_matches')}</p>}

          {isCurrentUserCanEdit && (
            <Button
              appearance="_small-accent"
              text="Add match"
              className={style.button}
              onClick={this.addMatch}
            />
          )}
        </div>

        {/* {isEditingAvailable && (
          <button
            type="button"
            className={style.button}
            onClick={this.addMatch}
          >
            {i18n.t('add')}
          </button>
        )} */}

        {matches.length > 0 && (
          <div className={style.matches}>
            <ul className={style.list}>
              {matches.map(match => this.renderNewMatch(match))}
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
