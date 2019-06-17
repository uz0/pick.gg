import React from 'react';
import classnames from 'classnames/bind';
import style from './style.module.css';

import { ReactComponent as CloseIcon } from 'assets/notification-close.svg';

const cx = classnames.bind(style);

const Icon = ({ name, className }) => {
  const isMaterial = name.match('material-icons-');
  const materialName = name.replace('material-icons-', '');

  return <i className={cx('icon', className, {'material-icons': isMaterial})}>
    {isMaterial &&
      materialName
    }

    {name === 'close' &&
      <CloseIcon />
    }
  </i>;
};

export default Icon;

