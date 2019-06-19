import React from 'react';
import ReactDOM from 'react-dom';
import Notification from '../components/old-notification';
import { ReactComponent as TrophyIcon } from 'assets/trophy.svg';
import { ReactComponent as MatchIcon } from 'assets/battle.svg';
import { ReactComponent as WarningIcon } from 'assets/warning.svg';
import { ReactComponent as SuccessIcon } from 'assets/success.svg';
import { ReactComponent as ErrorIcon } from 'assets/error.svg';

let notificationActions = {};

class NotificationService {
  constructor(options) {
    if (options) {
      if (options.showNotificationSidebar) {
        notificationActions.showNotificationSidebar = options.showNotificationSidebar;
        notificationActions.pushNotificationToSidebar = options.pushNotificationToSidebar;
      }

      if (options.incrementNotificationCounter) {
        notificationActions.incrementNotificationCounter = options.incrementNotificationCounter;
        notificationActions.decrementNotificationCounter = options.decrementNotificationCounter;
      }
    }
  }

  showSingleNotification = ({ id, shouldBeAddedToSidebar, link, type, message }) => {
    const target = document.getElementById('notifications-wrapper');
    let icon = '';

    switch (type) {
      case 'success':
        icon = <SuccessIcon />;
        break;
      case 'warning':
        icon = <WarningIcon />;
        break;
      case 'error':
        icon = <ErrorIcon />;
        break;
      case 'match':
        icon = <MatchIcon />;
        break;
      case 'winning':
        icon = <TrophyIcon />;
        break;
      default:
        icon = <SuccessIcon />;
        break;
    }

    let time = 4000;

    if (type === "match" || type === "winning") {
      time = 20000;
    }

    ReactDOM.render(
      <Notification
        image={icon}
        link={link}
        message={message}
        hideAfter={time}
        type={type}
      />, target);

    setTimeout(() => {
      if (shouldBeAddedToSidebar) {
        notificationActions.pushNotificationToSidebar({
          id,
          type,
          link,
          message,
        });
      }
      this.hideSingleNotification();
    }, time);
  }

  hideSingleNotification = () => {
    const target = document.getElementById('notifications-wrapper');
    ReactDOM.unmountComponentAtNode(target);
  }

  showNotificationSidebar() {
    notificationActions.showNotificationSidebar();
  }

  incrementNotificationCounter() {
    notificationActions.incrementNotificationCounter();
  }

  decrementNotificationCounter() {
    notificationActions.decrementNotificationCounter();
  }
}

export default NotificationService;
