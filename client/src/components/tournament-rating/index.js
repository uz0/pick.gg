import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import get from 'lodash/get';
import find from 'lodash/find';
import classnames from 'classnames/bind';

import Table from 'components/table';

import { calcSummonersPoints } from 'helpers';

import { withCaptions } from 'hoc';
import { actions as modalActions } from 'components/modal-container';

import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
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

const renderRow = ({ className, itemClass, textClass, item, index, props, captions }) => {
  const numberInline = { '--width': captions.number.width };
  const nameInline = { '--width': captions.name.width };
  const pointsInline = { '--width': captions.points.width };

  return (
    <button
      type="button"
      key={item._id}
      onClick={props.handleUserClick(item._id)}
      className={cx(className, 'row')}
    >
      <div className={cx(itemClass)} style={numberInline}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameInline}>
        <span className={textClass}>{item.nickname}</span>
      </div>

      <div className={itemClass} style={pointsInline}>
        <span className={cx(textClass, 'points')}>{item.points}</span>
      </div>
    </button>
  );
};

const TournamentRating = ({
  captions,
  modifiedSummoners,
  handleUserClick,
}) => {
  const tableProps = { handleUserClick };

  return (
    <Table
      noCaptions
      captions={captions}
      items={modifiedSummoners}
      renderRow={renderRow}
      withProps={tableProps}
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

    {
      toggleModal: modalActions.toggleModal,
    },
  ),

  withProps(props => {
    let modifiedSummoners = props.summoners.map(id => {
      const user = props.usersList[id];

      return {
        _id: user._id,
        nickname: user.gameSpecificName[props.game],
        imageUrl: user.imageUrl,
        about: user.about,
        points: user.points,
      };
    });

    modifiedSummoners = calcSummonersPoints(modifiedSummoners, props.matches, props.rules);

    return {
      modifiedSummoners,
    };
  }),

  withHandlers({
    handleUserClick: props => id => () => {
      const user = find(props.modifiedSummoners, {_id: id});

      props.toggleModal({
        id: 'player-info',

        options: {
          playerInfo: {
            game: props.game,
            nickname: user.nickname,
            imageUrl: user.imageUrl,
            about: user.about,
            points: user.points,
          },
        },
      });
    },
  }),
)(TournamentRating);
