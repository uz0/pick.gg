import React, { Component } from 'react';
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
              <label className={style.label}>Summoner Name:</label>
              <p className={style.text}>{summonerName}</p>
            </div>
          )}

          {preferredPosition && (
            <div className={style.wrap_info}>
              <label className={style.label}>Position:</label>
              <p className={style.text}>{preferredPosition}</p>
            </div>
          )}

          {description && (
            <div className={style.wrap_info}>
              <label className={style.label}>About:</label>
              <p className={style.text}>{description}</p>
            </div>
          )}
        </div>
      </aside>
    );
  }
}

export default ProfileSidebar;
