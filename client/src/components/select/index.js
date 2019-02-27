import React from 'react'

const Select = ({ label, tournamentsData, name, placeholder, type, autofocus, value, action, className, option }) => {
  return (
    <label className="inputComponent">
      <p className="labelComponent">{label}</p>

      <select name={name} placeholder={placeholder} className={className} type={type} autoFocus={autofocus} value={value} onChange={action} required>
        <option hidden disabled selected value></option>
        {tournamentsData && tournamentsData.map(item =><option key={item._id}>{item.name}</option>)}
      </select>
    </label>
  )
}

export default Select
