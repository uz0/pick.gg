import React, { Component } from 'react';
import Button from 'components/button';
import { ReactComponent as CloseIcon } from 'assets/close.svg';

import NotificationService from '../../../services/notificationService';

import style from './style.module.css';
import classnames from 'classnames';

import i18n from 'i18n';

class NotificationSidebar extends Component {

  constructor(){
    super();
    this.notificationService = new NotificationService({
      showNotificationSidebar: this.showNotificationSidebar,
    });
    
    this.state = {
      isShown: false,
    }
  }

  showNotificationSidebar = () => this.setState({ isShown: true });

  hideNotificationSidebar = () => this.setState({ isShown: false });

  render() {
    const { isShown } = this.state;

    return <>
      {isShown && <div className={style.overlay}>
        <div className={style.sidebar}>
          <div className={style.header}>
            <h4 className={style.title}>{i18n.t('notification_sidebar_header')}</h4>
            
            <Button
              appearance="_icon-transparent"
              icon={<CloseIcon />}
              onClick={this.hideNotificationSidebar}
              className={style.close}
            />
          </div>
          <div className={style.content}>
            {this.props.children}
          </div>
        </div>
      </div>
     }
    </>
  }
}
export default NotificationSidebar;