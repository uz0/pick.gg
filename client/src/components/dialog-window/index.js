import React from 'react';
import Button from 'components/button';
import style from './style.module.css';
import i18n from 'i18n';

const DialogWindow = ({ text, onSubmit, onClose }) => (
  <div className={style.wrapper}>
    <div className={style.dialog}>
      <p>{text}</p>

      <div className={style.controls}>
        <Button
          appearance="_basic-accent"
          type="submit"
          text={i18n.t('yes')}
          onClick={onSubmit}
        />

        <Button
          appearance="_basic-accent"
          className="_is-danger"
          text={i18n.t('no')}
          onClick={onClose}
        />
      </div>
    </div>
  </div>
);

export default DialogWindow;
