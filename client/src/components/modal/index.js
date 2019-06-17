import React, { Component } from 'react';
import Button from 'components/button';
import style from './style.module.css';

class Modal extends Component {
  preventClose = event => event.stopPropagation();

  render() {
    return <div className={style.wrapper} onClick={this.props.close}>
      <div className={style.modal} onClick={this.preventClose}>
        <div className={style.header}>
          <h2 className={style.title}>{this.props.title}</h2>

          <Button
            appearance="_icon-transparent"
            icon="close"
            className={style.close}
            onClick={this.props.close}
          />
        </div>

        <div className={style.content}>{this.props.children}</div>
      </div>
    </div>;
  }
}

export default Modal;
