import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';

import { actions as modalActions } from 'components/modal-container';
import Avatar from 'components/avatar';
import Table from 'components/table';

import Button from 'components/button';
import { check } from 'components/dropin-auth/check';

import { calcSummonersPoints } from 'helpers';
import { withCaptions } from 'hoc';

import i18n from 'i18next';

import style from './style.module.css';

const tableCaptions = ({ t, isMobile }) => ({
  name: {
    text: t('name'),
    width: isMobile ? 150 : 300,
  },

  points: {
    text: t('points'),
    width: isMobile ? 40 : 50,
  },
});

const cx = classnames.bind(style);

const renderRow = ({ className, itemClass, textClass, index, item, props: tournament, captions }) => {
  const nameStyle = { '--width': captions.name.width };
  const pointsStyle = { '--width': captions.points.width };
  const isViewerWinner = tournament.winners.find(winner => winner.id === item.userId);

  return (
    <div key={item.userId} className={cx(className, style.row)}>
      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>
          {index + 1}. {item.user && item.user.gameSpecificName[tournament.game]}
          {isViewerWinner && <span className={style.is_winner}> is winner</span>}
        </span>
      </div>

      <div className={itemClass} style={pointsStyle}>
        <span className={cx(textClass, style.points)}>{item.points}</span>
      </div>
    </div>
  );
};

const Viewers = ({
  tournament,
  viewers,
  joinTournament,
  isCurrentUserSummoner,
  isUserCanMakeForecast,
  currentUserSummoners,
  currentViewerPoints,
  currentViewerPosition,
  summonersWithPoints,
  openPlayerInfoModal,
  sortedSummonersWithPoints,
  className,
  captions,
  currentUser,
}) => (
  <div className={cx(style.viewers, className)}>
    <div className={style.content}>
      {isUserCanMakeForecast && currentUserSummoners.length === 0 && (
        <div className={style.attend}>
          <Button
            text={i18n.t('join_tournament')}
            appearance="_small-accent"
            className={style.button}
            onClick={debounce(check(joinTournament, {
              title: 'Make forecast',
              action: joinTournament,
            }), 400)}
          />
        </div>
      )}

      {isCurrentUserSummoner && tournament.isForecastingActive && (
        <p className={style.message}>{i18n.t('summoner_cant_make_forecast')}</p>
      )}

      {currentUserSummoners.length > 0 && (
        <div className={style.forecast}>
          <div className={style.summonerName}>
            {currentViewerPosition && `${currentViewerPosition}. `}
            {currentUser.gameSpecificName[tournament.game]}
          </div>
          <div className={style.list}>
            {currentUserSummoners.map(summoner => {
              const summonerPoints = summonersWithPoints.find(item => summoner._id === item._id).points;

              summoner = {
                ...summoner,
                points: summonerPoints,
                nickname: summoner.gameSpecificName[tournament.game],
                position: sortedSummonersWithPoints.findIndex(item => item._id === summoner._id) + 1,
              };

              return (
                <div key={summoner._id} className={style.item} onClick={() => openPlayerInfoModal(summoner)}>
                  <Avatar
                    source={summoner.imageUrl}
                    className={style.avatar}
                    title={summoner.gameSpecificName[tournament.game]}
                  />
                </div>
              );
            })
            }
          </div>
          <div className={style.points}>{currentViewerPoints}</div>
        </div>
      )}

      {viewers.length > 0 && (
        <Table
          noCaptions
          captions={captions}
          items={viewers}
          withProps={tournament}
          renderRow={renderRow}
          className={style.table}
          emptyMessage={i18n.t('no_viewers_yet')}
        />
      )}
    </div>
  </div>
);

export default compose(
  withCaptions(tableCaptions),
  connect(
    (state, props) => ({
      users: state.users.list,
      currentUser: state.currentUser,
      tournament: state.tournaments.list[props.id],
    }),
    {
      toggleModal: modalActions.toggleModal,
    }
  ),
  withHandlers({
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
    const { tournament, currentUser, users, openPlayerInfoModal } = props;

    const isCurrentUserCreator = (currentUser && tournament.creator) && tournament.creator._id === currentUser._id;
    const isCurrentUserSummoner = currentUser && tournament.summoners.includes(currentUser._id);
    const isUserCanMakeForecast = tournament.isForecastingActive && !isCurrentUserSummoner && !isCurrentUserCreator;

    const viewers = tournament.viewers
      .map(({ userId, summoners }) => {
        const userList = Object.values(users);
        const user = userList.find(user => user._id === userId);
        const tournamentSummoners = summoners.map(summonerId => userList.find(item => item._id === summonerId));
        const summonersWithPoints = calcSummonersPoints(tournamentSummoners, tournament.matches, tournament.rules);

        if (!summonersWithPoints) {
          return {
            userId,
            user,
            summoners,
            points: 0,
          };
        }

        const viewerPoints = summonersWithPoints.reduce((points, summoner) => {
          points += summoner.points;
          return points;
        }, 0);

        return {
          userId,
          user,
          summoners,
          points: viewerPoints,
        };
      })
      .sort((prev, next) => next.points - prev.points);

    if (!currentUser) {
      return {
        ...props,
        viewers,
        isCurrentUserCreator,
        isUserCanMakeForecast,
        isCurrentUserSummoner,
        currentUserSummoners: [],
        currentViewerPoints: 0,
      };
    }

    const currentViewer = viewers.length > 0 && viewers.find(({ userId }) => userId === currentUser._id);
    const currentViewerPosition = currentViewer && viewers.findIndex(({ userId }) => userId === currentUser._id) + 1;

    if (currentViewer) {
      const summoners = currentViewer.summoners
        .map(summonerId => Object.values(users).find(item => item._id === summonerId))
        .filter(item => item !== undefined);

      const userList = Object.values(users);
      const tournamentSummoners = tournament.summoners.map(summonerId => userList.find(item => item._id === summonerId));
      const summonersWithPoints = calcSummonersPoints(tournamentSummoners, tournament.matches, tournament.rules);
      const sortedSummonersWithPoints = summonersWithPoints && summonersWithPoints.sort((a, b) => b.points - a.points);

      return {
        ...props,
        viewers,
        isCurrentUserCreator,
        isUserCanMakeForecast,
        isCurrentUserSummoner,
        currentViewerPosition,
        openPlayerInfoModal,
        summonersWithPoints,
        sortedSummonersWithPoints,
        currentUserSummoners: summoners,
        currentViewerPoints: currentViewer.points,
      };
    }

    return {
      ...props,
      viewers,
      isCurrentUserCreator,
      isUserCanMakeForecast,
      isCurrentUserSummoner,
      currentUserSummoners: [],
      currentViewerPoints: 0,
    };
  })
)(Viewers);
