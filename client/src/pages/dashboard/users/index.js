import React, { Component } from 'react';

import http from 'services/httpService';
import TournamentService from 'services/tournamentService';
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

const tournamentsTableCaptions = {
  username: {
    text: i18n.t('name'),
    width: 250,
  },

  balance: {
    text: i18n.t('balance'),
    width: 100,
  },

  isAdmin: {
    text: i18n.t('admin'),
    width: 100,
  },
};

class Users extends Component {
  constructor(props) {
    super(props);
    this.tournamentService = new TournamentService();
    this.notificationService = new NotificationService();
    this.adminService = new AdminService();
  }

  state = {
    tournaments: [],
    userEditingData: {
      username: '',
      balance: '',
      isAdmin: '',
    },
    players: [],
    users: [],
    editingMatchId: '',
    selectedChampion: '',
    isUserEditing: false,
    isLoading: false,
  };

  editUserInit = (userId) => {

    const user = this.state.users.filter(user => user._id === userId)[0];
    console.log(user)
    this.setState({
      isUserEditing: true,
      userEditingData: {
        ...this.state.userEditingData,
        ...user,
      }
    });
  }

  editTournamentSubmit = async () => {
    this.setState({ isLoading: true });

    await http('/api/admin/users', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.userEditingData,
      })
    });

    const { users } = await this.adminService.getAllUsers();

    this.setState({
      isLoading: false,
      users,
    }, () => this.notificationService.show('User was successfully updated!'));
  }

  resetUserEditing = () => this.setState({
    isUserEditing: false,
    userEditingData: {}
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
    const { users } = await this.adminService.getAllUsers();

    this.setState({
      users,
      isLoading: false,
    });
  }

  renderRow = ({ className, itemClass, textClass, item }) => {

    const isAdmin = item.isAdmin ? 'Yes' : 'No';
    const userId = item._id;

    return <div onClick={() => this.editUserInit(userId)} className={cx(className, style.tournament_row)} key={item._id}>
      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.username.width }}>
        <span className={textClass}>{item.username}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.balance.width }}>
        <span className={textClass}>{item.balance}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.isAdmin.width }}>
        <span className={textClass}>{isAdmin}</span>
      </div>
    </div>;
  }

  render() {
    const {
      users,
      userEditingData,
      isUserEditing,
      isLoading,
    } = this.state;

    console.log(this.state);

    const modalTitle = `Editing ${userEditingData.username}`;

    return <div className={style.tournaments}>
      <Table
        captions={tournamentsTableCaptions}
        items={users}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={isLoading}
        emptyMessage={i18n.t('there_is_no_tournaments_yet')}
      />

      {isUserEditing &&
        <Modal
          title={modalTitle}
          close={this.resetUserEditing}
          actions={[{
            text: 'Update user',
            onClick: this.editUserSubmit,
            isDanger: false,
          }]}
        >

          {isLoading && <Preloader />}

          <Input
            label="Username"
            name="name"
            value={userEditingData.username || ''}
            onChange={this.handleChange}
          />

          <Input
            label="Balance"
            name="name"
            value={userEditingData.balance || ''}
            onChange={this.handleInputChange}
          />

          <Input
            label="Admin"
            name="name"
            type="checkbox"
            value={userEditingData.isAdmin}
            onChange={this.handleInputChange}
          />
        </Modal>
      }
    </div>;
  }
}

export default Users;