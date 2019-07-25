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
  defaultOption,
}) => (
  <div className={cx('container', className)}>
    {label &&
      <label className={style.label}>{ label }</label>
    }

    <select name={name} defaultValue="" onChange={onChange}>
      {defaultOption &&
        <option value="">{defaultOption}</option>
      }

      {options.map(option => <option key={option._id || option.id} value={option._id || option.id}>{option.name}</option>)}
    </select>
  </div>
);

export default Select;
