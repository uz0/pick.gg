import React from 'react';
import style from './style.module.css';

const Select = ({ label, values, name, placeholder, type, autofocus, value, action, className, option }) => {
  return (
    <label className={style.input_component}>
      <p className={style.labelComponent}>{label}</p>

      <select
        name={name}
        placeholder={placeholder}
        className={className}
        type={type}
        autoFocus={autofocus}
        value={value}
        onChange={action}
        required
      >
        <option hidden disabled selected value />

        {values && values.map(item =>
          <option
            key={item.id}
            value={item.name}
          >
            {option(item) || item.title}
          </option>)
        }
      </select>
    </label>
  );
};

export default Select;
