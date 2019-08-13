import classnames from 'classnames';
import React from 'react';

import style from './style.module.css';

const cx = classnames.bind(style);

const Preloader = ({ isFullScreen }) => (
  <div className={cx(style.wrapper, { '_is-fullscreen': isFullScreen })}>
    <div className={style.spinner}/>
  </div>
);

export default Preloader;
