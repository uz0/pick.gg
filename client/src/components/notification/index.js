import React, { Component } from 'react'
import style from './style.module.css'
import Button from '../button'
import { ReactComponent as CloseIcon } from '../../assets/close.svg'


class Notification extends Component {
  constructor() {
    super()
    this.state = {
      isShown: false,
    }
  }

  closeNotification = () => {
      this.setState({
        isShown: false
      })
  }



  render() {
    return (
      <div className={style.wrapper_n}>   
        {this.state.isShown && <div className={style.notification}><Button className={style.close_button} appearance={'_icon-transparent'} icon={<CloseIcon />}  />Text notification</div>}
      </div>
    )

  }
}
export default Notification