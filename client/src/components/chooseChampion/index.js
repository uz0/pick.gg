import React, { Component } from 'react'
import avatarPlayer from '../../assets/avatarPlayer.png'
import Button from '../button/index'
import { ReactComponent as CloseIcon } from '../../assets/close.svg'
import classnames from 'classnames/bind'
import style from './chooseChampion.module.css'
import uuid from 'uuid'

const cx = classnames.bind(style);

class chooseChampion extends Component {

  constructor(){
    super();
    this.state = {
      choosedChampions: [],
    }
  }

  addChosedChampions = (e) => {
    e.preventDefault();
    this.props.setChoosedChampions(this.state.choosedChampions);
  }

  selectChampion = (playerName) => {
    let choosedChampions = this.state.choosedChampions;

    if(choosedChampions.length >= 5) {
      if(choosedChampions.includes(playerName)){
        choosedChampions.splice(choosedChampions.indexOf(playerName), 1)
        this.setState({ choosedChampions })
        return;
      } else {
        return;
      }
    };

    if (!choosedChampions.includes(playerName)){
      this.setState({ choosedChampions: [...choosedChampions, playerName] })
    } else {
      choosedChampions.splice(choosedChampions.indexOf(playerName), 1)
      this.setState({ choosedChampions })
    }
  }

  render(){

    let { closeChoose, champions } = this.props
    let isChampionChoosed = (championName) => this.state.choosedChampions.includes(championName);
    let areChampionsSelected = this.state.choosedChampions.length < 5 ? true : false;

    return (
      <div className={style.wrap}>
        <div className={style.add_сhampion}>
          <div className={style.header_add}>
            <h2>Choose your champion</h2>
            <Button
              appearance={'_icon-transparent'}
              icon={<CloseIcon />}
              onClick={closeChoose}
            />
          </div>
          <form onSumit={this.addChosedChampions}>
            <div className={style.players}>
              {champions.map(item => (
                <div key={uuid()} onClick={e => this.selectChampion(item.name)} className={cx({ choosed: isChampionChoosed(item.name) }, style.player_item)}>
                  <img src={avatarPlayer} alt="avatar player" />
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
            <Button
              appearance={'_basic-accent'}
              type={'submit'}
              text={'Add players'}
              disabled={areChampionsSelected}
            />
          </form>
        </div>
      </div>
    )
  }

}

export default chooseChampion
