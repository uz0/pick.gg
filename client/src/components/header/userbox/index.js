import classnames from 'classnames/bind';
import React from 'react';

import AvatarPlaceholder from 'assets/avatar-placeholder.svg';

import i18n from 'i18n';

import style from './style.module.css';

const cx = classnames.bind(style);

const UserPlaceholder = ({ username, userpic, isAdmin, canProvideTournaments, isLoading }) => (
  <>
    <img
      className={style.avatar}
      src={userpic}
      alt="userpic"
      onError={e => {
        e.currentTarget.src = AvatarPlaceholder;
      }}
    />

    <div className={cx(style.user_data, { [style.is_loading]: isLoading })}>
      {username && <span className={style.name}>{username}</span>}
      {isAdmin && <span className={style.role}>{i18n.t('admin')}</span>}
      {canProvideTournaments && <span className={style.role}>{i18n.t('streamer')}</span>}
    </div>
  </>
);

export default UserPlaceholder;
