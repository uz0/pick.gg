import React from 'react';
import classnames from 'classnames/bind';

import style from './style.module.css';

const cx = classnames.bind(style);

const Select = ({
  name,
  label,
  className,
  options,
  onChange,
  value,
  placeholder,
}) => (
  <div className={cx('container', className)}>
    {label &&
      <label className={style.label}>{ label }</label>
    }
    <select name={name} value={value || ''} onChange={onChange}>
      <option disabled hidden value="">{placeholder}</option>
      {options.map(option => <option key={option._id || option.id} value={option._id || option.id}>{option.name}</option>)}
    </select>
  </div>
);

export default Select;
