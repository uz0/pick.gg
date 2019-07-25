import React from 'react';
import compose from 'recompose/compose';
import pick from 'lodash/pick';
import withProps from 'recompose/withProps';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import Table from 'components/table';
import Button from 'components/button';
import { withCaptions } from 'hoc';
import { calcSummonersPoints } from 'helpers';
import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
    width: isMobile ? 40 : 60,
  },

  name: {
    text: t('name'),
    width: isMobile ? 150 : 300,
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
    <div key={item._id} className={cx(className, style.row)}>
      <div className={cx(itemClass, style.cell)} style={numberStyle}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>{item.summonerName}</span>
      </div>

      <div className={cx(itemClass, style.cell)} style={pointsStyle}>
        <span className={cx(textClass, style.points)}>{item.points}</span>
      </div>
    </div>
  );
};

const Summoners = ({ summoners, addSummoners, className, captions }) => (
  <div className={cx(style.summoners, className)}>
    <div className={style.header}>
      <h3 className={style.subtitle}>Summoners</h3>
      {summoners.length > 0 && (
        <button
          type="button"
          className={style.button}
          onClick={addSummoners}
        >
          Edit
        </button>
      )}
    </div>

    {summoners.length === 0 && (
      <p className={style.empty}>You can choose summoners</p>
    )}

    <div className={style.content}>
      {summoners.length === 0 && (
        <Button
          appearance="_circle-accent"
          icon="plus"
          className={style.button}
          onClick={addSummoners}
        />
      )}

      {summoners.length > 0 && (
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

export default compose(
  connect(
    (state, props) => ({
      users: state.users.list,
      tournament: state.tournaments.list[props.id],
    }),
  ),
  withCaptions(tableCaptions),
  withProps(props => {
    const { matches, rules } = props.tournament;
    const users = Object.values(props.users);

    let summoners = props.tournament.summoners.map(item => {
      const summoner = users.find(user => user._id === item._id);

      return pick(summoner, ['_id', 'summonerName']);
    });

    summoners = calcSummonersPoints(summoners, matches, rules);

    return {
      ...props,
      summoners,
    };
  }),
)(Summoners);
