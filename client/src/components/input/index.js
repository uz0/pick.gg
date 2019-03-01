import React from 'react';
import uuid from 'uuid/v1';

import style from './input.module.css';

const Input = ({ id, label, name, placeholder, type, autofocus, value, action, className, ...props }) => {
  const newId = uuid();
  return (
    <label className={style.input_component}>
      <p className={style.label_component} htmlFor={id || newId}>
        {label}
      </p>
      <input {...props} id={id || newId} name={name} placeholder={placeholder} className={className} type={type} autoFocus={autofocus} value={value} onChange={(e) => action(e)}/>
    </label>
  );
};

export default Input;
