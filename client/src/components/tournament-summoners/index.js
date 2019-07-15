import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { connect } from 'react-redux';
import Table from 'components/table';
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

const Summoners = ({ summoners, captions }) => (
  <div className={style.summoners}>
    <h3 className={style.subtitle}>Summoners</h3>

    <Table
      noCaptions
      captions={captions}
      items={summoners}
      renderRow={renderRow}
      isLoading={false}
      className={style.table}
      emptyMessage="There is no summoners yet"
    />
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
    const users = Object.values(props.users);

    const summoners = props.tournament.summoners.map(summonerId => {
      const summoner = users.find(summoner => summoner._id === summonerId);

      return summoner;
    });

    return {
      ...props,
      summoners,
    };
  }),
)(Summoners);
