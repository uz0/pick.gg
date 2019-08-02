import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import get from 'lodash/get';
import filter from 'lodash/filter';
import { http } from 'helpers';
import Table from 'components/table';
import Button from 'components/button';
import Icon from 'components/icon';
import classnames from 'classnames/bind';
import { withCaptions } from 'hoc';
import { actions as modalActions } from 'components/modal-container';
import { actions as tournamentsActions } from 'pages/tournaments';
import style from './style.module.css';
import i18n from 'i18next';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  name: {
    text: t('name'),
    width: isMobile ? 200 : 250,
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

  renderRow = ({ className, itemClass, textClass, item, captions }) => {
    const nameStyle = { '--width': captions.name.width };
    const pointsStyle = { '--width': captions.number.width };

    const { _id, name } = item;

    const tournamentId = get(this.props, 'tournament._id');
    const creator = get(this.props, 'tournament.creator');
    const currentUser = get(this.props, 'currentUser');

    const isForecastingActive = get(this.props, 'tournament.isForecastingActive');
    const isEmpty = get(this.props, 'tournament.isEmpty');
    const isStarted = get(this.props, 'tournament.isStarted');
    const isApplicationsAvailable = get(this.props, 'tournament.isApplicationsAvailable');
    const isMatchActive = item.isActive;
    const isMatchOver = item.endAt;

    const isCurrentUserCreator = (currentUser && creator) && creator._id === currentUser._id;
    const isDeleteButtonShown = (isApplicationsAvailable || isEmpty);

    return (
      <div key={_id} className={cx(className, { [style.is_active]: isMatchActive })}>
        <div className={itemClass} style={nameStyle}>
          <span className={textClass}>{name}</span>
        </div>

        {isCurrentUserCreator && isStarted && !isMatchOver && !isMatchActive && (
          <button
            type="button"
            className={style.button}
            title="Start match"
            onClick={() => this.startMatch(tournamentId, _id)}
          >
            <Icon name="play" />
          </button>
        )}

        {isCurrentUserCreator && isStarted && isMatchActive && (
          <button
            type="button"
            className={style.button}
            title="End match"
            onClick={() => this.endMatch(tournamentId, _id)}
          >
            <Icon name="stop" />
          </button>
        )}

        {isCurrentUserCreator && isStarted && isMatchOver && (
          <button
            type="button"
            className={style.button}
            title="Add match results"
            onClick={() => this.openEditMatch(_id)}
          >
            <Icon name="info" />
          </button>
        )}

        {isMatchOver && (
          <button className={style.button} type="button" onClick={() => this.openMatchResults(_id)}>
            <Icon name="list" />
          </button>
        )}

        {isCurrentUserCreator && isDeleteButtonShown && (
          <button
            type="button"
            className={cx(style.button, style.danger)}
            onClick={() => this.deleteMatch(tournamentId, _id)}
          >
            <Icon name="close" />
          </button>
        )}
      </div>
    );
  };

  render() {
    const {
      currentUser,
      className,
    } = this.props;

    const matches = get(this.props, 'tournament.matches');
    const creator = get(this.props, 'tournament.creator');
    const isStarted = get(this.props, 'tournament.isStarted');
    const isFinalized = get(this.props, 'tournament.isFinalized');

    const isCurrentUserCreator = (currentUser && creator) && creator._id === currentUser._id;
    const isEditingAvailable = isCurrentUserCreator && matches.length > 0 && !isStarted;

    return (
      <div className={cx(style.matches, className)}>
        <div className={style.header}>
          <h3 className={style.subtitle}>Matches</h3>
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

        {isCurrentUserCreator && matches.length === 0 && (
          <p className={style.empty}>{i18n.t('you_can_add_matches')}</p>
        )}

        <div className={style.content}>
          {isCurrentUserCreator && matches.length === 0 && (
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
