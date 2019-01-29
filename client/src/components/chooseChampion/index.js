import React from 'react'
import style from './chooseChampion.module.css'
import avatarPlayer from '../../assets/avatarPlayer.png'
const plays = [{ id: 0 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }, { id: 16 }, { id: 17 }, { id: 18 }]

const chooseChampion = ({ closeChoose }) => {
  return (
    <div className={style.wrap}>
      <div className={style.addChampion}>
        <div className={style.headerAdd}>
          <h2>Choose your champion</h2>
          <button className={style.closeBlock} onClick={closeChoose} />
        </div>
        <form>
          <div className={style.players}>
            {plays.map(item => (
              <div key={item.id} className={style.playerItem}>
                <img src={avatarPlayer} alt="avatar player" />
                <p>item.name</p>
              </div>
            ))}
          </div>
          <button onClick="">Add player</button>
        </form>
      </div>
    </div>
  )
}

export default chooseChampion
