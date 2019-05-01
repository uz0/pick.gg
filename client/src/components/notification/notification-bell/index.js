import React, { Component } from 'react';

import NotificationService from 'services/notificationService';

import style from './style.module.css';

class NotificationBell extends Component {
  constructor(){
    super();
    this.notificationService = new NotificationService({
      incrementNotificationCounter: this.incrementNotificationCounter,
      decrementNotificationCounter: this.decrementNotificationCounter,
    });
  }

  state = {
    isActive: false,
    notificationCount: 0,
  }

  incrementNotificationCounter = () => this.setState({ notificationCount: this.state.notificationCount + 1 });

  decrementNotificationCounter = () => this.setState({ notificationCount: this.state.notificationCount - 1 });

  showNotificationSidebar = () => this.notificationService.showNotificationSidebar();

  render() {
    const counterValue = this.state.notificationCount < 10 ? this.state.notificationCount : '9+';

    return (
      <div className={style.notification} onClick={this.showNotificationSidebar}>
        {counterValue > 0 &&
          <span className={style.counter}>{counterValue}</span>
        }
        <i className="material-icons">notifications</i>
      </div>
    );
  }
}
export default NotificationBell;