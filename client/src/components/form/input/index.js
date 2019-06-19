import React from 'react';
import classnames from 'classnames/bind';
import { Field } from 'formik';
import style from './style.module.css';

const cx = classnames.bind(style);

const Input = ({
  label,
  className,
  formProps,
  ...props
}) => {
  const error = formProps.errors[props.name];
  const isTouched = formProps.touched[props.name];

  return (
    <div className={cx('wrapper', className)}>
      {label &&
        <label className={style.caption}>{label}</label>
      }

      <Field {...props} className={style.field}/>

      {error && isTouched &&
        <p className={style.error}>{error}</p>
      }
    </div>
  );
};

export default Input;
