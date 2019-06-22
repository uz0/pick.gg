import React from 'react';
import classnames from 'classnames/bind';
import style from './style.module.css';

import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as AlarmIcon } from 'assets/icons/alarm.svg';
import { ReactComponent as PeopleIcon } from 'assets/icons/people.svg';

const cx = classnames.bind(style);

const Icon = ({ name, className }) => {
  const SvgIcon = ({
    close: CloseIcon,
    plus: PlusIcon,
    edit: EditIcon,
    alarm: AlarmIcon,
    people: PeopleIcon,
  })[name];

  return (
    <i className={cx('icon', className)}>
      {SvgIcon &&
        <SvgIcon/>
      }
    </i>
  );
};

export default Icon;

