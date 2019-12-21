import React from 'react';
import classnames from 'classnames';

import { ReactComponent as AvatarPlaceholder } from 'assets/avatar-placeholder.svg';
import { ReactComponent as AvatarBorder } from 'assets/avatar-border.svg';

import style from './style.module.css';

const cx = classnames.bind(style);

const AvatarComponent = ({ source }) => {
  if (source) {
    return (
      <img
        src={source}
        alt="avatar"
        onError={e => {
          e.currentTarget.src = AvatarPlaceholder;
        }}
      />
    );
  }

  return <AvatarPlaceholder/>;
};

const Avatar = ({ source, className, isStreamer, title }) => {
  return (
    <div className={cx(style.avatar, className)} title={title}>
      {isStreamer && (
        <div className={style.streamerBorder}>
          <AvatarBorder/>
        </div>
      )}

      <AvatarComponent source={source}/>
    </div>
  );
};

export default Avatar;
