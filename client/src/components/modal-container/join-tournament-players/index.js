import React, { Component } from 'react';
import Modal from 'components/modal';
import DetaulfAvatar from 'assets/avatar-placeholder.svg';
import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const _players = [
  { _id: '0' },
  { _id: '1' },
  { _id: '2' },
  { _id: '3' },
  { _id: '4' },
  { _id: '5' },
  { _id: '6' },
  { _id: '7' },
  { _id: '8' },
  { _id: '9' },
];

class JoinTournamentPlayers extends Component {
  state = {
    ids: [],
  };

  join = () => {

  };

  togglePlayer = id => () => this.setState(prevState => {
    const { ids } = prevState;

    if (ids.includes(id)) {
      return {
        ids: ids.filter(selectedId => selectedId !== id),
      };
    }

    if (ids.length >= 5) {
      return { ids };
    }

    return {
      ids: [...ids, id],
    };
  });

  render() {
    const isDisabled = this.state.ids.length < 5;

    const actions = [
      { text: 'Add Players', appearance: '_basic-accent', onClick: this.join, disabled: isDisabled },
    ];

    return (
      <Modal
        title="Choose five champions"
        close={this.props.close}
        actions={actions}
        wrapClassName={style.wrapper}
        className={style.content}
      >
        {_players.map(player => {
          const isChecked = this.state.ids.includes(player._id);

          return (
            <button
              key={player._id}
              className={cx('player', { '_is-checked': isChecked })}
              type="button"
              onClick={this.togglePlayer(player._id)}
            >
              <div className={style.image}>
                <img src={DetaulfAvatar} alt="Player"/>
              </div>

              <p className={style.name}>Kellin</p>
              <p className={style.position}>Position: Support</p>
              <p className={style.stat}>K: 0.1 D: 3.1 A: 4.4</p>
            </button>
          );
        })}
      </Modal>
    );
  }
}

export default JoinTournamentPlayers;
