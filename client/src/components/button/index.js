import React from 'react';
import classnames from 'classnames/bind';
import Icon from 'components/icon';
import style from './style.module.css';

const cx = classnames.bind(style);

const Button = ({ text, type, onClick, icon, className, disabled, appearance }) => {
  const isIconString = typeof icon === 'string';
  const isComponentIcon = icon && isIconString;
  const isPropIcon = icon && !isIconString;

  return <button
    className={cx('button', className)}
    appearance={appearance}
    type={type}
    disabled={disabled}
    onClick={onClick}
  >
    {isComponentIcon &&
      <Icon name={icon} />
    }

    {isPropIcon &&
      icon
    }

    {text && <span>{text}</span>}
  </button>;
};

export default Button;