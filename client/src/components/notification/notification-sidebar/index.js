import React, { Component } from 'react';
import Button from 'components/button';
import { ReactComponent as CloseIcon } from 'assets/close.svg';

import style from './style.module.css';
import classnames from 'classnames';

import i18n from 'i18n';

class NotificationSidebar extends Component {
  state = {
    isActive: false,
  }

  render() {
    return (
      <div className={style.overlay}>
        <div className={style.sidebar}>
          <div className={style.header}>
            <h4>{i18n.t('notification_sidebar_header')}</h4>
            
            <Button
              appearance="_icon-transparent"
              icon={<CloseIcon />}
              className={style.close}
            />
          </div>
          <div className={style.content}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
export default NotificationSidebar;