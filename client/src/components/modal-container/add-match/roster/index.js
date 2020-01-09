import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import Button from 'components/button';

import i18n from 'i18n';

import style from './style.module.css';

const Roster = ({
  users,
  players,
  error,
  title,
  game,
  rosterId,
  onDelete,
  onEdit,
  className,
}) => (
  <div className={classnames(style.team, className)}>
    <div className={style.header}>
      <div className={style.title}>{title}</div>
      <div className={style.actions}>
        <Button
          icon="delete"
          appearance="_widget"
          className={style.button}
          onClick={() => onDelete(rosterId)}
        />

        <Button
          icon="edit"
          appearance="_widget"
          className={style.button}
          onClick={() => onEdit(rosterId)}
        />
      </div>
    </div>
    <div className={style.content}>
      {isEmpty(players) && (
        <p className={style.empty}>{i18n.t('players_modal.empty_roster')}</p>
      )}

      {!isEmpty(error) && (
        <p className={style.error}>{error}</p>
      )}

      {!isEmpty(players) && (
        <ul className={style.list}>
          {players.map(playerId => (
            <div
              key={playerId}
              className={style.player}
            >
              {users[playerId].gameSpecificFields[game].displayName}
            </div>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default connect(state => ({ users: state.users.list }))(Roster);
