import React, { Component } from 'react';
import Avatar from './Avatar';
import style from './style.module.css';

class ProfileSidebar extends Component {

  render() {
    let { withData, nickname, description } = this.props;
    return (
      <aside className={style.sidebar}>
        <Avatar />
        <div className={style.content}>
          { !withData && <a href="/">Change avatar</a> }
          { nickname && <div>{nickname}</div> }
          { description && <p>{description}</p> }
        </div>
      </aside>
    );
  }
  
}

export default ProfileSidebar;
