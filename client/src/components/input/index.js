import React, { Component } from 'react';
import classnames from "classnames/bind"
import style from './style.module.css';

const cx = classnames.bind(style);

class Input extends Component {
  render(){

    const {
      type,
      label,
      name,
      value,
      onInput,
      className,
      placeholder
    } = this.props;

    return (
      <div className={cx('wrapper', className)}>

        {label && <label>{label}</label>}

        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onInput={(event) => onInput(event)}
          onChange={() => {}}
        />

      </div>
    );
  };
}

export default Input;
