import React from 'react';
import classnames from 'classnames/bind';
import Button from 'components/button';
import style from './style.module.css';

const cx = classnames.bind(style);

const Modal = ({
  title,
  close,
  actions,
  className,
  wrapClassName,
  children,
}) => {
  const isActionsShown = actions && actions.length > 0;

  return (
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

        {isActionsShown && (
          <div className={style.actions}>
            {actions.map(action => (
              <Button
                key={action.text}
                {...action}
                className={cx('button', action.className)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
