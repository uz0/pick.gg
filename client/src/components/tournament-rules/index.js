import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames/bind';
import Table from 'components/table';
import Button from 'components/button';
import { withCaptions } from 'hoc';
import style from './style.module.css';

import i18n from 'i18n';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  rule: {
    text: t('rules'),
    width: isMobile ? 75 : 200,
  },

  value: {
    text: t('values'),
    width: isMobile ? 40 : 60,
  },
});

const renderRow = ({ className, itemClass, textClass, item, captions }) => {
  const valueStyle = { '--width': captions.value.width };
  const ruleStyle = { '--width': captions.rule.width };

  const [ruleName] = Object.keys(item);

  return (
    <div key={ruleName} className={cx(className, style.row)}>
      <div className={itemClass} style={ruleStyle}>
        <span className={textClass}>{ruleName}</span>
      </div>

      <div className={cx(itemClass, style.rule_value)} style={valueStyle}>
        <span className={textClass}>{item[ruleName]}</span>
      </div>
    </div>
  );
};

const Rules = ({ rules, captions, addRules, editRules, className }) => (
  <div className={cx(style.rules, className)}>
    <div className={style.header}>
      <h3 className={style.subtitle}>{i18n.t('rules')}</h3>
      {rules.length > 0 && (
        <button
          type="button"
          className={style.button}
          onClick={editRules}
        >
          Edit
        </button>
      )}
    </div>

    {rules.length === 0 && (
      <p className={style.empty}>{i18n.t('add_rules')}</p>
    )}

    <div className={style.content}>
      {rules.length === 0 && (
        <Button
          appearance="_circle-accent"
          icon="plus"
          className={style.button}
          onClick={addRules}
        />
      )}

      {rules.length > 0 && (
        <Table
          noCaptions
          captions={captions}
          items={rules}
          renderRow={renderRow}
          isLoading={false}
          className={style.table}
          emptyMessage="There is no rules yet"
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
    if (isEmpty(props.tournament.rules)) {
      return {
        ...props,
        rules: [],
      };
    }

    const rules = Object.entries(props.tournament.rules).map(([key, value]) => ({ [key]: value }));

    return {
      ...props,
      rules,
    };
  })
)(Rules);
