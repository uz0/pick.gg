import React from 'react';
import classnames from 'classnames/bind';
import Button from 'components/button';
import style from './style.module.css';

const cx = classnames.bind(style);

const Modal = ({
  title,
  close,
  className,
  wrapClassName,
  children,
}) => (
  <div className={style.wrapper}>
    <div className={cx('modal', wrapClassName)}>
      <div className={style.header}>
        <h2 className={style.title}>{title}</h2>

        <Button
          appearance="_icon-transparent"
          icon="close"
          className={style.close}
          onClick={close}
        />
      </div>

      <div className={cx('content', className)}>{children}</div>
    </div>
  </div>
);

export default Modal;
