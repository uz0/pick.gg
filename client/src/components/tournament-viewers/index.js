import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Table from 'components/table';
import { withCaptions } from 'hoc';
import style from './style.module.css';

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
    width: isMobile ? 55 : 55,
  },

  name: {
    text: t('name'),
    width: isMobile ? 150 : 200,
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
        <span className={textClass}>{item.username}</span>
      </div>
    </div>
  );
};

const Viewers = ({
  tournament,
  captions,
}) => (
  <div className={style.viewers}>
    <h3 className={style.subtitle}>Viewers</h3>

    <Table
      noCaptions
      captions={captions}
      items={tournament.viewers}
      renderRow={renderRow}
      className={style.table}
      emptyMessage="There is no viewers yet"
    />
  </div>
);

export default compose(
  withCaptions(tableCaptions),

  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.id],
    }),
  ),
)(Viewers);
