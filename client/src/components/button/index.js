import React from 'react';
import classnames from 'classnames/bind';
import Icon from 'components/icon';
import style from './style.module.css';

const cx = classnames.bind(style);

const Button = ({ type, text, onClick, icon, className, disabled, appearance }) => {
  const isIconString = typeof icon === 'string';
  const isComponentIcon = icon && isIconString;
  const isPropIcon = icon && !isIconString;
  const buttonType = type ? type : 'button';

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      type={buttonType}
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
