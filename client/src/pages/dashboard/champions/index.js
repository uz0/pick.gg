import React, { Component } from 'react';

import http from 'services/httpService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import Input from 'components/input';
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
    championEditingData: {
      name: '',
    },
    players: [],
    isChampionEditing: false,
    isLoading: false,
  };

  editChampionInit = (playerId) => {
    const player = this.state.players.filter(player => player._id === playerId)[0];

    this.setState({
      isChampionEditing: true,
      championEditingData: {
        ...this.state.championEditingData,
        ...player,
      }
    });
  }

  editChampionSubmit = async () => {
    this.setState({ isLoading: true });

    await http('/api/admin/champions', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player: this.state.championEditingData,
      })
    });

    const { players } = await this.adminService.getAllChampions();

    this.setState({
      isLoading: false,
      players,
    }, () => this.notificationService.show('Champion was successfully updated!'));
  }

  resetChampionEditing = () => this.setState({
    isChampionEditing: false,
    championEditingData: {}
  });

  handleInputChange = (event) => {
    const inputValue = event.target.name === 'date' ? moment(event.target.value).format() : event.target.value;
    this.setState({
      championEditingData: {
        ...this.state.championEditingData,
        [event.target.name]: inputValue,
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
      championEditingData,
      isChampionEditing,
      isLoading,
    } = this.state;

    console.log(players);

    const modalTitle = `Editing ${championEditingData.name}`;

    return <div className={style.tournaments}>
      <Table
        captions={championsTableCaptions}
        items={players}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={isLoading}
        emptyMessage={i18n.t('there_is_no_tournaments_yet')}
      />

      {isChampionEditing &&
        <Modal
          title={modalTitle}
          close={this.resetChampionEditing}
          actions={[{
            text: 'Update Champion',
            onClick: this.editChampionSubmit,
            isDanger: false,
          }]}
        >

          {isLoading && <Preloader />}

          <Input
            label="Champion name"
            name="name"
            value={championEditingData.name || ''}
            onChange={this.handleInputChange}
          />
        </Modal>
      }
    </div>;
  }
}

export default Champions;