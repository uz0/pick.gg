import React, { Component } from 'react';

import http from 'services/httpService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import ModalAsk from 'components/modal';
import Input from 'components/input';
import Button from 'components/button';
import Preloader from 'components/preloader';

import i18n from 'i18n';

import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const championsTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: 250,
  },
};

class Champions extends Component {
  constructor(props) {
    super(props);
    this.notificationService = new NotificationService();
    this.adminService = new AdminService();
  }

  state = {
    championData: {
      name: '',
      photo: '',
    },
    players: [],
    isChampionEditing: false,
    isChampionCreating: false,
    isChampionDelete: false,
    isLoading: false,
  };

  addChampionInit = () => {
    this.setState({ isChampionCreating: true });
  }

  delChampion = () => this.setState({ isChampionDelete: true })

  editChampionInit = (playerId) => {
    const player = this.state.players.filter(player => player._id === playerId)[0];

    this.setState({
      isChampionEditing: true,
      championData: {
        ...this.state.championData,
        ...player,
      },
    });
  }

  editChampionSubmit = async () => {
    this.setState({ isLoading: true });

    const editedPlayerId = this.state.championData._id;

    await http(`/api/admin/players/${editedPlayerId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player: this.state.championData,
      }),
    });

    const { players } = await this.adminService.getAllChampions();

    this.setState({
      isLoading: false,
      isChampionEditing: false,
      players,
    }, () => this.notificationService.show(i18n.t('champion_updated')));
  }

  addChampionSubmit = async () => {
    const { championData } = this.state;

    if (!championData.name) {
      await this.notificationService.show(i18n.t('please_champion_name'));

      return;
    }

    this.setState({ isLoading: true });

    await http('/api/admin/players', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player: this.state.championData,
      }),
    });

    const { players } = await this.adminService.getAllChampions();

    this.setState({
      players,
      isLoading: false,
      isChampionCreating: false,
      championData: {
        name: '',
        photo: '',
      },
    }, () => this.notificationService.show(i18n.t('champion_created')));
  }

  deleteChampion = async () => {
    this.setState({ isLoading: true });

    const editedPlayerId = this.state.championData._id;

    await http(`/api/admin/players/${editedPlayerId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const { players } = await this.adminService.getAllChampions();

    this.setState({
      players,
      isLoading: false,
      isChampionEditing: false,
      isChampionDelete: false,
      championData: {
        name: '',
        photo: '',
      },
    }, () => this.notificationService.show(i18n.t('champion_deleted')));
  }
  
  closeDeleteChampion = () => this.setState({ isChampionDelete: false });

  resetChampion = () => this.setState({
    isChampionCreating: false,
    isChampionEditing: false,
    championData: {},
  });

  handleInputChange = (event) => {
    this.setState({
      championData: {
        ...this.state.championData,
        [event.target.name]: event.target.value,
      },
    });
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { players } = await this.adminService.getAllChampions();
    const sortedPlayers = players.sort((prev, next) => prev.name.localeCompare(next.name));

    this.setState({
      players: sortedPlayers,
      isLoading: false,
    });
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const playerId = item._id;

    return <div onClick={() => this.editChampionInit(playerId)} className={cx(className, style.tournament_row)} key={item._id}>
      <div className={itemClass} style={{ '--width': championsTableCaptions.name.width }}>
        <span className={textClass}>{item.name}</span>
      </div>
    </div>;
  }

  render() {
    const {
      players,
      championData,
      isChampionEditing,
      isChampionCreating,
      isChampionDelete,
      isLoading,
    } = this.state;

    const modalTitle = isChampionEditing ? `${i18n.t('editing')} ${championData.name}` : i18n('add_new_champion');
    const isChampionModalActive = isChampionEditing || isChampionCreating;
    let modalActions = [];

    if (!isChampionEditing) {
      modalActions.push(
        { text: i18n.t('add_champion'), onClick: this.addChampionSubmit, isDanger: false },
      );
    }

    if (isChampionEditing) {
      modalActions.push(
        { text: i18n.t('delete_champion'), onClick: this.delChampion, isDanger: true },
        { text: i18n.t('update_champion'), onClick: this.editChampionSubmit, isDanger: false},
      );
    }

    return <div className={style.champions}>

      <div className={style.champions_controls}>
        <Button
          appearance="_basic-accent"
          text={i18n.t('add_champion')}
          onClick={this.addChampionInit}
          className={style.button}
        />
      </div>

      <Table
        captions={championsTableCaptions}
        items={players}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={isLoading}
        emptyMessage={i18n.t('no_champions')}
      />

      {isChampionModalActive &&
        <Modal
          title={modalTitle}
          close={this.resetChampion}
          actions={modalActions}
        >

          {isLoading && <Preloader />}

          {isChampionDelete && <ModalAsk
            textModal={i18n.t('want_remove_champion')}
            submitClick={this.deleteChampion}
            closeModal={this.closeDeleteChampion} />}

          <Input
            label={i18n.t('champion_name')}
            name="id"
            value={championData.id || ''}
            onChange={this.handleInputChange}
            disabled
          />
          <Input
            label={i18n.t('champion_photo')}
            name="photo"
            value={championData.photo || ''}
            onChange={this.handleInputChange}
          />
        </Modal>
      }
    </div>;
  }
}

export default Champions;