import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';

import Avatar from 'components/avatar';

import { RULES } from 'constants/index';

import i18n from 'i18n';

import style from './style.module.css';

const GAMES = Object.keys(RULES);
class ProfileSidebar extends Component {
  render() {
    const { nickname, description, gameSpecificFields, source } = this.props;
    const isContentShown = nickname || !isEmpty(gameSpecificFields) || description;

    return (
      <aside className={style.sidebar}>
        <Avatar source={source} className={style.avatar}/>

        {isContentShown && (
          <div className={style.content}>
            {nickname && <div className={style.nickname}>{nickname}</div>}

            {!isEmpty(gameSpecificFields) && GAMES.map(game =>
              gameSpecificFields[game].displayName ? (
                <div className={style.wrap_info}>
                  <label className={style.label}>{i18n.t(`${game}_username`)}:</label>
                  <p className={style.text}>{gameSpecificFields[game].displayName}</p>
                </div>
              ) : null
            )}

            {description && (
              <div className={style.wrap_info}>
                <label className={style.label}>{i18n.t('about')}:</label>
                <p className={style.text}>{description}</p>
              </div>
            )}
          </div>
        )}
      </aside>
    );
  }
}

export default ProfileSidebar;
