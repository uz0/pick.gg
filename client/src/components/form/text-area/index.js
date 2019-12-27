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
  onFocus,
  error,
  ...props
}) => (
  <div className={cx(style.container, className)}>
    {label &&
      <label className={style.label}>{label}</label>
    }

    <textarea
      name={name}
      value={value}
      placeholder={placeholder}
      className={cx('textfield')}
      onChange={onChange}
      onFocus={onFocus}
      {...props}
    />

    {error &&
      <p className={style.error}>{error}</p>
    }
  </div>
);

export const FormTextArea = ({ field, form, ...props }) => (
  <TextArea
    error={form.errors[field.name]}
    isTouched={form.touched[field.name]}
    {...props}
    {...field}
  />
);

export default TextArea;
