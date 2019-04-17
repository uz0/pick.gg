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
    }
  }

  showSingleNotification = (text, link, history) => {

    const target = document.getElementById('notifications-wrapper');
    ReactDOM.render(<Notification
      image={<MatchIcon />}
      message={text}
      link={link}
      history={history}
    />, target);

    setTimeout(() => this.hideSingleNotification(), 70000);

  }
  
  hideSingleNotification = () => {
    const target = document.getElementById('notifications-wrapper');
    ReactDOM.unmountComponentAtNode(target);
  }

  showNotificationSidebar(){
    notificationActions.showNotificationSidebar();
  }

}

export default NotificationService;
