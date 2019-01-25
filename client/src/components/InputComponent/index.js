import React from 'react'
import './Input.css'

const Input = ({ id, label, name, placeholder, type, autofocus, value, action, className }) => {
  const newId = new Date().getTime().toString()
  return (
    <div className="input-component">
      <label htmlFor={id || newId}>{label}</label>
      <br />
      <input id={id || newId} name={name} placeholder={placeholder} className={className} type={type} autoFocus={autofocus} value={value} onChange={action} />
    </div>
  )
}

export default Input
