import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import Button from 'components/button';
import Table from 'components/table';
import { withCaptions } from 'hoc';
import style from './style.module.css';

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
});

const renderRow = ({ className, itemClass, textClass, index, item, captions }) => {
  const numberStyle = { '--width': captions.number.width };
  const nameStyle = { '--width': captions.name.width };

  return (
    <div key={item._id} className={cx(className, style.row)}>
      <div className={cx(itemClass, style.number)} style={numberStyle}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>{item.username}</span>
      </div>

      <Button appearance="_icon-transparent" icon="plus" className={style.action}/>
      <Button appearance="_icon-transparent" icon="close" className={style.action}/>
    </div>
  );
};

const Applicants = ({
  tournament,
  captions,
  className,
}) => (
  <div className={cx(style.applicants, className)}>
    <div className={style.header}>
      <h3 className={style.subtitle}>Applicants</h3>
      <button type="button" className={style.button}>Stop</button>
    </div>

    <Table
      noCaptions
      captions={captions}
      items={tournament.applicants}
      renderRow={renderRow}
      className={style.table}
      emptyMessage="There is no applicants yet"
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
)(Applicants);
