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

  openMatchDetails = () => this.props.toggleModal({ id: 'match-results-modal' });

  openEditMatch = matchId => this.props.toggleModal({
    id: 'edit-match-modal',
    options: {
      tournamentId: this.props.id,
      matchId,
    },
  });

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

    const isTournamentReady = get(this.props, 'tournament.isReady');
    const isCurrentUserCreator = (currentUser && creator) && creator._id === currentUser._id;

    return (
      <div key={_id} className={className}>
        <div className={itemClass} style={nameStyle}>
          <span className={textClass}>{name}</span>
        </div>

        {isTournamentReady && (
          <div className={itemClass} style={pointsStyle}>
            <span className={style.points}>+123</span>
          </div>
        )}

        {isTournamentReady && (
          <button className={style.button} type="button" onClick={this.openMatchDetails}>
            <Icon name="list"/>
          </button>
        )}

        {isCurrentUserCreator && (
          <button
            type="button"
            className={style.button}
            onClick={() => this.openEditMatch(_id)}
          >
            <Icon name="info"/>
          </button>
        )}

        {!isTournamentReady && isCurrentUserCreator && (
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
    const { currentUser, className } = this.props;

    const matches = get(this.props, 'tournament.matches');
    const creator = get(this.props, 'tournament.creator');

    const isCurrentUserCreator = (currentUser && creator) && creator._id === currentUser._id;

    return (
      <div className={cx(style.matches, className)}>
        <div className={style.header}>
          <h3 className={style.subtitle}>Matches</h3>
          {isCurrentUserCreator && matches.length > 0 && (
            <button
              type="button"
              className={style.button}
              onClick={this.addMatch}
            >
              Add
            </button>
          )}
        </div>

        {isCurrentUserCreator && matches.length === 0 && (
          <p className={style.empty}>You can add matches</p>
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
              emptyMessage="There is no matches yet"
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
