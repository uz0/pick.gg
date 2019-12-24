import React, { Component } from 'react';
import classnames from 'classnames/bind';

import logo from '../../assets/lulu.png';
import style from './style.module.css';

const cx = classnames.bind(style);

class NotFound extends Component {
  render() {
    return (
      <div className={cx('not_found', 'container')}>
        <div className={style.text}>
          <span className={style.code}>404.</span>
          <p>Ooops page not found</p>
        </div>

        <div className={style.wrap_logo}>
          <img className={style.logo_not_found} src={logo} alt="404 page"/>
        </div>
      </div>
    );
  }
}

export default NotFound;
