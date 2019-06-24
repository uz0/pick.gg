import React from 'react';
import classnames from 'classnames/bind';
import groupBy from 'lodash/groupBy';
import partition from 'lodash/partition';
import flatten from 'lodash/flatten';
import find from 'lodash/find';
import filter from 'lodash/filter';
import withStateHandlers from 'recompose/withStateHandlers';
import withHandlers from 'recompose/withHandlers';
import compose from 'recompose/compose';

import Modal from 'components/modal';

import style from './style.module.css';
import withProps from 'recompose/withProps';

const cx = classnames.bind(style);

const _players = [
  { _id: '1dsfdsfffwee', name: 'ADD', position: 'Top' },
  { _id: '2dsfdsfffwee', name: 'Aiming', position: 'Top' },
  { _id: '3dsfdsfffwee', name: 'Alphari', position: 'Top' },
  { _id: '4dsfdsfffwee', name: 'AmazingJ', position: 'Top' },
  { _id: '5dsfdsfffwee', name: 'Bang', position: 'Top' },
  { _id: '6dsfdsfffwee', name: 'Biubiu', position: 'Top' },
  { _id: '7dsfdsfffwee', name: 'Bjergsen', position: 'Top' },
  { _id: '8dsfdsfffwee', name: 'Broken', position: 'Top' },
  { _id: 'd11sfdsfffwee', name: 'Sangyoon', position: 'Top' },
  { _id: '22dsfdsfffwee', name: 'Selfmade', position: 'Top' },
  { _id: 'dsfdfdsfffwee', name: 'ShowMaker', position: 'Top' },
  { _id: 'dssdfdsfffwee', name: 'Santorin', position: 'Top' },
  { _id: 'ddfdsdsfdsfffwee', name: '369', position: 'Top' },
  { _id: 'dddfdsdsfdsfffwee', name: '169', position: 'Top' },
  { _id: 'dfdfdsdsfdsfffwee', name: '669', position: 'Top' },
];

const enhance = compose(
  withStateHandlers(
    ({ options }) => ({
      selectedPlayers: options.values.length > 0 ? options.values : [],
      filter: '',
    }),
    {
      clearFilter: state => () => ({ ...state, filter: '' }),
      handleFilterInput: state => e => ({ ...state, filter: e.target.value }),
      toggleSelectPlayer: state => id => {
        const { selectedPlayers } = state;
        console.log(state);
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
    choose: props => () => {
      props.options.onChoose(props.selectedPlayers);

      props.close();
    },
  }),
  withProps(({ choose }) => ({
    getSortedKeys: keys =>
      flatten(partition(keys, key => isNaN(parseInt(key, 10)))),
    actions: [
      {
        text: 'Choose',
        appearance: '_basic-accent',
        onClick: choose,
      },
    ],
  }))
);

export default enhance(props => {
  const players = filter(_players, player =>
    player.name.toLowerCase().startsWith(props.filter.toLowerCase())
  );
  const group = groupBy(players, player => player.name[0]);
  const isSelectedPlayersShown = props.selectedPlayers.length > 0;
  console.log(isSelectedPlayersShown);
  const isFiltering = props.filter.length > 0;
  console.log(props);
  return (
    <Modal
      title="Choose tournament players"
      close={props.close}
      className={style.modal_content}
      wrapClassName={style.wrapper}
      actions={props.actions}
    >
      <div className={style.sidebar}>
        <h3 className={style.title}>Choosen players</h3>

        {isSelectedPlayersShown ? (
          props.selectedPlayers.map((id, index) => {
            const player = find(_players, { _id: id });
            return (
              <p key={player._id} className={style.player}>
                {index + 1}. {player.name}
              </p>
            );
          })
        ) : (
          <p className={style.empty}>You haven`t chosen any players yet</p>
        )}
      </div>

      <div className={style.content}>
        <div className={style.search_container}>
          <input
            className={style.field}
            placeholder="Find a player"
            value={props.filter}
            onInput={props.handleFilterInput}
          />

          <button
            className={style.clear}
            type="button"
            onClick={props.clearFilter}
          >
            Clear
          </button>
        </div>

        <div className={style.players}>
          {isFiltering ? (
            <div className={style.section}>
              <div className={style.list}>
                {players.map(player => (
                  <button
                    key={player._id}
                    className={cx('item', {
                      '_is-selected': props.selectedPlayers.includes(player._id),
                    })}
                    type="button"
                    onClick={() => props.toggleSelectPlayer(player._id)}
                  >
                    {player.name}
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
                      className={cx('item', {
                        '_is-selected': props.selectedPlayers.includes(
                          player._id
                        ),
                      })}
                      type="button"
                      onClick={() => props.toggleSelectPlayer(player._id)}
                    >
                      {player.name}
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
