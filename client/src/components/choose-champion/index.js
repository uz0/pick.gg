import React, { Component } from 'react';
import Button from 'components/button/index';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import classnames from 'classnames/bind';
import defaultAvatar from 'assets/placeholder.png';
import i18n from 'i18n';
import style from './style.module.css';

import Modal from 'components/modal'

const cx = classnames.bind(style);

class ChooseChampion extends Component {
  state = {
    ids: [],
    isFreeTournamentModalShown: false,
  };

  toggleChampion = id => {
    let ids = [...this.state.ids];
    const index = ids.indexOf(id);

    if (index === -1 && ids.length === 5) {
      return;
    }

    if (index === -1) {
      ids.push(id);
    } else {
      ids.splice(index, 1);
    }

    this.setState({ ids });
  };

  toggleFreeTournamentModal = () => this.setState({isFreeTournamentModalShown: !this.state.isFreeTournamentModalShown});

  addPlayers = () => {
    this.props.action(this.state.ids);
  };

  render() {
    return <div className={style.wrapper}>
      <div className={style.modal}>
        <header className={style.header}>
          <h3 className={style.title}>{i18n.t('choose_your_champion')}</h3>

          <button className={style.close} onClick={this.props.onClose}>
            <CloseIcon />
          </button>
        </header>

        {this.state.isFreeTournamentModalShown && <Modal textModal={i18n.t('free_tournament')} submitClick={this.addPlayers} closeModal={this.toggleFreeTournamentModal}/>}

        <div className={style.content}>
          <div className={style.list}>
            {this.props.champions.map(item => <div
              className={cx('item', {'_is-checked': this.state.ids.indexOf(item.id) !== -1})}
              key={item._id}
              onClick={() => this.toggleChampion(item.id)}
            >
              <div className={style.image}>
                <img src={defaultAvatar} alt={i18n.t('champion_avatar')} />
              </div>

              <p className={style.name}>{item.name}</p>
            </div>)}
          </div>
        </div>

        <footer className={style.footer}>
          <Button
            appearance="_basic-accent"
            text={i18n.t('add_players')}
            className={style.button}
            disabled={this.state.ids.length === 0}
            onClick={this.toggleFreeTournamentModal}
          />
        </footer>
      </div>
    </div>;
  }
}
export default ChooseChampion;