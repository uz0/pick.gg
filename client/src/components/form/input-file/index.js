import React from 'react';
import classnames from 'classnames/bind';

import style from './style.module.css';

const cx = classnames.bind(style);

const FileInput = ({
  label,
  className,
  error,
  isTouched,
  file,
  ...props
}) => {
  const statusText = file ? file.name : 'Choose file';

  return (
    <div className={cx('wrapper', className)}>
      {label &&
        <label className={style.caption}>{label}</label>
      }

      <span className={style.status_upload}>{statusText}</span>

      <input
        {...props}
        id="file-upload"
        type="file"
        className={cx(style.input)}
      />

      <label
        className={style.button_upload}
        htmlFor="file-upload"
      >
        upload file
      </label>

      {error && isTouched &&
        <p className={style.error}>{error}</p>
      }
    </div>
  );
};

export default FileInput;
