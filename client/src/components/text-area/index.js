import classnames from 'classnames/bind';
import React from 'react';

import style from './style.module.css';

const cx = classnames.bind(style);

const TextArea = ({
  label,
  className,
  placeholder,
  onChange,
}) => (
  <div className={cx('container', className)}>
    {label &&
      <label className={style.label}>{label}</label>
    }

    <textarea
      placeholder={placeholder}
      onChange={onChange}
    />
  </div>
);

export default TextArea;
