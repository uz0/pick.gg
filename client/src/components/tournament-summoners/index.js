import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import ym from 'react-yandex-metrika';
import pick from 'lodash/pick';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import classnames from 'classnames/bind';
import { actions as tournamentsActions } from 'pages/tournaments';
import uuid from 'uuid';

import { actions as modalActions } from 'components/modal-container';
import notificationActions from 'components/notification/actions';
import { check } from 'components/dropin-auth/check';
import Table from 'components/table';
import Button from 'components/button';
import Icon from 'components/icon';

import { http, calcSummonersPoints } from 'helpers';

import { withCaptions } from 'hoc';

import i18n from 'i18next';

import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  name: {
    text: t('name'),
    width: isMobile ? 75 : 340,
  },

  points: {
    text: t('points'),
    width: isMobile ? 40 : 80,
  },
});

const renderRow = ({ className, itemClass, textClass, index, item, props, captions }) => {
  const nameStyle = { '--width': captions.name.width };
  const pointsStyle = { '--width': captions.points.width };
  const isSummonerWinner = props.winners.find(summoner => summoner.id === item._id);

  const summonerInfo = {
    ...item,
    position: index + 1,
  };

  return (
    <div key={uuid()} className={cx(className, style.row)} onClick={() => props.openPlayerInfoModal(summonerInfo)}>
      <div className={cx(itemClass, style.item)} style={nameStyle}>
        <span className={cx(textClass, style.text)}>
          <span className={textClass}>{index + 1}</span>. {item.nickname}
          {isSummonerWinner && <span className={style.is_winner}> {`(${i18n.t('is_winner')})`}</span>}
          {item.isStreamer && (
            <span title="streamer" className={style.is_streamer}>
              <Icon name="star"/>
            </span>
          )}
        </span>
      </div>

      {item.points > 0 && (
        <div className={cx(itemClass, style.item)} style={pointsStyle}>
          <span className={cx(textClass, style.points)}>{item.points}</span>
        </div>
      )}
    </div>
  );
};

const Summoners = ({
  captions,
  winners,
  summoners,
  className,
  isUserCanApply,
  isEditingAvailable,
  isApplicationsAvailable,
  isCurrentUserCanEdit,
  isApplicantRejected,
  isAlreadyApplicant,
  isAlreadySummoner,
  addSummoners,
  applyTournament,
  openPlayerInfoModal,
}) => {
  return (
    <div className={cx(style.summoners, className)}>
      <div className={style.header}>
        {isEditingAvailable && summoners.length > 0 && (
          <button
            type="button"
            className={style.button}
            onClick={addSummoners}
          >
            {i18n.t('edit')}
          </button>
        )}
      </div>

      <div className={style.content}>
        {isCurrentUserCanEdit && summoners.length === 0 && (
          <p className={style.empty}>{i18n.t('can_choose_summoners')}</p>
        )}

        {isUserCanApply && (
          <p className={style.empty}>{i18n.t('can_apply_summoner')}</p>
        )}

        {isAlreadyApplicant && !isAlreadySummoner && !isApplicantRejected && summoners.length === 0 && (
          <p className={style.empty}>{i18n.t('you_applied_summoner')}</p>
        )}

        {isCurrentUserCanEdit && summoners.length === 0 && (
          <Button
            appearance="_small-accent"
            text="Choose summoners"
            className={style.button}
            onClick={addSummoners}
          />
        )}

        {!isCurrentUserCanEdit && !isAlreadySummoner && !isAlreadyApplicant && isApplicationsAvailable && (
          <Button
            appearance="_small-accent"
            text={i18n.t('apply_summoner')}
            className={style.button}
            onClick={debounce(check(applyTournament, {
              title: 'Apply as summoner',
              action: applyTournament,
            }), 400)}
          />
        )}

        {summoners && summoners.length > 0 && (
          <Table
            noCaptions
            captions={captions}
            items={summoners}
            withProps={{ winners, openPlayerInfoModal }}
            renderRow={renderRow}
            isLoading={false}
            className={style.table}
          />
        )}
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      currentUser: state.currentUser,
      users: state.users.list,
      tournament: state.tournaments.list[props.id],
    }),

    {
      toggleModal: modalActions.toggleModal,
      showNotification: notificationActions.showNotification,
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withCaptions(tableCaptions),
  withHandlers({
    applyTournament: props => async () => {
      const tournamentId = props.id;
      const currentUserId = props.currentUser._id;

      if (props.isAlreadyApplicantOrSummoner) {
        props.showNotification({
          type: 'error',
          shouldBeAddedToSidebar: false,
          message: i18n.t('you_send_join'),
        });

        return;
      }

      try {
        await http(`/api/tournaments/${tournamentId}/attend`, {
          method: 'PATCH',
        });

        ym('reachGoal', 'applied_as_summoner');

        props.updateTournament({
          _id: tournamentId,
          applicants: [...props.tournament.applicants, { user: currentUserId, status: 'PENDING' }],
        });
      } catch (error) {
        console.log(error);
      }
    },
    openPlayerInfoModal: props => playerInfo => {
      props.toggleModal({
        id: 'player-info',

        options: {
          playerInfo,
        },
      });
    },
  }),
  withProps(props => {
    const { _id: tournamentId, game, creator, matches, rules, winners, isApplicationsAvailable } = props.tournament;
    const users = Object.values(props.users);
    const currentUserId = props.currentUser && props.currentUser._id;

    const isCurrentUserCreator = (props.currentUser && creator) && props.currentUser._id === creator._id;
    const isCurrentUserAdmin = props.currentUser && props.currentUser.isAdmin;
    const isCurrentUserModerator = includes(props.tournament.moderators, currentUserId);

    const isCurrentUserCanEdit = isCurrentUserCreator || isCurrentUserAdmin || isCurrentUserModerator;

    const isEditingAvailable = isCurrentUserCanEdit && !props.tournament.isStarted;

    const isAlreadyApplicant = find(props.tournament.applicants, { user: currentUserId });
    const isAlreadySummoner = props.tournament.summoners.includes(currentUserId);
    const isAlreadySummonerOrApplicant = isAlreadyApplicant || isAlreadySummoner;
    const isApplicantRejected = find(props.tournament.applicants, { user: currentUserId, status: 'REJECTED' });

    const isUserCanApply = !isCurrentUserCanEdit && !isAlreadySummonerOrApplicant && !isApplicantRejected && isApplicationsAvailable;

    let summoners = props.tournament.summoners
      .map(summonerId => {
        const summoner = users.find(user => user._id === summonerId);
        const normalizedSummoner = pick(summoner, ['_id', 'gameSpecificName', 'canProvideTournaments', 'about', 'imageUrl']);

        // There is no summoner data until loadUsers redux
        return isEmpty(normalizedSummoner) ? {} : {
          _id: normalizedSummoner._id,
          nickname: normalizedSummoner.gameSpecificName[game],
          isStreamer: normalizedSummoner.canProvideTournaments,
          about: normalizedSummoner.about,
          imageUrl: normalizedSummoner.imageUrl,
        };
      })
      .filter(summoner => summoner._id);

    if (!isApplicationsAvailable) {
      summoners = calcSummonersPoints(summoners, matches, rules);
    }

    return {
      ...props,
      tournamentId,
      winners,
      isCurrentUserCreator,
      isEditingAvailable,
      isApplicationsAvailable,
      isCurrentUserCanEdit,
      isUserCanApply,
      isApplicantRejected,
      isAlreadyApplicant,
      isAlreadySummoner,
      summoners: summoners || [],
    };
  }),
)(Summoners);
