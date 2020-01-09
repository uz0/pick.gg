import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import groupBy from 'lodash/groupBy';
import partition from 'lodash/partition';
import flatten from 'lodash/flatten';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import { actions as tournamentsActions } from 'pages/tournaments';

import Modal from 'components/modal';

import { http } from 'helpers';

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
        .filter(player => !isEmpty(player.gameSpecificFields[game].displayName))
        .sort((player, nextPlayer) => player.gameSpecificFields[game].displayName
          .localeCompare(nextPlayer.gameSpecificFields[game].displayName));

      return {
        disabledPlayers: options.disabledPlayers,
        selectedPlayers: options.selectedPlayers,
        playersList: players,
        filter: '',
        isSubmitting: false,
      };
    },

    {
      clearFilter: state => () => ({ ...state, filter: '' }),
      handleFilterInput: state => e => ({ ...state, filter: e.target.value }),
      toggleSubmitting: state => () => ({ ...state, isSubmitting: !state.isSubmitting }),
      toggleSelectPlayer: state => id => {
        const { selectedPlayers } = state;
        if (selectedPlayers.length >= 10) {
          return state;
        }

        return {
          ...state,
          selectedPlayers: selectedPlayers.includes(id) ?
            selectedPlayers.filter(nextId => nextId !== id) :
            [...selectedPlayers, id],
        };
      },
    }
  ),
  withHandlers({
    choose: props => async () => {
      props.toggleSubmitting();

      const { selectedPlayers } = props;
      const { tournamentId } = props.options;

      try {
        const response = await http(`/api/tournaments/${tournamentId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ summoners: selectedPlayers }),
        });

        const { tournament } = await response.json();
        props.updateTournament(tournament);
        props.close();
      } catch (error) {
        console.log(error);
      }
    },
  }),
  withProps(() => ({
    getSortedKeys: keys => flatten(partition(keys, key => isNaN(parseInt(key, 10)))),
  }))
);

export default enhance(props => {
  const { isSubmitting, playersList, game } = props;

  const players = filter(playersList, player =>
    player.gameSpecificFields[game].displayName.toLowerCase().startsWith(props.filter.toLowerCase())
  );
  const group = groupBy(players, player => player.gameSpecificFields[game].displayName[0]);

  const isSelectedPlayers = props.selectedPlayers.length > 0;
  const isFiltering = props.filter.length > 0;

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
          props.options.action(props.selectedPlayers);
          props.close();
        },
      }]}
    >
      <div className={style.sidebar}>
        <h3 className={style.title}>{i18n.t('players_modal.chosen_players')}</h3>

        {(isSelectedPlayers && !isFiltering) ? (
          props.selectedPlayers.map((id, index) => {
            const player = find(props.users, { _id: id });

            return (
              <p key={player._id} className={style.player}>
                {index + 1}. {player.gameSpecificFields[game].displayName}
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
            value={props.filter}
            onChange={props.handleFilterInput}
          />

          <button
            className={style.clear}
            type="button"
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
                    disabled={props.disabledPlayers.includes(player._id)}
                    className={cx('item', {
                      '_is-selected': props.selectedPlayers.includes(player._id),
                    })}
                    type="button"
                    onClick={() => props.toggleSelectPlayer(player._id)}
                  >
                    {player.gameSpecificFields[game].displayName}
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
                      disabled={props.disabledPlayers.includes(player._id)}
                      className={cx('item', {
                        '_is-selected': props.selectedPlayers.includes(
                          player._id
                        ),
                      })}
                      type="button"
                      onClick={() => props.toggleSelectPlayer(player._id)}
                    >
                      {player.gameSpecificFields[game].displayName}
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
