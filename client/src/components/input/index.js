import React from 'react';
import uuid from 'uuid/v1';

import './Input.css'

const Input = ({ id, label, name, placeholder, type, autofocus, value, action, className }) => {
  const newId = uuid()
  return (
    <div className="input-component">
      <label className="label-component" htmlFor={id || newId}>
        {label}
      </label>
      <input id={id || newId} name={name} placeholder={placeholder} className={className} type={type} autoFocus={autofocus} value={value} onChange={action} />
    </div>
  )
}

export default Input
