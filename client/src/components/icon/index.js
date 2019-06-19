import React from 'react';
import classnames from 'classnames/bind';
import style from './style.module.css';

import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';

const cx = classnames.bind(style);

const Icon = ({ name, className }) => {
  const SvgIcon = ({
    close: CloseIcon,
    plus: PlusIcon,
  })[name];

  return <i className={cx('icon', className)}>
    {SvgIcon &&
      <SvgIcon />
    }
  </i>;
};

export default Icon;
