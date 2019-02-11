import React from 'react'
import classnames from 'classnames/bind'
import style from './button.module.css'

const cx = classnames.bind(style);

const Button = ({ text, type, onClick, icon, className, disabled, appearance }) => {
  return (
    <button
      className={cx('button', className)}
      appearance={appearance}
      type={type}
      disabled={disabled}
      onClick={onClick}>
        {icon && icon}
        {text && <span>{text}</span>}
    </button>
  )
}

export default Button