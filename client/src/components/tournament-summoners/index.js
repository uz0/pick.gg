import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import pick from 'lodash/pick';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import classnames from 'classnames/bind';
import { http, calcSummonersPoints } from 'helpers';
import { actions as tournamentsActions } from 'pages/tournaments';
import { withCaptions } from 'hoc';
import notificationActions from 'components/notification/actions';
import { check } from 'components/dropin-auth/check';
import Table from 'components/table';
import Button from 'components/button';
import style from './style.module.css';
import uuid from 'uuid';

import i18n from 'i18next';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
    width: isMobile ? 55 : 60,
  },

  name: {
    text: t('name'),
    width: isMobile ? 100 : 300,
  },

  points: {
    text: t('points'),
    width: isMobile ? 80 : 80,
  },
});

const renderRow = ({ className, itemClass, textClass, index, item, props, captions }) => {
  const numberStyle = { '--width': captions.number.width };
  const nameStyle = { '--width': captions.name.width };
  const pointsStyle = { '--width': captions.points.width };

  const isSummonerWinner = props.find(summoner => summoner.id === item._id);

  return (
    <div key={uuid()} className={cx(className, style.row)}>
      <div className={cx(itemClass, style.cell)} style={numberStyle}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>
          {item.summonerName}
          {isSummonerWinner && <span className={style.is_winner}> {i18n.t('is_winner')}</span>}
        </span>
      </div>

      {item.points > 0 && (
        <div className={cx(itemClass, style.cell)} style={pointsStyle}>
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
  isCurrentUserCreator,
  isUserCanApply,
  isEditingAvailable,
  isApplicationsAvailable,
  isApplicantRejected,
  isAlreadyApplicant,
  isAlreadySummoner,
  addSummoners,
  applyTournament,
}) => {
  return (
    <div className={cx(style.summoners, className)}>
      <div className={style.header}>
        <h3 className={style.subtitle}>{i18n.t('summoners')}</h3>
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

      {isCurrentUserCreator && summoners.length === 0 && (
        <p className={style.empty}>{i18n.t('can_choose_summoners')}</p>
      )}

      {isUserCanApply && (
        <p className={style.empty}>{i18n.t('can_apply_summoner')}</p>
      )}

      {isAlreadyApplicant && !isAlreadySummoner && !isApplicantRejected && summoners.length === 0 && (
        <p className={style.empty}>{i18n.t('you_applied_summoner')}</p>
      )}

      <div className={style.content}>
        {isCurrentUserCreator && summoners.length === 0 && (
          <Button
            appearance="_circle-accent"
            icon="plus"
            className={style.button}
            onClick={addSummoners}
          />
        )}

        {!isCurrentUserCreator && !isAlreadySummoner && !isAlreadyApplicant && isApplicationsAvailable && (
          <Button
            appearance="_basic-accent"
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
            withProps={winners}
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
          headers: {
            'x-access-token': localStorage.getItem('JWS_TOKEN'),
          },
        });

        props.updateTournament({
          _id: tournamentId,
          applicants: [...props.tournament.applicants, { user: currentUserId, status: 'PENDING' }],
        });
      } catch (error) {
        console.log(error);
      }
    },
  }),
  withProps(props => {
    const { _id: tournamentId, creator, matches, rules, winners, isApplicationsAvailable } = props.tournament;
    const users = Object.values(props.users);
    const currentUserId = props.currentUser && props.currentUser._id;

    const isCurrentUserCreator = (props.currentUser && creator) && props.currentUser._id === creator._id;
    const isEditingAvailable = isCurrentUserCreator && !props.tournament.isStarted;

    const isAlreadyApplicant = find(props.tournament.applicants, { user: currentUserId });
    const isAlreadySummoner = props.tournament.summoners.includes(currentUserId);
    const isAlreadySummonerOrApplicant = isAlreadyApplicant || isAlreadySummoner;
    const isApplicantRejected = find(props.tournament.applicants, { user: currentUserId, status: 'REJECTED' });

    const isUserCanApply = !isCurrentUserCreator && !isAlreadySummonerOrApplicant && !isApplicantRejected && isApplicationsAvailable;

    if (props.tournament.summoners.length === 0) {
      return {
        ...props,
        tournamentId,
        winners,
        isCurrentUserCreator,
        isEditingAvailable,
        isApplicationsAvailable,
        isUserCanApply,
        isAlreadyApplicant,
        isApplicantRejected,
        isAlreadySummoner,
        summoners: [],
      };
    }

    let summoners = props.tournament.summoners.map(summonerId => {
      const summoner = users.find(user => user._id === summonerId);

      return pick(summoner, ['_id', 'summonerName']);
    });

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
      isUserCanApply,
      isApplicantRejected,
      isAlreadyApplicant,
      isAlreadySummoner,
      summoners,
    };
  }),
)(Summoners);
