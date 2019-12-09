import React from 'react';
import ym from 'react-yandex-metrika';
import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';
import classnames from 'classnames/bind';

import i18n from 'i18next';

import style from './style.module.css';

const cx = classnames.bind(style);

const enhance = compose(
  withStateHandlers(
    () => ({ isTextCopied: false }),

    {
      copyText: () => () => ({ isTextCopied: true }),
    }
  ),
);

export default enhance(props => {
  return (
    <div className={cx(style.invite, props.className)}>
      <div className={style.header}>
        <h3 className={style.subtitle}>{i18n.t('invite_summoners_and_viewers')}</h3>
      </div>
      <div className={style.content}>
        <div className={style.link_wrapper}>
          <div
            className={style.link}
            onClick={() => {
              const linkInput = document.querySelector('[data-link]');
              linkInput.select();
              document.execCommand('copy');

              ym('reachGoal', 'copied_invite_link');

              props.copyText();
            }}
          >
            <input
              readOnly
              className={style.href}
              data-link={document.location.href}
              value={document.location.href}
            />
            <button type="button" className={style.button}>{i18n.t('copy')}</button>
          </div>
        </div>
        {props.isTextCopied && (
          <p className={style.message}>{i18n.t('link_was_copy')}</p>
        )}
      </div>
    </div>
  );
});
