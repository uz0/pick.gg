import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '../button';
import { history } from 'index';
import { ReactComponent as CloseIcon } from '../../assets/notification-close.svg';
import soundfile from 'assets/alert.mp3';

import style from './style.module.css';
import classnames from 'classnames';

const cx = classnames.bind(style);

class Notification extends Component {
  state = {
    isShown: false,
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isShown: true }), 100);

    if (this.props.type === 'match' || this.props.type === 'winning') {
      const audio = new Audio(soundfile);
      audio.play();
    }

    if (this.props.hideAfter) {
      setTimeout(() => {
        if (this.notification) {
          this.setState({ isShown: false });
        }
      }, this.props.hideAfter - 500);
    }
  }

  handleLinkRedirect = () => {
    if (!this.props.link) {
      return;
    }

    history.replace(this.props.link);

    if (this.props.onLinkRedirect) {
      this.props.onLinkRedirect();
    }
  }

  close = event => {
    event.stopPropagation();

    this.setState({ isShown: false }, () => setTimeout(() => {
      const notificationContainer = document.querySelector('#notifications-wrapper');
      ReactDOM.unmountComponentAtNode(notificationContainer);
    }, 100));
  }

  render() {
    const closeButtonAction = this.props.onClose ? this.props.onClose : this.close;
    const isGame = this.props.type === 'winning' || this.props.type === 'match';

    return (
      <div ref={notification => this.notification = notification} className={cx(style.wrapper_n, { [style.clickable]: this.props.link }, this.props.wrapperStyle)} onClick={this.handleLinkRedirect}>
        <div className={cx(style.notification, { game: isGame }, { '_is-shown': this.state.isShown }, this.props.notificationStyle)}>
          <div className={style.header}>
            <div className={style.image}>
              {this.props.image}
            </div>
            <span className={style.type}>{this.props.type}</span>
          </div>

          <p className={style.message}>{this.props.message}</p>

          <Button
            className={style.close_button}
            appearance="_icon-transparent"
            icon={<CloseIcon/>}
            onClick={closeButtonAction}
          />
        </div>
      </div>
    );
  }
}

export default Notification;
