import React from 'react'

const Button = ({ text, type, onClick, icon, className }) => {
  return (
    <button className={className} type={type} onClick={onClick}>
      {icon}
      {text}
    </button>
  )
}

export default Button
