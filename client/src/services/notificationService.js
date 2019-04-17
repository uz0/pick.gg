import React from 'react';
import ReactDOM from 'react-dom';
import Notification from '../components/notification';
import { ReactComponent as TrophyIcon } from 'assets/trophy.svg';
import { ReactComponent as MatchIcon } from 'assets/battle.svg';

let notificationActions = {};

class NotificationService {
  constructor(options){
    if(options){
      notificationActions.showNotificationSidebar = options.showNotificationSidebar;
      notificationActions.pushNotificationToSidebar = options.pushNotificationToSidebar;

      if(options.incrementNotificationCounter){
        notificationActions.incrementNotificationCounter = options.incrementNotificationCounter;
        notificationActions.decrementNotificationCounter = options.decrementNotificationCounter;
      }
    }
  }

  showSingleNotification = ({ id, type, message }) => {
    const target = document.getElementById('notifications-wrapper');
    ReactDOM.render(<Notification
      image={<MatchIcon />}
      message={message}
    />, target);

    setTimeout(() => {
      notificationActions.pushNotificationToSidebar({
        id,
        type,
        message
      });
      this.hideSingleNotification();
    }, 5000);
  }
  
  hideSingleNotification = () => {
    const target = document.getElementById('notifications-wrapper');
    ReactDOM.unmountComponentAtNode(target);
  }

  showNotificationSidebar(){
    notificationActions.showNotificationSidebar();
  }
  
  incrementNotificationCounter(){
    notificationActions.incrementNotificationCounter();
  }
  
  decrementNotificationCounter(){
    console.log(notificationActions);
    notificationActions.decrementNotificationCounter();
  }
}

export default NotificationService;
