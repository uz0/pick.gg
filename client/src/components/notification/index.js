import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import history from '../../history';
import Button from '../button';
import { ReactComponent as CloseIcon } from '../../assets/notification-close.svg';

import style from './style.module.css';
import classnames from 'classnames';

const cx = classnames.bind(style);

class Notification extends Component {
  state = {
    isShown: false,
  }

  componentDidMount(){
    setTimeout(() => this.setState({ isShown: true }), 100);
  }

  handleLinkRedirect = () => {
    if(!this.props.link){
      return;
    }

    history.replace(this.props.link);
  }
  
  close = () => {
    this.setState({ isShown: false }, () => setTimeout(() => {
      const notificationContainer = document.getElementById('notifications-wrapper');
      ReactDOM.unmountComponentAtNode(notificationContainer);
    }, 100));
  }

  render() {
    const closeButtonAction = this.props.onClose ? this.props.onClose : this.close;

    return (
      <div onClick={this.handleLinkRedirect} className={classnames(style.wrapper_n, {[style.clickable]: this.props.link},this.props.wrapperStyle)}>
        <div className={classnames(style.notification, {'_is-shown': this.state.isShown}, this.props.notificationStyle)}>
          <div className={style.image}>
            {this.props.image}
          </div>

          <p className={style.message}>{this.props.message}</p>

          <Button
            className={style.close_button}
            appearance={'_icon-transparent'}
            icon={<CloseIcon />}
            onClick={closeButtonAction}
          />
        </div>
      </div>
    );
  }
}

export default Notification;