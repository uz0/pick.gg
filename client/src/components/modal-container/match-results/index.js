import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import i18n from 'i18n';
import Modal from 'components/modal';
import Table from 'components/table';
import classnames from 'classnames/bind';
import style from './style.module.css';

const tableCaptions = {
  player: {
    text: i18n.t('player'),
    width: window.innerWidth < 480 ? 120 : 150,
  },

  kills: {
    text: i18n.t('kills'),
    width: window.innerWidth < 480 ? 75 : 100,
  },

  deaths: {
    text: i18n.t('deaths'),
    width: window.innerWidth < 480 ? 75 : 100,
  },

  assists: {
    text: i18n.t('assists'),
    width: window.innerWidth < 480 ? 75 : 100,
  },

  total: {
    text: i18n.t('assists'),
    width: window.innerWidth < 480 ? 75 : 100,
  },
};

const cx = classnames.bind(style);

const renderRow = ({ className, itemClass, textClass, props, item }) => {
  const playerStyle = { '--width': tableCaptions.player.width };
  const killsStyle = { '--width': tableCaptions.kills.width };
  const deathsStyle = { '--width': tableCaptions.deaths.width };
  const assistsStyle = { '--width': tableCaptions.assists.width };
  const totalStyle = { '--width': tableCaptions.total.width };

  const { results } = item;

  return (
    <div key={item.userId} className={cx(className, 'row')}>
      <div className={itemClass} style={playerStyle}>
        <span className={textClass}>{item.summonerName}</span>
      </div>

      <div className={itemClass} style={killsStyle}>
        <span className={textClass}>{results.kills}x{props.kills}</span>
      </div>

      <div className={itemClass} style={deathsStyle}>
        <span className={textClass}>{results.deaths}x{props.deaths}</span>
      </div>

      <div className={itemClass} style={assistsStyle}>
        <span className={textClass}>{results.assists}x{props.assists}</span>
      </div>

      <div className={itemClass} style={totalStyle}>
        <span className={textClass}>{results.assists}x{props.assists}</span>
      </div>
    </div>
  );
};

const MatchResults = ({ results, rules, close }) => (
  <Modal
    title={i18n.t('match_results')}
    close={close}
    wrapClassName={style.modal}
    className={style.modal_content}
  >
    <Table
      captions={tableCaptions}
      items={results}
      renderRow={renderRow}
      isLoading={false}
      className={style.table}
      withProps={rules}
      emptyMessage={i18n.t('no_matches_results')}
    />
  </Modal>
);

export default compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.options.tournamentId],
      users: state.users.list,
    }),
  ),
  withProps(props => {
    const { matchId } = props.options;
    const { rules } = props.tournament;

    const match = props.tournament.matches.find(match => match._id === matchId);

    const results = match.playersResults.map(item => {
      const { summonerName } = props.users[item.userId];

      return {
        ...item,
        summonerName,
      };
    });

    return {
      results,
      rules,
    };
  })
)(MatchResults);
