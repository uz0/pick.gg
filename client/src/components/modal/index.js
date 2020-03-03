import classnames from 'classnames/bind';
import { Form } from 'formik';
import React from 'react';

import Button from 'components/button';

import style from './style.module.css';

const div = props => <div {...props}>{props.children}</div>;

const cx = classnames.bind(style);

const Modal = ({
  isForm,
  title,
  close,
  actions,
  className,
  wrapClassName,
  children,
}) => {
  const isActionsShown = actions && actions.length > 0;
  const modalWrapperTag = isForm ? 'form' : 'div';

  const Wrapper = ({
    div,
    form: Form,
  })[modalWrapperTag];

  return (
    <div className={style.wrapper}>
      <Wrapper className={cx('modal', wrapClassName)}>
        <div className={style.header}>
          <h2 className={style.title}>{title}</h2>

          <Button
            appearance="_icon-transparent"
            icon="close"
            className={style.close}
            onClick={close}
          />
        </div>

        <div className={cx('content', { 'has-no-actions': !isActionsShown }, className)}>{children}</div>

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
      </Wrapper>
    </div>
  );
};

export default Modal;
