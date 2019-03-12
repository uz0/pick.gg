import React, { Component } from 'react';
import Button from '../button/index';
import ChampionCard from '../champion-card';
import TransactionService from '../../services/transactionService';
import Modal from '../../components/modal';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import classnames from 'classnames';
import style from './style.module.css';
import uuid from 'uuid';
import i18n from '../../i18n';

const cx = classnames.bind(style);

class chooseChampion extends Component {

  constructor(){
    super();
    this.TransactionService = new TransactionService();
    this.state = {
      userBalance: 0,
      choosedChampions: [],
      modalChoose: false,
    };
  }

  showModal = () => {
    this.setState({
      modalChoose: true,
    });
  }

  participateInTournament = (event) => {
    event.preventDefault();
    this.props.setChoosedChampions(this.state.choosedChampions);
  }

  isChampionChoosed = (championName) => this.state.choosedChampions.map(item => item.name).includes(championName);

  selectChampion = (champion) => {

    let choosedChampions = this.state.choosedChampions;
    let choosedChampionsNames = choosedChampions.map(item => item.name);
    
    if (choosedChampions.length === 5) {
      if (choosedChampionsNames.includes(champion.name)){
        choosedChampions.splice(choosedChampionsNames.indexOf(champion.name), 1);
        this.setState({ choosedChampions });
        return;
      }
      return;
    }

    if (!choosedChampionsNames.includes(champion.name)){
      this.setState({ choosedChampions: [...choosedChampions, champion] });
    } else {
      choosedChampions.splice(choosedChampionsNames.indexOf(champion.name), 1);
      this.setState({ choosedChampions });
    }
  }

  componentDidMount = async() => {
    const userBalance = await this.TransactionService.getUserBalance();
    
    this.setState({
      userBalance: userBalance.balance,
    });
  }

  render(){
    let userBalance = this.state.userBalance;
    let { closeChoose, champions, tournamentEntry } = this.props;

    let areChampionsSelected = this.state.choosedChampions.length < 5;
    let isUserHasMoneyToPlay = userBalance >= tournamentEntry;
    let isButtonDisabled = (isUserHasMoneyToPlay === false) ? true : areChampionsSelected;
    return (
      <div className={style.wrap}>
        <div className={style.add_сhampion}>
          <div className={style.header_add}>
            <h2>{i18n.t('choose_champion')}</h2>
            <Button
              appearance={'_icon-transparent'}
              icon={<CloseIcon />}
              onClick={closeChoose}
            />
          </div>

          <form onSubmit={this.showModal}>
            {this.state.modalChoose && <Modal
              textModal={'You should pay entry '+ tournamentEntry +'$ ?'}
              closeModal={this.closeModalChoose}
              submitClick={this.participateInTournament}
            />}
            
            <div className={style.players}>
              {champions.map(champion => <ChampionCard
                key={uuid()}
                name={champion.name}
                avatar={champion.photo}
                className={cx({choosed: this.isChampionChoosed(champion.name)})}
                onClick={() => this.selectChampion(champion)}
              />)}
            </div>
            
            <div className={style.footer_add}>
              <Button
                appearance={'_basic-accent'}
                onClick={this.showModal}
                text={i18n.t('add_players')}
                disabled={isButtonDisabled}
                type="button"
              />
              {!isUserHasMoneyToPlay && <p className={style.warning}>Sorry, you don't have enough money to take part in a tournament</p>}
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default chooseChampion;