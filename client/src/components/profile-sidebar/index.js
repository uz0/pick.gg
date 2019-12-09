import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';

import { RULES } from 'constants/index';

import i18n from 'i18n';

import i18n from 'i18n';

import Avatar from './avatar';
import style from './style.module.css';

const GAMES = Object.keys(RULES);
class ProfileSidebar extends Component {
  render() {
    const { nickname, description, gameSpecificName, preferredPosition, source } = this.props;
    return (
      <aside className={style.sidebar}>
        <Avatar source={source}/>

        <div className={style.content}>
          {nickname && <div className={style.nickname}>{nickname}</div>}

          {!isEmpty(gameSpecificName) && GAMES.map(game =>
            gameSpecificName[game] ? (
              <div className={style.wrap_info}>
                <label className={style.label}>{i18n.t(`${game}_username`)}:</label>
                <p className={style.text}>{gameSpecificName[game]}</p>
              </div>
            ) : null
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
