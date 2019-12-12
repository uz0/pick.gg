import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames/bind';

import Button from 'components/button';
import Icon from 'components/icon';

import i18n from 'i18n';

import style from './style.module.css';

const cx = classnames.bind(style);

const Rules = ({
  rules,
  isEditingAvailable,
  isCurrentUserCanEditRules,
  addRules,
  editRules,
  className,
}) => (
  <div className={cx(style.rules, className)}>
    <div className={style.header}>
      <h3 className={style.subtitle}>{i18n.t('rules')}</h3>
      {isEditingAvailable && (
        <button
          type="button"
          className={style.button}
          onClick={editRules}
        >
          <Icon name="edit"/>
        </button>
      )}
    </div>

    {isCurrentUserCanEditRules && rules.length === 0 && (
      <p className={style.empty}>{i18n.t('add_rules')}</p>
    )}

    <div className={cx(style.content, { [style.empty]: isCurrentUserCanEditRules && rules.length === 0 })}>
      {isCurrentUserCanEditRules && rules.length === 0 && (
        <Button
          appearance="_circle-accent"
          icon="plus"
          className={style.button}
          onClick={addRules}
        />
      )}

      {rules.length > 0 && (
        <div className={style.info}>
          <span className={style.rulestring}>{rules}</span>
        </div>
      )}
    </div>
  </div>
);

export default compose(
  connect(
    (state, props) => ({
      users: state.users.list,
      currentUser: state.currentUser,
      tournament: state.tournaments.list[props.id],
    }),
  ),
  withProps(props => {
    const isCurrentUserCreator = props.currentUser && props.currentUser._id === props.tournament.creator._id;
    const isCurrentUserAdmin = props.currentUser && props.currentUser.isAdmin;
    const isCurrentUserCanEditRules = isCurrentUserCreator || isCurrentUserAdmin;

    const { rules } = props.tournament;

    const isEditingAvailable = (isCurrentUserCreator || isCurrentUserAdmin) &&
      !isEmpty(rules) &&
      !props.tournament.isStarted;

    return {
      ...props,
      isCurrentUserCanEditRules,
      isCurrentUserCreator,
      isEditingAvailable,
      rules,
    };
  })
)(Rules);
