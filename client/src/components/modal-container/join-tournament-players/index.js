import React from 'react';
import Modal from 'components/modal';
import classnames from 'classnames/bind';
import style from './style.module.css';
import { connect } from 'react-redux';

import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import i18n from 'i18n';

import { http } from 'helpers';

import { actions as tournamentsActions } from 'pages/tournaments';

const cx = classnames.bind(style);

const enhance = compose(
  connect(
    (state, props) => ({
      currentUser: state.currentUser,
      tournamentCreator: state.tournaments.list[props.options.tournamentId].creator,
    }),

    {
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withProps(props => {
    const tournamentSummoners = props.options.tournamentSummoners
      .map(summoner => Object
        .values(props.options.summoners)
        .find(item => item._id === summoner)
      );

    return {
      ...props,
      tournamentSummoners,
    };
  }),
  withStateHandlers(
    props => {
      return {
        tournamentSummoners: props.tournamentSummoners,
        selectedSummoners: [],
      };
    },

    {
      toggleSelectSummoner: state => id => {
        const { selectedSummoners } = state;
        if (selectedSummoners.length >= 5) {
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
    attend: props => async () => {
      const { selectedSummoners } = props;
      const { tournamentId, tournamentViewers, currentUserId } = props.options;

      try {
        await http(`/api/tournaments/${tournamentId}/view`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('JWS_TOKEN'),
          },
          method: 'PATCH',
          body: JSON.stringify({
            userId: currentUserId,
            summoners: selectedSummoners,
          }),
        });

        props.updateTournament({
          _id: tournamentId,
          viewers: [...tournamentViewers, {
            userId: currentUserId,
            summoners: selectedSummoners,
          }],
        });

        props.close();
      } catch (error) {
        console.log(error);
      }
    }
  }),
);

export default enhance(props => {
  const {
    selectedSummoners,
    tournamentSummoners,
    toggleSelectSummoner,
    tournamentCreator,
    currentUser,
    attend,
  } = props;

  const addPlayersButtonAction = tournamentCreator._id === currentUser._id ? props.close : attend;

  const actions = [
    { text: i18n.t('add_players'), appearance: '_basic-accent', onClick: () => addPlayersButtonAction() },
  ];

  return (
    <Modal
      title={i18n.t('modal.choose_your_summoners')}
      close={props.close}
      actions={actions}
      wrapClassName={style.wrapper}
      className={style.content}
    >
      {tournamentSummoners.map(summoner => {
        const isChecked = selectedSummoners.includes(summoner._id);

        return (
          <button
            key={summoner._id}
            className={cx('summoner', { '_is-checked': isChecked })}
            type="button"
            onClick={() => toggleSelectSummoner(summoner._id)}
          >
            <div className={style.image}>
              <img src={summoner.imageUrl} alt="summoner"/>
            </div>

            <div className={style.info}>
              <p className={style.name}>{summoner.summonerName}</p>

              {summoner.preferredPosition && (
                <p className={style.position}>Position: {summoner.preferredPosition}</p>
              )}
            </div>
          </button>
        );
      })}
    </Modal>
  );
});
