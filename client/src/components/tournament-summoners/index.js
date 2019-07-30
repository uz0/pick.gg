import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import pick from 'lodash/pick';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { http, calcSummonersPoints } from 'helpers';
import { actions as tournamentsActions } from 'pages/tournaments';
import notificationActions from 'components/notification/actions';
import { withCaptions } from 'hoc';
import Table from 'components/table';
import Button from 'components/button';
import style from './style.module.css';
import { withHandlers } from 'recompose';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
    width: isMobile ? 55 : 60,
  },

  name: {
    text: t('name'),
    width: isMobile ? 150 : 300,
  },

  points: {
    text: t('points'),
    width: isMobile ? 80 : 80,
  },
});

const renderRow = ({ className, itemClass, textClass, index, item, captions }) => {
  const numberStyle = { '--width': captions.number.width };
  const nameStyle = { '--width': captions.name.width };
  const pointsStyle = { '--width': captions.points.width };

  return (
    <div key={item._id} className={cx(className, style.row)}>
      <div className={cx(itemClass, style.cell)} style={numberStyle}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>{item.summonerName}</span>
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
  summoners,
  className,
  isCurrentUserCreator,
  isAlreadySummonerOrApplicant,
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
        <h3 className={style.subtitle}>Summoners</h3>
        {isCurrentUserCreator && summoners && summoners.length > 0 && (
          <button
            type="button"
            className={style.button}
            onClick={addSummoners}
          >
              Edit
          </button>
        )}
      </div>

      {isCurrentUserCreator && summoners.length === 0 && (
        <p className={style.empty}>You can choose summoners</p>
      )}

      {!isCurrentUserCreator && !isAlreadySummonerOrApplicant && !isApplicantRejected && (
        <p className={style.empty}>You can apply as summoner</p>
      )}

      {isAlreadyApplicant && !isAlreadySummoner && !isApplicantRejected && summoners.length === 0 && (
        <p className={style.empty}>You applied as summoner</p>
      )}

      {isApplicantRejected && (
        <p className={style.empty}>Your application was rejeceted</p>
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
            text="Apply as summoner"
            className={style.button}
            onClick={debounce(applyTournament, 400)}
          />
        )}

        {summoners && summoners.length > 0 && (
          <Table
            noCaptions
            captions={captions}
            items={summoners}
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
          message: 'Вы уже подали заявку на участие в турнире',
        });

        return;
      }

      try {
        await http(`/api/tournaments/${tournamentId}/attend`, { method: 'PATCH' });

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
    const { creator, matches, rules, isApplicationsAvailable } = props.tournament;
    const users = Object.values(props.users);
    const currentUserId = props.currentUser && props.currentUser._id;

    const isCurrentUserCreator = (props.currentUser && creator) && props.currentUser._id === creator._id;

    const isAlreadyApplicant = find(props.tournament.applicants, { user: currentUserId });
    const isAlreadySummoner = props.tournament.summoners.includes(currentUserId);
    const isAlreadySummonerOrApplicant = isAlreadyApplicant || isAlreadySummoner;
    const isApplicantRejected = find(props.tournament.applicants, { user: currentUserId, status: 'REJECTED' });

    if (props.tournament.summoners.length === 0) {
      return {
        ...props,
        isCurrentUserCreator,
        isApplicationsAvailable,
        isAlreadySummonerOrApplicant,
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
      isCurrentUserCreator,
      isApplicationsAvailable,
      isAlreadySummonerOrApplicant,
      isApplicantRejected,
      isAlreadyApplicant,
      isAlreadySummoner,
      summoners,
    };
  }),
)(Summoners);
