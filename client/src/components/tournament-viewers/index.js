import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import Table from 'components/table';
import Button from 'components/button';
import AvatarPlaceholder from 'assets/avatar-placeholder.svg';
import { withCaptions } from 'hoc';
import style from './style.module.css';
import { calcSummonersPoints } from 'helpers';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
    width: isMobile ? 55 : 55,
  },

  name: {
    text: t('name'),
    width: isMobile ? 150 : 200,
  },

  points: {
    text: t('points'),
    width: isMobile ? 50 : 80,
  },
});

const renderRow = ({ className, itemClass, textClass, index, item, captions }) => {
  const numberStyle = { '--width': captions.number.width };
  const nameStyle = { '--width': captions.name.width };
  const pointsStyle = { '--width': captions.points.width };

  return (
    <div key={item.userId} className={cx(className, style.row)}>
      <div className={cx(itemClass, style.position)} style={numberStyle}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>{item.user && item.user.username}</span>
      </div>

      <div className={itemClass} style={pointsStyle}>
        <span className={cx(textClass, style.points)}>{item.points}</span>
      </div>
    </div>
  );
};

const Viewers = ({
  joinTournament,
  viewers,
  currentUserSummoners,
  captions,
}) => (
  <div className={style.viewers}>
    <div className={style.header}>
      <h3 className={style.subtitle}>Viewers</h3>
    </div>

    <div className={style.content}>
      {currentUserSummoners.length === 0 && (
        <div className={style.attend}>
          <Button
            text="Join tournament"
            appearance="_basic-accent"
            className={style.button}
            onClick={joinTournament}
          />
        </div>
      )}

      {currentUserSummoners.length > 0 && (
        <div className={style.forecast}>
          <div className={style.title}>Your summoners:</div>
          <div className={style.list}>
            {currentUserSummoners.map(summoner => {
              return (
                <div key={summoner._id} className={style.item}>
                  <div className={style.avatar}>
                    <img src={summoner.imageUrl} onError={e => {
                      e.currentTarget.src = AvatarPlaceholder;
                    }}
                    />
                  </div>
                  <div className={style.info}>
                    <div className={style.name}>
                      {summoner.summonerName}
                    </div>
                    {summoner.preferredPosition && (
                      <div className={style.position}>
                        {summoner.preferredPosition}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
            }
          </div>
        </div>
      )}

      {viewers.length > 0 && (
        <Table
          noCaptions
          captions={captions}
          items={viewers}
          renderRow={renderRow}
          className={style.table}
          emptyMessage="There is no viewers yet"
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
  ),
  withProps(props => {
    const { tournament, currentUser, users } = props;

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
      .sort((prev, next) => {
        return next.points - prev.points;
      });

    if (!currentUser) {
      return {
        ...props,
        viewers,
        currentUserSummoners: [],
      };
    }

    const currentUserSummoners = tournament.viewers.length > 0 &&
      tournament.viewers.find(({ userId }) => userId === currentUser._id);

    if (currentUserSummoners) {
      const summoners = currentUserSummoners.summoners
        .map(summonerId => Object.values(users).find(item => item._id === summonerId))
        .filter(item => item !== undefined);

      return {
        ...props,
        viewers,
        currentUserSummoners: summoners,
      };
    }

    return {
      ...props,
      viewers,
      currentUserSummoners: [],
    };
  })
)(Viewers);
