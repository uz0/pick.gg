import React, { Component } from 'react';
import { Portal } from 'react-portal';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import classnames from 'classnames/bind';
import Button from 'components/button';
import { ReactComponent as TrophyIcon } from 'assets/trophy.svg';
import { ReactComponent as MatchIcon } from 'assets/battle.svg';
import { ReactComponent as WarningIcon } from 'assets/warning.svg';
import { ReactComponent as SuccessIcon } from 'assets/success.svg';
import { ReactComponent as ErrorIcon } from 'assets/error.svg';
import { ReactComponent as BattleIcon } from 'assets/battle.svg';
import sound from 'assets/alert.mp3';
import i18n from 'i18next';
import actions from './actions';
import style from './style.module.css';

export { default as actions } from './actions';
export { default as reducers } from './reducers';

const cx = classnames.bind(style);

class Notification extends Component {
  timeout = null;

  state = {
    isShown: false,
    isInDom: false,
  };

  open = () => {
    this.setState({
      isShown: true,
      isInDom: true,
    });

    if (this.props.type === 'match' || this.props.type === 'winning') {
      const audio = new Audio(sound);
      audio.play();
    }

    this.timeout = setTimeout(() => this.close(), 5000);
  };

  forceOpen = () => {
    clearTimeout(this.timeout);

    this.setState({
      isShown: false,
      isInDom: false,
    }, this.open);
  };

  hideAfterAnimation = () => setTimeout(() => {
    this.setState({ isInDom: false });
    this.props.close();
  }, 100);

  close = () => {
    clearTimeout(this.timeout);
    this.setState({ isShown: false }, this.hideAfterAnimation);
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.isShown && nextProps.isShown) {
      this.open();
    }

    if (this.props.isShown && nextProps.isShown) {
      this.forceOpen();
    }
  }

  render() {
    const isMatch = this.props.type === 'match';
    const isError = this.props.type === 'error';
    const isSuccess = this.props.type === 'success';
    const isWarning = this.props.type === 'warning';
    const isWinning = this.props.type === 'winning';
    let title = '';

    if (isMatch) {
      title = i18n.t('match');
    }

    if (isError) {
      title = i18n.t('error');
    }

    if (isSuccess) {
      title = i18n.t('success');
    }

    if (isWarning) {
      title = i18n.t('warning');
    }

    if (isWinning ) {
      title = i18n.t('winning');
    }

    return this.state.isInDom && <Portal>
      <div className={style.wrapper}>
        <div
          className={cx('notification', {
            '_is-shown': this.state.isShown,
            '_is-match': isMatch,
          })}
        >
          <div className={style.header}>
            {isMatch &&
              <i><BattleIcon /></i>
            }

            {isError &&
              <i><ErrorIcon /></i>
            }

            {isSuccess &&
              <i><SuccessIcon /></i>
            }

            {isWarning &&
              <i><WarningIcon /></i>
            }

            {isWinning &&
              <i><TrophyIcon /></i>
            }

            <h3 className={style.title}>{title}</h3>

            <Button
              className={style.close}
              appearance="_icon-transparent"
              icon="close"
              onClick={this.close}
            />
          </div>

          <p className={style.message}>{this.props.message}</p>
        </div>
      </div>
    </Portal>;
  }
}

export default compose(
  connect(
    state => ({
      isShown: state.notification.isShown,
      type: state.notification.type || 'success',
      message: state.notification.message,
    }),

    {
      close: actions.closeNotification,
    },
  ),
)(Notification);
