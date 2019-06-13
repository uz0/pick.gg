import React from 'react';
import classnames from 'classnames/bind';
import style from './style.module.css';

import { ReactComponent as CloseIcon } from 'assets/notification-close.svg';

const cx = classnames.bind(style);

const Icon = ({ name, className }) => <i className={cx('icon', className)}>
  {name === 'close' &&
    <CloseIcon />
  }
</i>;

export default Icon;

