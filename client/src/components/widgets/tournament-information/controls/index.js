import React from 'react';
import classnames from 'classnames';

import style from './style.module.css';

const cx = classnames.bind(style);

const Control = ({ className, onClick, ...props }) => {
  return (
    <button type="button" className={cx(style.control, className)} onClick={onClick} {...props}>
      {props.children}
    </button>
  );
};

export default Control;
