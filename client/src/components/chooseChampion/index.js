import React from 'react'
import './chooseChampion.css'
import close from '../../assets/icon-close.svg'
import avatarPlayer from '../../assets/avatarPlayer.png'

const chooseChampion = () => {
  return (
    <div>
      <div className="fade" />
      <div className="addChampion">
        <h2>Choose your champion</h2>
        <img className="closeBlock" onClick={this.closeChoose} src={close} alt="close icon" />
        <form>
          <div className="players">
            <div className="player-item">
              <img src={avatarPlayer} alt="avatar player" />
              <p>Name player</p>
            </div>
            <div className="player-item">
              <img src={avatarPlayer} alt="avatar player" />
              <p>Name player</p>
            </div>
            <div className="player-item">
              <img src={avatarPlayer} alt="avatar player" />
              <p>Name player</p>
            </div>
            <div className="player-item">
              <img src={avatarPlayer} alt="avatar player" />
              <p>Name player</p>
            </div>
            <div className="player-item">
              <img src={avatarPlayer} alt="avatar player" />
              <p>Name player</p>
            </div>
            <div className="player-item">
              <img src={avatarPlayer} alt="avatar player" />
              <p>Name player</p>
            </div>
            <div className="player-item">
              <img src={avatarPlayer} alt="avatar player" />
              <p>Name player</p>
            </div>
            <div className="player-item">
              <img src={avatarPlayer} alt="avatar player" />
              <p>Name player</p>
            </div>
            <div className="player-item">
              <img src={avatarPlayer} alt="avatar player" />
              <p>Name player</p>
            </div>
            <div className="player-item">
              <img src={avatarPlayer} alt="avatar player" />
              <p>Name player</p>
            </div>
          </div>
          <button onClick="">Add player</button>
        </form>
      </div>
    </div>
  )
}

export default chooseChampion
