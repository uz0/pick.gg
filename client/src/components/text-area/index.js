import classnames from 'classnames/bind';
import React from 'react';

import style from './style.module.css';

const cx = classnames.bind(style);

const TextArea = ({
  name,
  value,
  label,
  className,
  placeholder,
  onChange,
}) => (
  <div className={cx('container')}>
    {label &&
      <label className={style.label}>{label}</label>
    }

    <textarea
      name={name}
      value={value}
      placeholder={placeholder}
      className={className}
      onChange={onChange}
    />
  </div>
);

export default TextArea;
