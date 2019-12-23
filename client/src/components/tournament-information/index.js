/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import get from 'lodash/get';
import showdown from 'showdown';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';

import Icon from 'components/icon';
import Control from 'components/tournament-information/controls';
import StatusControl from 'components/tournament-information/controls/status-control';

import style from './style.module.css';

const converter = new showdown.Converter();

const cx = classnames.bind(style);

const Information = props => {
  const [isFullDescriptionShown, toggleDescription] = useState(false);

  const creator = get(props, 'tournament.creator');
  const className = get(props, 'className');

  const rules = get(props, 'tournament.rules');
  const rewards = get(props, 'tournament.rewards');
  const shortDescription = get(props, 'tournament.description').substr(0, 255);
  const fullDescription = get(props, 'tournament.description');

  const isCurrentUserCreator = props.currentUser && props.currentUser._id === creator._id;

  const isEmpty = get(props, 'tournament.isEmpty');
  const isApplicationsAvailable = get(props, 'tournament.isApplicationsAvailable');
  const isForecastingActive = get(props, 'tournament.isForecastingActive');
  const isStarted = get(props, 'tournament.isStarted');
  const isFinalized = get(props, 'tournament.isFinalized');

  const rulesAction = () => rules ? props.editRules(props.isCurrentUserAdminOrCreator) : props.addRules(props.isCurrentUserAdminOrCreator);
  const rewardsAction = () => rewards ? props.editRewards(props.isCurrentUserAdminOrCreator) : props.addRewards(props.isCurrentUserAdminOrCreator);
  const statusControlAction = () => props.history.replace('/faq');

  const readMoreText = isFullDescriptionShown ? 'Скрыть' : '...Подробнее';

  const getTournamentStatus = () => {
    if (isCurrentUserCreator) {
      if (isEmpty) {
        return 'add_rules_matches_rewards';
      }

      if ((!isForecastingActive && !isEmpty) && isApplicationsAvailable) {
        return 'add_summoners_applicants';
      }

      if ((!isApplicationsAvailable && !isFinalized) && isForecastingActive) {
        return 'let_viewers_make_forecasts';
      }
    }

    if ((!isForecastingActive && !isEmpty) && isApplicationsAvailable) {
      return 'waiting_applicants';
    }

    if (isForecastingActive) {
      return 'waiting_viewers';
    }

    if (isStarted && !isFinalized) {
      return 'tournament_go';
    }

    if (isFinalized) {
      return 'is_over';
    }
  };

  return (
    <div className={cx(style.information, className)}>
      <div className={style.controls}>
        <StatusControl status={getTournamentStatus()} onClick={statusControlAction}/>
        <Control onClick={rewardsAction}>
          <Icon name="trophy"/>
        </Control>
        <Control onClick={rulesAction}>
          {props.tournament.rulesTitle || 'SET ME'}
        </Control>
      </div>
      <div className={style.description}>
        {!isFullDescriptionShown && <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(shortDescription) }}/>}
        {isFullDescriptionShown && <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(fullDescription) }}/>}

        {fullDescription.length >= 255 && (
          <div
            className={style.readmore}
            onClick={() => toggleDescription(!isFullDescriptionShown)}
          >
            {readMoreText}
          </div>
        )}
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      currentUser: state.currentUser,
      tournament: state.tournaments.list[props.id],
    }),
  ),

  withRouter,
)(Information);
