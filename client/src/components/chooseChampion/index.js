import React from 'react'
import './chooseChampion.css'
import avatarPlayer from '../../assets/avatarPlayer.png'
const plays = [{ id: 0 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }, { id: 16 }, { id: 17 }, { id: 18 }]

const chooseChampion = ({ closeChoose }) => {
  return (
    <div>
      <div className="fade" />
      <div className="add-champion">
        <h2>Choose your champion</h2>
        <button className="close-block" onClick={closeChoose} />
        <form>
          <div className="players">
            {plays.map(item => (
              <div key={item.id} className="player-item">
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
