import React, { Component } from 'react'
import classnames from 'classnames';
import style from './style.module.css'

class Notification extends Component {

  state = {
    isShown: false,
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.notification.isShown && this.props.notification.isShown) {
      setTimeout(() => this.setState({ isShown: true }), 300);
      setTimeout(() => this.setState({ isShown: false }), 3300);
      setTimeout(() => this.props.hide(), 3600);
    }
  }

 render(){
   return (
    this.props.notification.isShown && <div className={style.wrapper}>
      <div className={classnames(style.notification, { '_is-shown': this.state.isShown })}>{ this.props.notification.text }</div>
    </div>)
 }
}
export default Notification