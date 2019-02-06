import React, { Component } from 'react'
import Avatar from './Avatar'
import style from './style.module.css'

class ProfileSidebar extends Component {
  render() {
    return (
      <aside className={style.sidebar}>
        <Avatar />
        <div className={style.content}>
          <a href="#">Change avatar</a>
        </div>
      </aside>
    )
  }
}

export default ProfileSidebar
