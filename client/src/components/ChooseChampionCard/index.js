import React, { Component } from 'react'
import style from './style.module.css'
import { ReactComponent as AddPlayerIcon } from '../../assets/add-player.svg'

const ChooseChampionCard = ({ key, onClick }) => {
  return (
    <div key={key} className={style.card} onClick={onClick}>
      <AddPlayerIcon/>
      Add player
    </div>
  )
}

export default ChooseChampionCard;
