import React, { Component } from 'react';
import Button from 'components/button';
import style from './style.module.css';

class Modal extends Component {
  render() {
    return <div className={style.wrapper}>
      <div className={style.modal}>
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
