import React, { Component } from 'react';
import classnames from 'classnames/bind';
import groupBy from 'lodash/groupBy';
import find from 'lodash/find';
import filter from 'lodash/filter';
import Modal from 'components/modal';
import style from './style.module.css';

const cx = classnames.bind(style);

const _players = [
  { _id: '1dsfdsfffwee', name: 'ADD', position: 'Top' },
  { _id: '2dsfdsfffwee', name: 'Aiming', position: 'Top' },
  { _id: '3dsfdsfffwee', name: 'Alphari', position: 'Top' },
  { _id: '4dsfdsfffwee', name: 'AmazingJ', position: 'Top' },
  { _id: '5dsfdsfffwee', name: 'Bang', position: 'Top' },
  { _id: '6dsfdsfffwee', name: 'Biubiu', position: 'Top' },
  { _id: '7dsfdsfffwee', name: 'Bjergsen', position: 'Top' },
  { _id: '8dsfdsfffwee', name: 'Broken', position: 'Top' },
  { _id: 'd11sfdsfffwee', name: 'Sangyoon', position: 'Top' },
  { _id: '22dsfdsfffwee', name: 'Selfmade', position: 'Top' },
  { _id: 'dsfdfdsfffwee', name: 'ShowMaker', position: 'Top' },
  { _id: 'dssdfdsfffwee', name: 'Santorin', position: 'Top' },
  { _id: 'ddfdsdsfdsfffwee', name: '369', position: 'Top' },
  { _id: 'dddfdsdsfdsfffwee', name: '169', position: 'Top' },
  { _id: 'dfdfdsdsfdsfffwee', name: '669', position: 'Top' },
];

class ChoosePlayers extends Component {
  state = {
    selectedPlayers: this.props.options.formProps.values.players.length === 10 ? this.props.options.formProps.values.players : [],
    filter: '',
  };

  choose = () => {
    this.props.options.onChoose({
      ids: this.state.selectedPlayers,
      formProps: this.props.options.formProps,
    });

    this.props.close();
  };

  getSortedKeys = keys => {
    const numbers = filter(keys, key => !isNaN(parseInt(key, 10)));
    const letters = filter(keys, key => isNaN(parseInt(key, 10)));
    return [...letters, ...numbers];
  };

  onFilterInput = event => this.setState({ filter: event.target.value });

  clear = () => this.setState({ filter: '' });

  toggleSelectPlayer = id => () => {
    this.setState(prevState => {
      const playerIndex = prevState.selectedPlayers.indexOf(id);
      const players = [...prevState.selectedPlayers];

      if (playerIndex !== -1) {
        players.splice(playerIndex, 1);
      }

      if (playerIndex === -1) {
        players.push(id);
      }

      if (players.length > 10) {
        return;
      }

      return { selectedPlayers: players };
    });
  };

  render() {
    const players = filter(_players, player => player.name.toLowerCase().startsWith(this.state.filter.toLowerCase()));
    const group = groupBy(players, player => player.name[0]);
    const sortedKeys = this.getSortedKeys(Object.keys(group));
    const isSelectedPlayersShown = this.state.selectedPlayers.length > 0;
    const isFiltering = this.state.filter.length > 0;

    const actions = [];

    if (this.state.selectedPlayers.length === 10) {
      actions.push({ text: 'Choose', appearance: '_basic-accent', onClick: this.choose });
    }

    return (
      <Modal
        title="Choose tournament players"
        close={this.props.close}
        className={style.modal_content}
        wrapClassName={style.wrapper}
        actions={actions}
      >
        <div className={style.sidebar}>
          <h3 className={style.title}>Choosen players</h3>

          {!isSelectedPlayersShown &&
            <p className={style.empty}>You haven`t chosen any players yet</p>
          }

          {isSelectedPlayersShown &&
          this.state.selectedPlayers.map((id, index) => {
            const player = find(_players, { _id: id });
            return <p key={player._id} className={style.player}>{index + 1}. {player.name}</p>;
          })
          }
        </div>

        <div className={style.content}>
          <div className={style.search_container}>
            <input
              className={style.field}
              placeholder="Find a player"
              value={this.state.filter}
              onInput={this.onFilterInput}
            />

            <button className={style.clear} type="button" onClick={this.clear}>Clear</button>
          </div>

          <div className={style.players}>
            {!isFiltering &&
            sortedKeys.map(key => (
              <div key={key} className={style.section}>
                <h3 className={style.letter}>{key}</h3>

                <div className={style.list}>
                  {group[key].map(player => {
                    const isSelected = this.state.selectedPlayers.includes(player._id);

                    return (
                      <button
                        key={player._id}
                        className={cx('item', { '_is-selected': isSelected })}
                        type="button"
                        onClick={this.toggleSelectPlayer(player._id)}
                      >{player.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
            }

            {isFiltering && (
              <div className={style.section}>
                <div className={style.list}>
                  {players.map(player => {
                    const isSelected = this.state.selectedPlayers.includes(player._id);

                    return (
                      <button
                        key={player._id}
                        className={cx('item', { '_is-selected': isSelected })}
                        type="button"
                        onClick={this.toggleSelectPlayer(player._id)}
                      >{player.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

export default ChoosePlayers;
