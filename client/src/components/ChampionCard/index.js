import React, { Component } from 'react'
import placeholder from '../../assets/placeholder.png'
import classnames from 'classnames/bind'
import style from './style.module.css'

const ChampionCard = ({ key, avatar, name }) => {
  let playerAvatar = avatar || placeholder;
  return (
    // <div key={key} className={style.card} className={cx({ choosed: isChampionChoosed(item.name) }, style.card)}>
    <div key={key} className={style.card} className={style.card}>
      <img src={playerAvatar} alt={name}/>
      <div className={style.name}>
        {name}
      </div>
    </div>
  )
}

export default ChampionCard
