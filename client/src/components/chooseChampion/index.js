import React, { Component } from 'react'
import Button from '../button/index'
import ChampionCard from '../ChampionCard'
import { ReactComponent as CloseIcon } from '../../assets/close.svg'
import classnames from 'classnames';
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

  participateInTournament = (e) => {
    e.preventDefault();
    this.props.setChoosedChampions(this.state.choosedChampions);
  }

  isChampionChoosed = (championName) => this.state.choosedChampions.includes(championName);

  selectChampion = (playerName) => {
    let choosedChampions = this.state.choosedChampions;

    if(choosedChampions.length >= 5) {
      if(choosedChampions.includes(playerName)){
        choosedChampions.splice(choosedChampions.indexOf(playerName), 1)
        this.setState({ choosedChampions })
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
          <form onSubmit={this.participateInTournament}>
            <div className={style.players}>
              {champions.map(champion => <ChampionCard
                key={uuid()}
                name={champion.name}
                className={cx({choosed: this.isChampionChoosed(champion.name)})}
                onClick={() => this.selectChampion(champion.name)}
              />)}
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
