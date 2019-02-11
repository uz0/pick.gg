import React from 'react'
import style from './style.module.css'
import { ReactComponent as AvatarPlaceholder } from '../../../assets/avatar-placeholder.svg'

const Avatar = ({ source }) => {

  let AvatarComponent = () => source ? <img src={source} alt="avatar"/> : <AvatarPlaceholder />

  return (
    <div className={style.avatar}>
      <AvatarComponent />
    </div>
  )

}

export default Avatar
