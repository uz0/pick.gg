import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import groupBy from 'lodash/groupBy';
import partition from 'lodash/partition';
import flatten from 'lodash/flatten';
import find from 'lodash/find';
import filter from 'lodash/filter';
import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';

import { http } from 'helpers';
import { actions as tournamentsActions } from 'pages/tournaments';

import Modal from 'components/modal';

import style from './style.module.css';

const cx = classnames.bind(style);

const enhance = compose(
  connect(
    null,

    {
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withStateHandlers(
    ({ options }) => {
      const summoners = Object
        .values(options.summoners)
        .filter(summoner => summoner.summonerName !== '')
        .sort((summoner, nextsummoner) => summoner.summonerName.localeCompare(nextsummoner.summonerName));

      return {
        selectedSummoners: options.selectedSummoners.length > 0 ? options.selectedSummoners : [],
        summonersList: summoners,
        filter: '',
      };
    },

    {
      clearFilter: state => () => ({ ...state, filter: '' }),
      handleFilterInput: state => e => ({ ...state, filter: e.target.value }),
      toggleSelectSummoner: state => id => {
        const { selectedSummoners } = state;
        if (selectedSummoners.length >= 10) {
          return state;
        }

        return {
          ...state,
          selectedSummoners: selectedSummoners.includes(id) ?
            selectedSummoners.filter(nextId => nextId !== id) :
            [...selectedSummoners, id],
        };
      },
    }
  ),
  withHandlers({
    choose: props => async () => {
      const { selectedSummoners } = props;
      const { tournamentId } = props.options;

      try {
        await http(`/api/tournaments/${tournamentId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ summoners: selectedSummoners }),
        });

        props.updateTournament({
          _id: tournamentId,
          summoners: selectedSummoners,
        });

        props.close();
      } catch (error) {
        console.log(error);
      }
    },
  }),
  withProps(({ choose }) => ({
    getSortedKeys: keys => flatten(partition(keys, key => isNaN(parseInt(key, 10)))),
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
  const { summonersList } = props;

  const summoners = filter(summonersList, summoner =>
    summoner.summonerName.toLowerCase().startsWith(props.filter.toLowerCase())
  );
  const group = groupBy(summoners, summoner => summoner.summonerName[0]);

  const isSelectedSummoners = props.selectedSummoners.length > 0;
  const isFiltering = props.filter.length > 0;
  return (
    <Modal
      title="Choose tournament summoners"
      close={props.close}
      className={style.modal_content}
      wrapClassName={style.wrapper}
      actions={props.actions}
    >
      <div className={style.sidebar}>
        <h3 className={style.title}>Choosen summoners</h3>

        {isSelectedSummoners ? (
          props.selectedSummoners.map((id, index) => {
            const summoner = find(summoners, { _id: id });
            return (
              <p key={summoner._id} className={style.summoner}>
                {index + 1}. {summoner.summonerName}
              </p>
            );
          })
        ) : (
          <p className={style.empty}>You haven`t chosen any summoners yet</p>
        )}
      </div>

      <div className={style.content}>
        <div className={style.search_container}>
          <input
            className={style.field}
            placeholder="Find a summoner by name"
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

        <div className={style.summoners}>
          {isFiltering ? (
            <div className={style.section}>
              <div className={style.list}>
                {summoners.map(summoner => (
                  <button
                    key={summoner._id}
                    className={cx('item', {
                      '_is-selected': props.selectedSummoners.includes(summoner._id),
                    })}
                    type="button"
                    onClick={() => props.toggleSelectSummoner(summoner._id)}
                  >
                    {summoner.summonerName}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            props.getSortedKeys(Object.keys(group)).map(key => (
              <div key={key} className={style.section}>
                <h3 className={style.letter}>{key}</h3>

                <div className={style.list}>
                  {group[key].map(summoner => (
                    <button
                      key={summoner._id}
                      className={cx('item', {
                        '_is-selected': props.selectedSummoners.includes(
                          summoner._id
                        ),
                      })}
                      type="button"
                      onClick={() => props.toggleSelectSummoner(summoner._id)}
                    >
                      {summoner.summonerName}
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
