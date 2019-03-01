import React from 'react';
import ReactDOM from 'react-dom';
import Notification from '../components/notification/Notification';

class NotificationService {

  show = (text) => {
    let target = document.getElementById("notifications-wrapper");
    ReactDOM.render(<Notification text={text}/>, target);

    setTimeout(() => this.hide(), 3000);
  }
  
  hide = () => {
    let target = document.getElementById("notifications-wrapper");
    ReactDOM.unmountComponentAtNode(target);
  }

}

export default NotificationService;
