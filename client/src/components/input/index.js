import React from 'react';

import style from './input.module.css';

const Input = ({ id, label, name, placeholder, type, autofocus, value, action, className, ...props }) => {
  return (
    <label className={style.input_component}>
      <p className={style.label_component}>
        {label}
      </p>
      <input {...props} name={name} placeholder={placeholder} className={className} type={type} autoFocus={autofocus} value={value} onChange={(e) => action(e)}/>
    </label>
  );
};

export default Input;
