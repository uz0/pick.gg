/* eslint-disable camelcase */
import React from 'react';

import Control from 'components/tournament-information/controls';
import Icon from 'components/icon';

import i18n from 'i18next';

const StatusControl = props => {
  const icons = {
    creating_tournament: 'tournamentPreparing',
    waiting_applicants: 'tournamentPreparing',
    let_viewers_make_forecasts: 'tournamentMakeBet',
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
