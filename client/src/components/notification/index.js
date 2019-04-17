import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '../button';
import { ReactComponent as CloseIcon } from '../../assets/notification-close.svg';

import style from './style.module.css';
import classnames from 'classnames';

class Notification extends Component {
  state = {
    isShown: false,
  }

  componentDidMount(){
    setTimeout(() => this.setState({ isShown: true }), 100);
  }
  
  close = () => {
    this.setState({ isShown: false }, () => setTimeout(() => {
      const notificationContainer = document.getElementById('notifications-wrapper');
      ReactDOM.unmountComponentAtNode(notificationContainer);
    }, 100));
  }

  render() {
    const isHaveLink = this.props.link ? true : false;

    return (
      <div className={style.wrapper_n}>
        <div className={classnames(style.notification, {'_is-shown': this.state.isShown})}>
          <div className={style.image}>
            {this.props.image}
          </div>

          {!isHaveLink && <p className={style.message}>{this.props.message}</p>}

          <Button
            className={style.close_button}
            appearance={'_icon-transparent'}
            icon={<CloseIcon />}
            onClick={() => this.close()}
          />
        </div>
      </div>
    );
  }
}
export default Notification;