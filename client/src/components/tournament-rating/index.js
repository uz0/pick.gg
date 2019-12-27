import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { connect } from 'react-redux';
import get from 'lodash/get';
import classnames from 'classnames/bind';

import Table from 'components/table';

import { calcSummonersPoints } from 'helpers';

import { withCaptions } from 'hoc';

import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  avatar: {
    width: isMobile ? 55 : 60,
  },

  name: {
    text: t('name'),
    width: isMobile ? 75 : 340,
  },

  points: {
    text: t('points'),
    width: isMobile ? 40 : 80,
  },
});

const renderRow = ({ className, itemClass, textClass, item, captions }) => {
  const avatarInline = { '--width': captions.avatar.width, backgroundImage: `url(${item.imageUrl})` };
  const nameInline = { '--width': captions.name.width };
  const pointsInline = { '--width': captions.points.width };
  const isPointsExist = item.points && item.points > 0;

  return (
    <div key={item._id} className={cx(className)}>
      <div className={cx(itemClass, 'avatar')} style={avatarInline}/>

      <div className={itemClass} style={nameInline}>
        <span className={textClass}>{item.nickname}</span>
      </div>

      {isPointsExist && (
        <div className={itemClass} style={pointsInline}>
          <span className={cx(textClass, 'points')}>{item.points}</span>
        </div>
      )}
    </div>
  );
};

const TournamentRating = ({
  captions,
  modifiedSummoners,
}) => {
  return (
    <Table
      noCaptions
      captions={captions}
      items={modifiedSummoners}
      renderRow={renderRow}
      className={style.table}
    />
  );
};

export default compose(
  withCaptions(tableCaptions),

  connect(
    (state, props) => ({
      summoners: get(state.tournaments, `list.${props.id}.summoners`, []),
      matches: get(state.tournaments, `list.${props.id}.matches`, []),
      rules: get(state.tournaments, `list.${props.id}.rules`, ''),
      game: get(state.tournaments, `list.${props.id}.game`, 'LOL'),
      usersList: state.users.list,
    }),
  ),

  withProps(props => {
    let modifiedSummoners = props.summoners.map(id => {
      const user = props.usersList[id];

      return {
        _id: user._id,
        nickname: user.gameSpecificName[props.game],
        imageUrl: user.imageUrl,
      };
    });

    modifiedSummoners = calcSummonersPoints(modifiedSummoners, props.matches, props.rules);

    return {
      modifiedSummoners,
    };
  }),
)(TournamentRating);
