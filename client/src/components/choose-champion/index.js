import React, { Component } from 'react';
import Button from 'components/button/index';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import classnames from 'classnames/bind';
import defaultAvatar from 'assets/placeholder.png';
import style from './style.module.css';

const cx = classnames.bind(style);

class ChooseChampion extends Component {
  state = {
    ids: [],
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

  addPlayers = () => {
    this.props.action(this.state.ids);
  };

  render() {
    return <div className={style.wrapper}>
      <div className={style.modal}>
        <header className={style.header}>
          <h3 className={style.title}>Choose your champion</h3>

          <button className={style.close} onClick={this.props.onClose}>
            <CloseIcon />
          </button>
        </header>

        <div className={style.content}>
          <div className={style.list}>
            {this.props.champions.map(item => <div
              className={cx('item', {'_is-checked': this.state.ids.indexOf(item.id) !== -1})}
              key={item._id}
              onClick={() => this.toggleChampion(item.id)}
            >
              <div className={style.image}>
                <img src={defaultAvatar} alt="Champion Avatar" />
              </div>

              <p className={style.name}>{item.name}</p>
            </div>)}
          </div>
        </div>

        <footer className={style.footer}>
          <Button
            appearance="_basic-accent"
            text="Add Players"
            className={style.button}
            disabled={this.state.ids.length === 0}
            onClick={this.addPlayers}
          />
        </footer>
      </div>
    </div>;
  }
}
export default ChooseChampion;