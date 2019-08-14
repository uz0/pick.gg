import React from 'react';

import { ReactComponent as AvatarPlaceholder } from '../../../assets/avatar-placeholder.svg';
import style from './style.module.css';

const Avatar = ({ source }) => {
  const AvatarComponent = () => source ? <img src={source} alt="avatar"/> : <AvatarPlaceholder/>;

  return (
    <div className={style.avatar}>
      <AvatarComponent/>
    </div>
  );
};

export default Avatar;
