import React from 'react';
import Button from 'components/button';
import style from './style.module.css';
import i18n from 'i18n';

const DialogWindow = ({ text, onSubmit, onClose }) => <div className={style.wrapper}>
  <div className={style.dialog}>
    <p>{text}</p>
    
    <div className={style.controls}>
      <Button
        appearance={'_basic-accent'}
        type={'submit'}
        onClick={onSubmit}
        text={i18n.t('yes')}
      />

      <Button
        appearance={'_basic-accent'}
        className={'_is-danger'}
        onClick={onClose}
        text={i18n.t('no')}
      />
    </div>
  </div>
</div>;

export default DialogWindow;
