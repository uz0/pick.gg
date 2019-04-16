import React, { Component } from 'react';

import style from './style.module.css';
import classnames from 'classnames';

const cx = classnames.bind(style);

class NotificationBell extends Component {
  state = {
    isActive: false,
    notificationCount: 12,
  }

  render() {
    const counterValue = this.state.notificationCount < 10 ? this.state.notificationCount : '9+';

    return (
      <div className={style.notification}>
        <span className={style.counter}>{counterValue}</span>
        <i className="material-icons">notifications</i>
      </div>
    );
  }
}
export default NotificationBell;