import React, { Component } from 'react';
import Button from '../button';
import style from './style.module.css';

class Modal extends Component {
  render(){
    let {textModal, closeModal, submitClick} = this.props;
    return (
      <div className={style.wrapper_modal}>
        <div className={style.modal}>
          <p>{textModal}</p>
          
          <div className={style.btns_modal}>
            <Button appearance={'_basic-accent'} type={'submit'} onClick={submitClick} text={'Yes'} />
            <Button appearance={'_basic-accent'} onClick={closeModal} text={'No'} />
          </div>
        </div>
      </div>
    );
  }
}
export default Modal;
