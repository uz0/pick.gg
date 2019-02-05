import React, { Component } from 'react'
import placeholder from '../../assets/placeholder.png'
import classnames from 'classnames/bind'
import style from './style.module.css'

const cx = classnames.bind(style);

const ChampionCard = ({ avatar, name, className, onClick }) => {
  let playerAvatar = avatar || placeholder;
  return (
    <div className={cx(style.card, className)} onClick={onClick}>
      <img src={playerAvatar} alt={name}/>
      <div className={style.name}>
        {name}
      </div>
    </div>
  )
}

export default ChampionCard
