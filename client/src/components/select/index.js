import React from 'react';
import moment from 'moment';

const Select = ({ label, tournamentsData, name, placeholder, type, autofocus, value, action, className, option }) => {
  return (
    <label className="inputComponent">
      <p className="labelComponent">{label}</p>

      <select name={name} placeholder={placeholder} className={className} type={type} autoFocus={autofocus} value={value} onChange={action} required>
        <option hidden disabled selected value />
        {tournamentsData && tournamentsData.map(item =><option key={item._id} value={item.name}>{item.name} - {moment(item.date).format("DD MMM")}</option>)}
      </select>
    </label>
  );
};

export default Select;
