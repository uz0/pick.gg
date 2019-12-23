/* eslint-disable camelcase */
import React from 'react';

import Control from 'components/tournament-information/controls';
import Icon from 'components/icon';

import i18n from 'i18next';

const StatusControl = props => {
  const icons = {
    add_rules_matches_rewards: 'tournamentPreparing',
    add_summoners_applicants: 'tournamentPreparing',
    let_viewers_make_forecasts: 'tournamentMakeBet',
    waiting_applicants: 'tournamentWaitingSummoners',
    waiting_viewers: 'tournamentWaitingSummoners',
    tournament_go: 'tournamentGoingOn',
    is_over: 'tournamentIsOver',
  };

  return (
    <Control title={i18n.t(props.status)} {...props}>
      <Icon name={icons[props.status]}/>
    </Control>
  );
};

export default StatusControl;
