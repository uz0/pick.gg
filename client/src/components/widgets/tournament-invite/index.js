import React, { useState } from 'react';
import ym from 'react-yandex-metrika';
import classnames from 'classnames/bind';

import i18n from 'i18next';

import widgetStyle from '../style.module.css';
import style from './style.module.css';

const cx = classnames.bind(style);

export default props => {
  const [isTextCopied, setTextCopied] = useState(false);

  return (
    <div className={cx(widgetStyle.widget, style.invite, props.className)}>
      <div className={cx(widgetStyle.header, style.header)}>
        <h3 className={widgetStyle.title}>{i18n.t('invite_summoners_and_viewers')}</h3>
      </div>
      <div className={cx(widgetStyle.content, style.content)}>
        <div className={style.link_wrapper}>
          <div
            className={style.link}
            onClick={() => {
              const linkInput = document.querySelector('[data-link]');
              linkInput.select();
              document.execCommand('copy');

              ym('reachGoal', 'copied_invite_link');

              setTextCopied(true);
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
        {isTextCopied && (
          <p className={style.message}>{i18n.t('link_was_copy')}</p>
        )}
      </div>
    </div>
  );
};
