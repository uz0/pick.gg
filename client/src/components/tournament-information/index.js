import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';
import get from 'lodash/get';
import moment from 'moment';
import classnames from 'classnames';

import Icon from 'components/icon';

import i18n from 'i18next';

import style from './style.module.css';

const cx = classnames.bind(style);

const Information = props => {
  const game = get(props, 'tournament.game');
  const creator = get(props, 'tournament.creator');
  const createdAt = moment(get(props, 'tournament.createdAt', '')).format('D MMMM');
  const description = get(props, 'tournament.description');
  const className = get(props, 'className');
  const url = get(props, 'tournament.url');

  const isCurrentUserCreator = props.currentUser && props.currentUser._id === creator._id;
  const isCurrentUserAdmin = props.currentUser && props.currentUser.isAdmin;

  const isEmpty = get(props, 'tournament.isEmpty');
  const isApplicationsAvailable = get(props, 'tournament.isApplicationsAvailable');
  const isForecastingActive = get(props, 'tournament.isForecastingActive');
  const isStarted = get(props, 'tournament.isStarted');
  const isFinalized = get(props, 'tournament.isFinalized');

  const isEditingAvailable = (isCurrentUserCreator || isCurrentUserAdmin) && !isStarted;

  const getTournamentStatus = () => {
    if (isCurrentUserCreator) {
      if (isEmpty) {
        return i18n.t('add_rules_matches_rewards');
      }

      if ((!isForecastingActive && !isEmpty) && isApplicationsAvailable) {
        return i18n.t('add_summoners_applicants');
      }

      if ((!isApplicationsAvailable && !isFinalized) && isForecastingActive) {
        return i18n.t('let_viewers_make_forecasts');
      }
    }

    if ((!isForecastingActive && !isEmpty) && isApplicationsAvailable) {
      return i18n.t('waiting_applicants');
    }

    if (isForecastingActive) {
      return i18n.t('waiting_viewers');
    }

    if (isStarted && !isFinalized) {
      return i18n.t('tournament_go');
    }

    if (isFinalized) {
      return i18n.t('is_over');
    }
  };

  return (
    <div className={cx(style.information, className)}>
      <div className={style.header}>
        <h3 className={style.subtitle}>{i18n.t('information')}</h3>
        {isEditingAvailable && (
          <button
            type="button"
            className={style.button}
            onClick={props.editTournament}
          >
            <Icon name="edit"/>
          </button>
        )}
      </div>

      <div className={style.content}>
        <div className={style.info}>
          <div className={style.item}>
            <div className={style.key}>{i18n.t('game')}:</div>
            <div className={style.value}>{game}</div>
          </div>

          <div className={style.item}>
            <div className={style.key}>{i18n.t('date_tournament')}:</div>
            <div className={style.value}>{createdAt}</div>
          </div>

          <div className={style.item}>
            <div className={style.key}>{i18n.t('creator')}:</div>
            <div className={style.value}>
              <Link className={style.creator} to={`/user/${creator._id}`}>
                {creator.username}<Icon name="star"/>
              </Link>
            </div>
          </div>

          <div className={style.item}>
            <div className={style.key}>{i18n.t('stream')}</div>
            <div className={style.value}>
              <a target="blank" href={url}>{i18n.t('link')}</a>
            </div>
          </div>

          <div className={cx(style.item, style.status)}>
            <div className={style.key}>{i18n.t('status')}:</div>
            <div className={style.value}>{getTournamentStatus()}</div>
          </div>
        </div>

        <div className={style.description}>
          <p className={style.text}>{description}</p>
        </div>
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
)(Information);
