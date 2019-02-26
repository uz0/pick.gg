import React, { Component } from 'react'
import style from './modal.module.css'
import { ReactComponent as CloseIcon } from '../../assets/close.svg'
import Button from '../button'

class Modal extends Component {
 render(){
   let {textModal, closeModal} = this.props
   return (
    <div className={style.wrapper_modal}>
      <div className={style.modal}>
        <Button className={style.close_button} appearance={'_icon-transparent'} icon={<CloseIcon />} onClick={closeModal} />
        <p>{textModal}</p>
        <div className={style.btns_modal}>
          <Button appearance={'_basic-accent'} type={'submit'} text={'Yes'} />
          <Button appearance={'_basic-accent'} onClick={closeModal} text={'No'} />
        </div>
      </div>
    </div>
   )
 }
}
export default Modal
