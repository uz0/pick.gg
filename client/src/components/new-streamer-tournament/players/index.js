import React, { Component } from 'react';
import moment from 'moment';

import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';

import Input from 'components/input';
import Button from 'components/button';
import Preloader from 'components/preloader';
import Modal from 'components/dashboard-modal';

import http from 'services/httpService';
import AdminService from 'services/adminService';
import NotificationService from 'services/notificationService';
import StreamerService from 'services/streamerService';

import classnames from 'classnames';
import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

class PlayersStep extends Component {
  constructor() {
    super();

    this.adminService = new AdminService();
    this.notificationService = new NotificationService();
    this.streamerService = new StreamerService();

    this.rules = [];
    this.realTournaments = [];
  }

  async componentDidMount() {
    this.setState({ arePlayersLoading: true });

    const { players } = await this.adminService.getAllChampions();
    const playersSortedByAlphabet = players.sort((prev, next) => prev.name.localeCompare(next.name));

    const groupedPlayers = groupBy(playersSortedByAlphabet, player => player.name[0].toUpperCase());

    this.setState({
      players: groupedPlayers,
      arePlayersLoading: false,
    });
  }

  state = {
    players: [],
    chosenPlayers: [],
    championData: {
      name: '',
      photo: '',
      position: ''
    },
    isPlayerChoosing: false,
    isPlayerCreating: false,
    isChampionModalLoading: false,
    arePlayersLoading: false,
  }

  showPlayerCreatingModal = () => this.setState({ isPlayerCreating: true });

  closePlayerCreatingModal = () => this.setState({
    championData: [],
    isPlayerCreating: false,
  });

  showPlayerChoosingModal = () => this.setState({ isPlayerChoosing: true });

  closePlayerChoosingModal = () => this.setState({
    isPlayerChoosing: false,
  });

  handleChampionInputChange = (event) => {
    this.setState({
      championData: {
        ...this.state.championData,
        [event.target.name]: event.target.value,
      },
    });
  };

  playerClickHandler = (player) => {
    let { chosenPlayers } = this.state;
    const index = findIndex(chosenPlayers, { _id: player._id });

    if (index === -1 && chosenPlayers.length === 10) {
      return;
    }

    if (index === -1) {
      chosenPlayers.push(player);
    } else {
      chosenPlayers.splice(index, 1);
    }

    this.setState({ chosenPlayers });
  }

  submitPlayerCreatingForm = async (event) => {
    event.preventDefault();

    const { name, photo, position } = this.state.championData;

    if (name.length === 0 || name.position === 0) {
      this.notificationService.showSingleNotification({
        type: 'warning',
        shouldBeAddedToSidebar: false,
        message: `Fields name and position are required`,
      });

      return;
    }

    if (name.length > 20) {
      this.notificationService.showSingleNotification({
        type: 'warning',
        shouldBeAddedToSidebar: false,
        message: 'Name can not contain more than 20 characters',
      });

      return;
    }

    const payload = {
      name,
      photo,
      position
    };

    try {
      this.setState({ isChampionModalLoading: true });

      await this.streamerService.createPlayer(payload);

      this.notificationService.showSingleNotification({
        type: 'success',
        shouldBeAddedToSidebar: false,
        message: `You've created player with name ${name}`,
      });

      const { players } = await this.adminService.getAllChampions();
      const playersSortedByAlphabet = players.sort((prev, next) => prev.name.localeCompare(next.name));

      const groupedPlayers = groupBy(playersSortedByAlphabet, player => player.name[0].toUpperCase());

      this.setState({
        players: groupedPlayers,
        championData: {
          name: '',
          photo: '',
          position: ''
        },
        isChampionModalLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div>
        <p>Tournament players</p>
        <div className={style.chosen_champions}>
          {this.state.chosenPlayers.map((item, index) => <div>{`${index + 1}. ${item.name}`}</div>)}
          <Button
            appearance={'_circle-accent'}
            icon={<i className="material-icons">add</i>}
            onClick={this.showPlayerChoosingModal}
          />
        </div>

        {this.state.isPlayerChoosing && <Modal
          title={'Choose 10 players'}
          close={this.closePlayerChoosingModal}
          wrapClassName={style.players_modal}
        >

          <div className={style.players_sidebar}>
            <h3>Chosen players</h3>

            {this.state.chosenPlayers.length === 0 &&
              <p className={style.attention}>You haven't chosen any players yet</p>
            }

            {this.state.chosenPlayers.length > 1 && this.state.chosenPlayers.length < 10 &&
              <p className={style.attention}>Great! {10 - this.state.chosenPlayers.length} players left</p>
            }

            <div className={style.chosen_players}>
              {this.state.chosenPlayers.map((item, index) => <div>{`${index + 1}. ${item.name}`}</div>)}
            </div>

            {this.state.chosenPlayers.length === 10 &&
              <div className={style.add_players_to_tournament}>
                <Button
                  text='Add players to tournament'
                  appearance='_basic-accent'
                  onClick={this.showPlayerCreatingModal}
                />
              </div>
            }

            <p>Cannot find your player?</p>

            <Button
              text='Create new player'
              appearance='_basic-default'
              onClick={this.showPlayerCreatingModal}
            />
          </div>

          <div className={style.players_list}>
            {this.state.arePlayersLoading &&
              <Preloader isFullScreen={false} />
            }

            {Object.keys(this.state.players).map((item, index) => <div key={item} className={style.group}>
              <h3>{item}</h3>
              <div className={style.group_players}>
                {Object.values(this.state.players)[index].map(element => <div
                  key={element._id}
                  onClick={() => this.playerClickHandler(element)}
                  className={cx(style.player, { [style.selected]: findIndex(this.state.chosenPlayers, { _id: element._id }) !== -1 })}
                >
                  {element.name}
                </div>)
                }
              </div>
            </div>)}
          </div>

        </Modal>
        }

        {this.state.isPlayerCreating && <Modal
          title={'Create new player'}
          wrapClassName={style.create_player_modal}
          close={this.closePlayerCreatingModal}
          actions={[{
            text: 'Add player',
            onClick: this.submitPlayerCreatingForm,
            isDanger: true
          }]}
        >

          {this.state.isChampionModalLoading &&
            <Preloader isFullScreen={false} />
          }

          <div className={style.inputs}>
            <Input
              label={i18n.t('champion_name')}
              name="name"
              value={this.state.championData.name || ''}
              onChange={this.handleChampionInputChange}
            />
            <Input
              label={i18n.t('champion_photo')}
              name="photo"
              value={this.state.championData.photo || ''}
              onChange={this.handleChampionInputChange}
            />
            <Input
              label={i18n.t('champion_position')}
              name="position"
              value={this.state.championData.position || ''}
              onChange={this.handleChampionInputChange}
            />
          </div>
        </Modal>
        }
      </div>
    );
  }
}

export default PlayersStep;