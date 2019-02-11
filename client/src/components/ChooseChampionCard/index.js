import React from 'react'
import style from './style.module.css'
import { ReactComponent as AddPlayerIcon } from '../../assets/add-player.svg'

const ChooseChampionCard = ({ onClick }) => {
  return (
    <div className={style.card} onClick={onClick}>
      <AddPlayerIcon/>
      Add player
    </div>
  )
}

export default ChooseChampionCard;
