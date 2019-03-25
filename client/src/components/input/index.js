import React from 'react';
import classnames from "classnames/bind";
import style from './style.module.css';

const cx = classnames.bind(style);

const Input = ({
  type = 'text',
  label,
  onInput,
  className,
  placeholder,
  ...props
}) => <div className={cx('wrapper', className)}>
  {label &&
    <label>{label}</label>
  }

  <input
    type={type}
    placeholder={placeholder}
    onInput={onInput}
    {...props}
  />
</div>;

export default Input;
