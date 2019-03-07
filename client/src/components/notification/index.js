import React, { Component } from 'react';
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
    setTimeout(() => this.setState({ isShown: false }), 2800);
  }
  
  close = () => {
    setTimeout(() => this.setState({ isShown: false }), 100);
  }

  render() {
    return (
      <div className={style.wrapper_n}>
        <div className={classnames(style.notification, {'_is-shown': this.state.isShown})}>
          <Button
            className={style.close_button}
            appearance={'_icon-transparent'}
            icon={<CloseIcon />}
            onClick={() => this.close()}
          />
          {this.props.text}
        </div>
      </div>
    );
  }
}
export default Notification;