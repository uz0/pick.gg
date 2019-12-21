import classnames from 'classnames/bind';
import React from 'react';

import Avatar from 'components/avatar';

import i18n from 'i18n';

import style from './style.module.css';

const cx = classnames.bind(style);

const UserPlaceholder = ({ username, userpic, isAdmin, canProvideTournaments, isLoading }) => (
  <>
    <Avatar
      source={userpic}
      className={style.avatar}
      isStreamer={canProvideTournaments}
    />

    <div className={cx(style.user_data, { [style.is_loading]: isLoading })}>
      {username && <span className={style.name}>{username}</span>}
      {isAdmin && <span className={style.role}>{i18n.t('admin')}</span>}
    </div>
  </>
);

export default UserPlaceholder;
