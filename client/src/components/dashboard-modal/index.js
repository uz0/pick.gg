import React, { Component } from 'react';

import Button from 'components/button';
import { ReactComponent as CloseIcon } from 'assets/close.svg';

import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

class Modal extends Component {
  render() {
    return <div className={style.wrapper}>
      <div className={cx('modal', this.props.wrapClassName)}>
        <div className={style.header}>
          <p className={style.title}>{this.props.title}</p>

          <Button
            appearance="_icon-transparent"
            icon={<CloseIcon />}
            onClick={this.props.close}
            className={style.close}
          />
        </div>

        <div className={cx('content', this.props.className)}>{this.props.children}</div>

        {this.props.actions &&
          <div className={cx('actions', {'_is-center': this.props.isActionsCenter})}>
            {this.props.actions.map(action => <Button
              appearance="_basic-accent"
              key={action.text}
              onClick={action.onClick}
              className={cx({'_is-danger': action.isDanger})}
              text={action.text}
            />)}
          </div>
        }
      </div>
    </div>;
  }
}

export default Modal;