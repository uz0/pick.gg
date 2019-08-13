import React from 'react';
import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const FileInput = ({
  label,
  className,
  error,
  isTouched,
  ...props
}) => {
  return (
    <div className={cx('wrapper', className)}>
      {label &&
        <label className={style.caption}>{label}</label>
      }

      <input
        {...props}
        id="file-upload"
        type="file"
        className={cx(style.field)}
      />

      <label
        htmlFor="file-upload"
      >
        file-upload
      </label>

      {error && isTouched &&
        <p className={style.error}>{error}</p>
      }
    </div>
  );
};

export default FileInput;
