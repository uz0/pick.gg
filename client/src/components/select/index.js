import React from 'react'

const Select = ({ label, name, placeholder, type, autofocus, value, action, className, option }) => {
  return (
    <label className="inputComponent">
      <p className="labelComponent">{label}</p>

      <select name={name} placeholder={placeholder} className={className} type={type} autoFocus={autofocus} value={value} onChange={action}>
        <option>{option}</option>
      </select>
    </label>
  )
}

export default Select
