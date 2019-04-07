import React from 'react';
import ReactDOM from 'react-dom';
import Notification from '../components/notification';

class NotificationService {
  show = (text, link, history) => {
    const target = document.getElementById("notifications-wrapper");
    ReactDOM.render(<Notification text={text} link={link} history={history} />, target);

    setTimeout(() => this.hide(), 3000);
  }
  
  hide = () => {
    const target = document.getElementById("notifications-wrapper");
    ReactDOM.unmountComponentAtNode(target);
  }
}

export default NotificationService;
