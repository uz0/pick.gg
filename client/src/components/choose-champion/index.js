import React, { Component } from 'react';
import Button from 'components/button';
import DialogWindow from 'components/dialog-window';

import { ReactComponent as CloseIcon } from 'assets/close.svg';
import Avatar from 'assets/avatar-placeholder.svg';

import i18n from 'i18n';
import uuid from 'uuid';

import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

class ChooseChampion extends Component {
  state = {
    ids: [],
    isFreeTournamentModalShown: false,
  };

  toggleChampion = id => {
    const { ids } = [...this.state];
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

  toggleFreeTournamentModal = () => this.setState(prevState => ({ isFreeTournamentModalShown: !prevState.isFreeTournamentModalShown }));

  addPlayers = () => {
    this.props.action(this.state.ids);
  };

  renderStatisticItem = ({ category, value }) => {
    let categoryText = '';

    if (category === 'kda_ratio') {
      return;
    }

    if (category === 'avg_kills') {
      categoryText = 'K';
    }

    if (category === 'avg_deaths') {
      categoryText = 'D';
    }

    if (category === 'avg_assists') {
      categoryText = 'A';
    }

    return (
      <div key={uuid()} className={style.statistic_item}>
        {categoryText}: {value}
      </div>
    );
  };

  renderChampion = ({ _id, photo, name, position, stats }) => {
    const championPhoto = photo ? photo : Avatar;

    return (
      <div
        key={_id}
        className={cx('item', { '_is-checked': this.state.ids.includes(_id) })}
        onClick={() => this.toggleChampion(_id)}
      >
        <div className={style.image}>
          <img src={championPhoto} alt={i18n.t('champion_avatar')} onError={event => {
            event.target.src = Avatar;
          }
          }
          />
        </div>

        <p className={style.name}>{name}</p>

        {position && (
          <div className={style.stats_item}>
            <div className={style.statistic_item}>
            Position: {position}
            </div>
          </div>
        )}

        <div className={style.stats_item}>
          {stats.map(element => this.renderStatisticItem(element))}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={style.wrapper}>
        <div className={style.modal}>
          <header className={style.header}>
            <h3 className={style.title}>{i18n.t('choose_your_champion')}</h3>

            <button type="button" className={style.close} onClick={this.props.onClose}>
              <CloseIcon/>
            </button>
          </header>

          {this.state.isFreeTournamentModalShown && (
            <DialogWindow
              text={i18n.t('free_tournament')}
              onSubmit={this.addPlayers}
              onClose={this.toggleFreeTournamentModal}
            />
          )}

          <div className={style.content}>
            <div className={style.list}>
              {this.props.champions.map(item => this.renderChampion(item))}
            </div>
          </div>

          <footer className={style.footer}>
            <Button
              appearance="_basic-accent"
              text={i18n.t('add_players')}
              className={style.button}
              disabled={this.state.ids.length < 5}
              onClick={this.toggleFreeTournamentModal}
            />
          </footer>
        </div>
      </div>
    );
  }
}
export default ChooseChampion;
