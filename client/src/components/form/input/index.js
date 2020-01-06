import React from 'react';
import classnames from 'classnames/bind';

import style from './style.module.css';

const cx = classnames.bind(style);

const Input = ({
  label,
  error,
  className,
  isTouched,
  labelPosition,
  ...props
}) => {
  return (
    <div className={cx('wrapper', { [style.alignLeft]: labelPosition === 'left' }, className)}>
      {label &&
        <label className={style.caption}>{label}</label>
      }

      {labelPosition === 'left' && (
        <div>
          <input {...props} className={cx({ '_is-checkbox': props.type === 'checkbox' }, style.field)}/>
          {error && isTouched &&
            <p className={style.error}>{error}</p>
          }
        </div>
      )}

      {labelPosition !== 'left' && (
        <>
          <input {...props} className={cx({ '_is-checkbox': props.type === 'checkbox' }, style.field)}/>
          {error && isTouched &&
            <p className={style.error}>{error}</p>
          }
        </>
      )}
    </div>
  );
};

export const FormInput = ({ field, form, ...props }) => (
  <Input
    error={form.errors[field.name]}
    isTouched={form.touched[field.name]}
    {...props}
    {...field}
  />
);

export default Input;
