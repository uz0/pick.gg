import React from 'react'

const Select = ({ id, label, name, placeholder, type, autofocus, value, action, className, option }) => {
  const newId = new Date().getTime().toString()
  return (
    <div className="input-component">
      <label className="label-component" htmlFor={id || newId}>
        {label}
      </label>

      <select id={id || newId} name={name} placeholder={placeholder} className={className} type={type} autoFocus={autofocus} value={value} onChange={action}>
        <option>{option}</option>
      </select>
    </div>
  )
}

export default Select
