import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Table from 'components/table';
import Button from 'components/button';
import { withCaptions } from 'hoc';
import style from './style.module.css';

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
    width: isMobile ? 55 : 35,
  },

  name: {
    text: t('name'),
    width: isMobile ? 150 : 300,
  },
});

const renderRow = ({ className, itemClass, textClass, index, item, captions }) => {
  const numberStyle = { '--width': captions.number.width };
  const nameStyle = { '--width': captions.name.width };

  return (
    <div key={item._id} className={className}>
      <div className={itemClass} style={numberStyle}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>{item.summonerName}</span>
      </div>
    </div>
  );
};

const Rewards = ({ tournament, captions }) => (
  <div className={style.rewards}>
    <div className={style.header}>
      <h3 className={style.subtitle}>Rewards</h3>
      {tournament.rewards.length > 0 && (
        <button
          type="button"
          className={style.button}
        >
          Edit
        </button>
      )}
    </div>

    {tournament.rewards.length === 0 && (
      <p className={style.empty}>Add rewards</p>
    )}

    <div className={style.content}>
      {tournament.rewards.length === 0 && (
        <Button
          appearance="_circle-accent"
          icon="plus"
          className={style.button}
        />
      )}

      {tournament.rewards.length > 0 && (
        <Table
          noCaptions
          captions={captions}
          items={tournament.rewards}
          renderRow={renderRow}
          isLoading={false}
          className={style.table}
          emptyMessage="There is no rewards yet"
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
)(Rewards);
