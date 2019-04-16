import React, { Component } from 'react';

import style from './style.module.css';
import classnames from 'classnames';

const cx = classnames.bind(style);

class NotificationBell extends Component {
  state = {
    isActive: false,
    notificationCount: 0,
  }

  render() {
    return (
      <div className={style.notification}>
        <span className={style.counter}>12</span>
        <i className="material-icons">notifications</i>
      </div>
    );
  }
}
export default NotificationBell;