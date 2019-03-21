import React, { Component } from 'react';

import http from 'services/httpService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import Input from 'components/input';
import Button from 'components/button';
import Preloader from 'components/preloader';

import moment from 'moment';
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
    isLoading: false,
  };

  addChampionInit = () => {
    this.setState({ isChampionCreating: true });
  }

  editChampionInit = (playerId) => {
    const player = this.state.players.filter(player => player._id === playerId)[0];

    this.setState({
      isChampionEditing: true,
      championData: {
        ...this.state.championData,
        ...player,
      }
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
      })
    });

    const { players } = await this.adminService.getAllChampions();

    this.setState({
      isLoading: false,
      isChampionEditing: false,
      players,
    }, () => this.notificationService.show('Champion was successfully updated!'));
  }

  addChampionSubmit = async () => {
    const { championData } = this.state;

    if(!championData.name){
      await this.notificationService.show('Please, write champion name')
      
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
      })
    });

    const { players } = await this.adminService.getAllChampions();

    this.setState({
      players,
      isLoading: false,
      isChampionCreating: false,
      championData: {
        name: '',
        photo: '',
      }
    }, () => this.notificationService.show('Champion was successfully created!'));
  }

  deleteChampion = async() => {
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
      championData: {
        name: '',
        photo: '',
      }
    }, () => this.notificationService.show('Champion was successfully deleted!'));
  }

  resetChampion = () => this.setState({
    isChampionCreating: false,
    isChampionEditing: false,
    championData: {}
  });

  handleInputChange = (event) => {
    this.setState({
      championData: {
        ...this.state.championData,
        [event.target.name]: event.target.value,
      }
    });
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { players } = await this.adminService.getAllChampions();

    this.setState({
      players,
      isLoading: false,
    });
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const playerId = item._id

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
      isLoading,
    } = this.state;

    const modalTitle = isChampionEditing ? `Editing ${championData.name}` : `Add new champion`;
    const isChampionModalActive = isChampionEditing || isChampionCreating;

    const modalActions = isChampionEditing
    ? [{
        text: 'Delete champion',
        onClick: this.deleteChampion,
        isDanger: true,
      },{
        text: 'Update champion',
        onClick: this.editChampionSubmit,
        isDanger: false,
      },]
    : [{
        text: 'Add champion',
        onClick: this.addChampionSubmit,
        isDanger: false,
    },];

    return <div className={style.champions}>

      <div className={style.champions_controls}>
        <Button
          appearance="_basic-accent"
          text="Add champion"
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
        emptyMessage={"There's no champions yet"}
      />

      {isChampionModalActive &&
        <Modal
          title={modalTitle}
          close={this.resetChampion}
          actions={modalActions}
        >

          {isLoading && <Preloader />}

          <Input
            label="Champion name"
            name="name"
            value={championData.name || ''}
            onChange={this.handleInputChange}
          />
          <Input
            label="Champion photo"
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