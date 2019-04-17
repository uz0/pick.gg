import React, { Component } from 'react';

import NotificationService from 'services/notificationService';

import style from './style.module.css';
import classnames from 'classnames';

const cx = classnames.bind(style);

class NotificationBell extends Component {

  constructor(){
    super();
    this.notificationService = new NotificationService();
  }

  state = {
    isActive: false,
    notificationCount: 12,
  }

  showNotificationSidebar = () => this.notificationService.showNotificationSidebar();

  render() {
    const counterValue = this.state.notificationCount < 10 ? this.state.notificationCount : '9+';

    return (
      <div className={style.notification} onClick={this.showNotificationSidebar}>
        <span className={style.counter}>{counterValue}</span>
        <i className="material-icons">notifications</i>
      </div>
    );
  }
}
export default NotificationBell;