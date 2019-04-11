import React, { Component } from 'react';
import Button from '../button';
import style from './style.module.css';
import i18n from 'i18n';

class Modal extends Component {
  render(){
    let {textModal, closeModal, submitClick} = this.props;
    return (
      <div className={style.wrapper_modal}>
        <div className={style.modal}>
          <p>{textModal}</p>
          
          <div className={style.btns_modal}>
            <Button appearance={'_basic-accent'} type={'submit'} onClick={submitClick} text={i18n.t('yes')} />
            <Button appearance={'_basic-accent'} className={'_is-danger'} onClick={closeModal} text={i18n.t('no')} />
          </div>
        </div>
      </div>
    );
  }
}
export default Modal;
