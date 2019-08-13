import classnames from 'classnames/bind';
import React from 'react';

import style from './style.module.css';

const cx = classnames.bind(style);

const Input = ({
  label,
  className,
  type = 'text',
  placeholder,
  onChange,
}) => (
  <div className={cx('container', className)}>
    {label &&
      <label className={style.label}>{label}</label>
    }

    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  </div>
);

export default Input;
