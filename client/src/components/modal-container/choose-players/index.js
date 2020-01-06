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
    null,

    {
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withStateHandlers(
    ({ options }) => {
      const summoners = Object
        .values(options.summoners)
        .filter(summoner => !isEmpty(summoner.gameSpecificFields[options.game].displayName))
        .sort((summoner, nextsummoner) => summoner.gameSpecificFields[options.game].displayName
          .localeCompare(nextsummoner.gameSpecificFields[options.game].displayName));

      return {
        selectedSummoners: options.selectedSummoners.length > 0 ? options.selectedSummoners : [],
        summonersList: summoners,
        filter: '',
        isSubmitting: false,
      };
    },

    {
      clearFilter: state => () => ({ ...state, filter: '' }),
      handleFilterInput: state => e => ({ ...state, filter: e.target.value }),
      toggleSubmitting: state => () => ({ ...state, isSubmitting: !state.isSubmitting }),
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
      props.toggleSubmitting();

      const { selectedSummoners } = props;
      const { tournamentId } = props.options;

      try {
        const response = await http(`/api/tournaments/${tournamentId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ summoners: selectedSummoners }),
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
  const { isSubmitting, summonersList } = props;
  const { game } = props.options;

  const summoners = filter(summonersList, summoner =>
    summoner.gameSpecificFields[game].displayName.toLowerCase().startsWith(props.filter.toLowerCase())
  );
  const group = groupBy(summoners, summoner => summoner.gameSpecificFields[game].displayName[0]);

  const isSelectedSummoners = props.selectedSummoners.length > 0;
  const isFiltering = props.filter.length > 0;

  return (
    <Modal
      title={i18n.t('modal.choose_tournament_summoners')}
      close={props.close}
      className={style.modal_content}
      wrapClassName={style.wrapper}
      actions={[{
        text: 'Choose',
        appearance: '_basic-accent',
        disabled: isSubmitting,
        onClick: props.choose,
      }]}
    >
      <div className={style.sidebar}>
        <h3 className={style.title}>Choosen summoners</h3>

        {(isSelectedSummoners && !isFiltering) ? (
          props.selectedSummoners.map((id, index) => {
            const summoner = find(summoners, { _id: id });
            return (
              <p key={summoner._id} className={style.summoner}>
                {index + 1}. {summoner.gameSpecificFields[game].displayName}
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
            placeholder={i18n.t('modal.find_summoner_name')}
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
                    {summoner.gameSpecificFields[game].displayName}
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
                      {summoner.gameSpecificFields[game].displayName}
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
