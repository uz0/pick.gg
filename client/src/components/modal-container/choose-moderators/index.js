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
      const moderators = Object
        .values(options.moderators)
        .filter(moderator => !isEmpty(moderator.gameSpecificFields[options.game].displayName))
        .sort((moderator, nextmoderator) => moderator.gameSpecificFields[options.game].displayName
          .localeCompare(nextmoderator.gameSpecificFields[options.game].displayName));

      return {
        selectedModerators: options.selectedModerators.length > 0 ? options.selectedModerators : [],
        moderatorsList: moderators,
        filter: '',
        isSubmitting: false,
      };
    },

    {
      clearFilter: state => () => ({ ...state, filter: '' }),
      handleFilterInput: state => e => ({ ...state, filter: e.target.value }),
      toggleSubmitting: state => () => ({ ...state, isSubmitting: !state.isSubmitting }),
      toggleSelectModerator: state => id => {
        const { selectedModerators } = state;
        if (selectedModerators.length >= 10) {
          return state;
        }

        return {
          ...state,
          selectedModerators: selectedModerators.includes(id) ?
            selectedModerators.filter(nextId => nextId !== id) :
            [...selectedModerators, id],
        };
      },
    }
  ),
  withHandlers({
    choose: props => async () => {
      props.toggleSubmitting();

      const { selectedModerators } = props;
      const { tournamentId } = props.options;

      try {
        await http(`/api/tournaments/${tournamentId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ moderators: selectedModerators }),
        });

        props.updateTournament({
          _id: tournamentId,
          moderators: selectedModerators,
        });

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
  const { isSubmitting, moderatorsList } = props;
  const { game } = props.options;

  const moderators = filter(moderatorsList, moderator =>
    moderator.gameSpecificFields[game].displayName.toLowerCase().startsWith(props.filter.toLowerCase())
  );
  const group = groupBy(moderators, moderator => moderator.gameSpecificFields[game].displayName[0]);

  const isSelectedModerators = props.selectedModerators.length > 0;
  const isFiltering = props.filter.length > 0;

  return (
    <Modal
      title={i18n.t('modal.choose_tournament_moderators')}
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
        <h3 className={style.title}>Choosen moderators</h3>

        {(isSelectedModerators && !isFiltering) && (
          props.selectedModerators.map((id, index) => {
            const moderator = find(moderators, { _id: id });
            return (
              <p key={moderator._id} className={style.moderator}>
                {index + 1}. {moderator.gameSpecificFields[game].displayName}
              </p>
            );
          }))}

        {!(isSelectedModerators && !isFiltering) && (
          <p className={style.empty}>You haven`t chosen any moderators yet</p>
        )}
      </div>

      <div className={style.content}>
        <div className={style.search_container}>
          <input
            className={style.field}
            placeholder={i18n.t('modal.find_moderator_name')}
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

        <div className={style.moderators}>
          {isFiltering ? (
            <div className={style.section}>
              <div className={style.list}>
                {moderators.map(moderator => (
                  <button
                    key={moderator._id}
                    className={cx('item', {
                      '_is-selected': props.selectedModerators.includes(moderator._id),
                    })}
                    type="button"
                    onClick={() => props.toggleSelectModerator(moderator._id)}
                  >
                    {moderator.gameSpecificFields[game].displayName}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            props.getSortedKeys(Object.keys(group)).map(key => (
              <div key={key} className={style.section}>
                <h3 className={style.letter}>{key}</h3>

                <div className={style.list}>
                  {group[key].map(moderator => (
                    <button
                      key={moderator._id}
                      className={cx('item', {
                        '_is-selected': props.selectedModerators.includes(
                          moderator._id
                        ),
                      })}
                      type="button"
                      onClick={() => props.toggleSelectModerator(moderator._id)}
                    >
                      {moderator.gameSpecificFields[game].displayName}
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
