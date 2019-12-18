import React from 'react';
import classnames from 'classnames';

import { ReactComponent as AvatarPlaceholder } from 'assets/avatar-placeholder.svg';

import style from './style.module.css';

const cx = classnames.bind(style);

const Avatar = ({ source, className }) => {
  const AvatarComponent = () => source ? <img src={source} alt="avatar"/> : <AvatarPlaceholder/>;

  return (
    <div className={cx(style.avatar, className)}>
      <AvatarComponent/>
    </div>
  );
};

export default Avatar;
