import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import groupBy from 'lodash/groupBy';
import partition from 'lodash/partition';
import flatten from 'lodash/flatten';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import includes from 'lodash/includes';
import concat from 'lodash/concat';
import map from 'lodash/map';
import assign from 'lodash/assign';
import eq from 'lodash/eq';
import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';
import withProps from 'recompose/withProps';
import { actions as tournamentsActions } from 'pages/tournaments';

import Modal from 'components/modal';

import { getPlayerName } from 'helpers';

import i18n from 'i18n';

import style from './style.module.css';

const cx = classnames.bind(style);

const enhance = compose(
  connect(
    (state, props) => ({
      game: state.tournaments.list[props.options.tournamentId].game,
      users: state.users.list,
    }),

    {
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withStateHandlers(
    ({ options, users, game }) => {
      const players = Object
        .values(users)
        .filter(player => !isEmpty(getPlayerName(player, game)))
        .sort((player, nextPlayer) => getPlayerName(player, game).localeCompare(getPlayerName(nextPlayer, game)));

      return {
        disabledPlayers: get(options, 'disabledPlayers', []),
        selectedPlayers: get(options, 'selectedPlayers', []),
        playersList: players,
        filterValue: '',
        isSubmitting: false,
      };
    },

    {
      clearFilter: state => () => assign(state, { filterValue: '' }),
      handleFilterInput: state => event => assign(state, { filterValue: event.target.value }),
      toggleSubmitting: state => () => assign(state, { isSubmitting: !state.isSubmitting }),
      toggleSelectPlayer: state => id => {
        let { selectedPlayers } = state;

        if (selectedPlayers.length >= 10) {
          return state;
        }

        selectedPlayers = includes(selectedPlayers, id) ?
          filter(selectedPlayers, playerId => !eq(playerId, id)) :
          concat(selectedPlayers, id);

        return assign(state, { selectedPlayers });
      },
    }
  ),
  withProps(() => ({
    getSortedKeys: keys => flatten(partition(keys, key => isNaN(parseInt(key, 10)))),
  }))
);

export default enhance(props => {
  const {
    selectedPlayers,
    isSubmitting,
    playersList,
    filterValue,
    game,
  } = props;

  const players = filter(playersList, player => {
    const [lowerCaseName, lowerCaseFilter] = map([getPlayerName(player, game), filterValue], item => item.toLowerCase());

    return lowerCaseName.startsWith(lowerCaseFilter);
  });

  const group = groupBy(players, player => getPlayerName(player, game)[0]);

  const isSelectedPlayers = !isEmpty(selectedPlayers);
  const isFiltering = !isEmpty(filterValue);

  return (
    <Modal
      title={i18n.t('players_modal.title')}
      close={props.close}
      className={style.modal_content}
      wrapClassName={style.wrapper}
      actions={[{
        text: i18n.t('players_modal.action'),
        appearance: '_basic-accent',
        disabled: isSubmitting,
        onClick: () => {
          props.toggleSubmitting();
          props.options.action(selectedPlayers);
          props.close();
        },
      }]}
    >
      <div className={style.sidebar}>
        <h3 className={style.title}>{i18n.t('players_modal.chosen_players')}</h3>

        {(isSelectedPlayers && !isFiltering) ? (
          selectedPlayers.map((id, index) => {
            const player = find(props.users, { _id: id });

            return (
              <p key={player._id} className={style.player}>
                {index + 1}. {getPlayerName(player, game)}
              </p>
            );
          })
        ) : (
          <p className={style.empty}>{i18n.t('players_modal.empty')}</p>
        )}
      </div>

      <div className={style.content}>
        <div className={style.search_container}>
          <input
            className={style.field}
            placeholder={i18n.t('players_modal.filter_placeholder')}
            value={filterValue}
            onChange={props.handleFilterInput}
          />

          <button
            type="button"
            className={style.clear}
            onClick={props.clearFilter}
          >
            {i18n.t('clear_button')}
          </button>
        </div>

        <div className={style.players}>
          {isFiltering ? (
            <div className={style.section}>
              <div className={style.list}>
                {players.map(player => (
                  <button
                    key={player._id}
                    type="button"
                    disabled={includes(props.disabledPlayers, player._id)}
                    className={cx('item', { '_is-selected': includes(selectedPlayers, player._id) })}
                    onClick={() => props.toggleSelectPlayer(player._id)}
                  >
                    {getPlayerName(player, game)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            props.getSortedKeys(Object.keys(group)).map(key => (
              <div key={key} className={style.section}>
                <h3 className={style.letter}>{key}</h3>

                <div className={style.list}>
                  {group[key].map(player => (
                    <button
                      key={player._id}
                      type="button"
                      disabled={includes(props.disabledPlayers, player._id)}
                      className={cx('item', { '_is-selected': includes(selectedPlayers, player._id) })}
                      onClick={() => props.toggleSelectPlayer(player._id)}
                    >
                      {getPlayerName(player, game)}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
});
