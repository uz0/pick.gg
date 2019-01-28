import React from 'react'
import style from './input.module.css'

const Input = ({ id, label, name, placeholder, type, autofocus, value, action, className }) => {
  const newId = new Date().getTime().toString()
  return (
    <label className={style.inputComponent}>
      <p className={style.labelComponent} htmlFor={id || newId}>
        {label}
      </p>
      <input id={id || newId} name={name} placeholder={placeholder} className={className} type={type} autoFocus={autofocus} value={value} onChange={action} />
    </label>
  )
}

export default Input
