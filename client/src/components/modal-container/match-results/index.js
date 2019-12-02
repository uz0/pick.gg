import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import classnames from 'classnames/bind';

import Modal from 'components/modal';
import Table from 'components/table';

import i18n from 'i18n';

import style from './style.module.css';
import { RULES } from '../../../constants';

const cx = classnames.bind(style);

const renderRow = ({ className, itemClass, textClass, item, captions }) => {
  const playerStyle = { '--width': captions.player.width };
  const ruleStyle = rule => ({ '--width': captions[rule].width });

  const { results } = item;

  return (
    <div key={item.userId} className={cx(className, 'row')}>
      <div className={itemClass} style={playerStyle}>
        <span className={textClass}>{item.nickname}</span>
      </div>
      {Object.entries(results).map(([rule, result]) => (
        <div key={`${rule}_${result}`} className={itemClass} style={ruleStyle(rule)}>
          <span className={textClass}>{result}</span>
        </div>
      ))}
    </div>
  );
};

const MatchResults = ({ results, rules, close, tableCaptions }) => (
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

    const results = match.playersResults.map(result => {
      const user = props.users[result.userId];

      return {
        ...result,
        nickname: user.gameSpecificName[props.tournament.game],
      };
    });

    const tableCaptions = RULES[props.tournament.game].player.reduce((acc, { ruleName }) => ({
      ...acc,
      [ruleName]: {
        text: ruleName,
        width: window.innerWidth < 480 ? 50 : 75,
      },
    }), {
      player: {
        text: i18n.t('player'),
        width: window.innerWidth < 480 ? 120 : 150,
      },
    });

    return {
      results,
      rules,
      tableCaptions,
    };
  })
)(MatchResults);
