import classnames from 'classnames/bind';
import React from 'react';

import Icon from 'components/icon';

import style from './style.module.css';

const cx = classnames.bind(style);

const Button = ({
  text,
  onClick,
  icon,
  className,
  disabled,
  appearance,
  type = 'button',
}) => {
  const isIconString = typeof icon === 'string';
  const isComponentIcon = icon && isIconString;
  const isPropIcon = icon && !isIconString;

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      type={type}
      className={cx('button', className)}
      appearance={appearance}
      disabled={disabled}
      onClick={onClick}
    >
      {isComponentIcon &&
        <Icon name={icon}/>
      }

      {isPropIcon &&
        icon
      }

      {text && <span>{text}</span>}
    </button>
  );
};

export default Button;
