import React, { Fragment } from 'react';
import { ReactComponent as AvatarPlaceholder } from 'assets/avatar-placeholder.svg';

import classnames from 'classnames/bind';
import style from './style.module.css';

import i18n from 'i18n';

const cx = classnames.bind(style);

const UserPlaceholder = ({ username, userpic, role, isLoading }) => <Fragment>
  {userpic
    ? <img className={style.avatar} src={userpic} alt="userpic" />
    : <AvatarPlaceholder />
  }

  <div className={cx(style.user_data, { [style.is_loading]: isLoading })}>
    {username && <span className={style.name}>{username}</span>}
    {role && <span className={style.role}>{i18n.t(role)}</span>}
  </div>
</Fragment>

export default UserPlaceholder;