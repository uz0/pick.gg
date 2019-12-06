import React, { Component } from 'react';

import i18n from 'i18n';

import Avatar from './avatar';
import style from './style.module.css';

class ProfileSidebar extends Component {
  render() {
    const { nickname, description, summonerName, preferredPosition, source } = this.props;
    return (
      <aside className={style.sidebar}>
        <Avatar source={source}/>

        <div className={style.content}>
          {nickname && <div className={style.nickname}>{nickname}</div>}

          {summonerName && (
            <div className={style.wrap_info}>
              <label className={style.label}>{i18n.t('summonername')}:</label>
              <p className={style.text}>{summonerName}</p>
            </div>
          )}

          {preferredPosition && (
            <div className={style.wrap_info}>
              <label className={style.label}>{i18n.t('position')}:</label>
              <p className={style.text}>{preferredPosition}</p>
            </div>
          )}

          {description && (
            <div className={style.wrap_info}>
              <label className={style.label}>{i18n.t('about')}:</label>
              <p className={style.text}>{description}</p>
            </div>
          )}
        </div>
      </aside>
    );
  }
}

export default ProfileSidebar;
