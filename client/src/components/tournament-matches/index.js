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

import Table from 'components/table';
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

class Matches extends Component {
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

  renderRow = ({ className, itemClass, textClass, item, captions }) => {
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

  render() {
    const {
      currentUser,
      className,
      tournament,
    } = this.props;

    const matches = get(this.props, 'tournament.matches')
      .sort(this.sortMatches);

    const creator = get(this.props, 'tournament.creator');
    const isStarted = get(this.props, 'tournament.isStarted');

    const isCurrentUserCreator = (currentUser && creator) && creator._id === currentUser._id;
    const isCurrentUserAdmin = currentUser && currentUser.isAdmin;
    const isCurrentUserModerator = includes(tournament.moderators, currentUser._id);
    const isCurrentUserCanEdit = isCurrentUserCreator || isCurrentUserAdmin || isCurrentUserModerator;

    const isEditingAvailable = (isCurrentUserCreator || isCurrentUserAdmin || isCurrentUserModerator) && matches.length > 0 && !isStarted;
    return (
      <div className={cx(style.matches, className)}>
        <div className={style.header}>
          <h3 className={style.subtitle}>{i18n.t('matches')}</h3>
          {isEditingAvailable && (
            <button
              type="button"
              className={style.button}
              onClick={this.addMatch}
            >
              {i18n.t('add')}
            </button>
          )}
        </div>

        {isCurrentUserCanEdit && matches.length === 0 && (
          <p className={style.empty}>{i18n.t('you_can_add_matches')}</p>
        )}

        <div className={style.content}>
          {isCurrentUserCanEdit && matches.length === 0 && (
            <Button
              appearance="_circle-accent"
              icon="plus"
              className={style.button}
              onClick={this.addMatch}
            />
          )}

          {matches.length > 0 && (
            <Table
              noCaptions
              captions={this.props.captions}
              items={matches}
              renderRow={this.renderRow}
              className={style.table}
              emptyMessage={i18n.t('no_matches_yet')}
            />
          )}
        </div>

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
)(Matches);
