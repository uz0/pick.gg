import React, { Component } from 'react';
import Avatar from './avatar';
import style from './style.module.css';

class ProfileSidebar extends Component {

  render() {
    let { withData, nickname, description, source } = this.props;
    return (
      <aside className={style.sidebar}>
        <Avatar source={source} />
        
        <div className={style.content}>
          { !withData && <a href="/">Change avatar</a> }
          { nickname && <div className={style.nickname}>{nickname}</div> }
          { description && <p>{description}</p> }
        </div>
      </aside>
    );
  }
  
}

export default ProfileSidebar;
