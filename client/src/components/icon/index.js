/* eslint-disable camelcase */
import React from 'react';
import classnames from 'classnames/bind';

import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as AlarmIcon } from 'assets/icons/alarm.svg';
import { ReactComponent as PeopleIcon } from 'assets/icons/people.svg';
import { ReactComponent as StarIcon } from 'assets/icons/star.svg';
import { ReactComponent as InfoIcon } from 'assets/icons/info.svg';
import { ReactComponent as ListIcon } from 'assets/icons/list.svg';
import { ReactComponent as CoinIcon } from 'assets/icons/coin.svg';
import { ReactComponent as PlayIcon } from 'assets/icons/play.svg';
import { ReactComponent as StopIcon } from 'assets/icons/stop.svg';
import { ReactComponent as TrophyIcon } from 'assets/icons/trophy.svg';
import { ReactComponent as TournamentGoingOn } from 'assets/icons/tournament_status/status_going_on.svg';
import { ReactComponent as TournamentMakeBet } from 'assets/icons/tournament_status/status_make_bet.svg';
import { ReactComponent as TournamentPreparing } from 'assets/icons/tournament_status/status_preparing.svg';
import { ReactComponent as TournamentIsOver } from 'assets/icons/tournament_status/status_tournament_over.svg';
import { ReactComponent as TournamentWaitingSummoners } from 'assets/icons/tournament_status/status_waiting_summoners.svg';
import { ReactComponent as MatchIsActive } from 'assets/icons/match_status/battle.svg';
import { ReactComponent as MatchIsFinished } from 'assets/icons/match_status/finished.svg';
import { ReactComponent as MatchIsPending } from 'assets/icons/match_status/pending.svg';

import style from './style.module.css';

const cx = classnames.bind(style);

const Icon = ({ name, className }) => {
  const SvgIcon = ({
    close: CloseIcon,
    plus: PlusIcon,
    edit: EditIcon,
    alarm: AlarmIcon,
    people: PeopleIcon,
    star: StarIcon,
    info: InfoIcon,
    list: ListIcon,
    coin: CoinIcon,
    play: PlayIcon,
    stop: StopIcon,
    trophy: TrophyIcon,
    tournamentGoingOn: TournamentGoingOn,
    tournamentMakeBet: TournamentMakeBet,
    tournamentPreparing: TournamentPreparing,
    tournamentIsOver: TournamentIsOver,
    tournamentWaitingSummoners: TournamentWaitingSummoners,
    match_pending: MatchIsPending,
    match_active: MatchIsActive,
    match_finished: MatchIsFinished,
  })[name];

  return (
    <i className={cx('icon', className)}>
      {SvgIcon &&
        <SvgIcon/>
      }
    </i>
  );
};

export default Icon;

