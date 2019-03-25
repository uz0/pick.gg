import React, { Component } from 'react';

import http from 'services/httpService';
import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import Input from 'components/input';
import Preloader from 'components/preloader';

import i18n from 'i18n';

import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const usersTableCaptions = {
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
    users: [],
    isUserEditing: false,
    isLoading: false,
  };

  editUserInit = (userId) => {
    const user = this.state.users.filter(user => user._id === userId)[0];

    console.log(this.state);
    this.setState({
      isUserEditing: true,
      userEditingData: {
        ...this.state.userEditingData,
        ...user,
      },
    });
  }

  editUserSubmit = async () => {
    this.setState({ isLoading: true });

    console.log(this.state.userEditingData);
    const userId = this.state.userEditingData._id;

    await http(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.userEditingData,
      }),
    });

    const { users } = await this.adminService.getAllUsers();

    this.setState({
      isLoading: false,
      isUserEditing: false,
      users,
    }, () => this.notificationService.show('User was successfully updated!'));
  }

  resetUser = () => this.setState({
    isUserEditing: false,
    userEditingData: {},
  });

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      userEditingData: {
        ...this.state.userEditingData,
        [name]: value,
      },
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
      <div className={itemClass} style={{ '--width': usersTableCaptions.username.width }}>
        <span className={textClass}>{item.username}</span>
      </div>

      <div className={itemClass} style={{ '--width': usersTableCaptions.balance.width }}>
        <span className={textClass}>{item.balance}</span>
      </div>

      <div className={itemClass} style={{ '--width': usersTableCaptions.isAdmin.width }}>
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

    console.log(userEditingData.isAdmin);

    return <div className={style.users}>

      <Table
        captions={usersTableCaptions}
        items={users}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={isLoading}
        emptyMessage={i18n.t('there_is_no_tournaments_yet')}
      />

      {isUserEditing &&
        <Modal
          title={`Editing ${userEditingData.username}`}
          actions={[{
            text: 'Update user',
            onClick: this.editUserSubmit,
            isDanger: false,
          }]}
          close={this.resetUser}
        >

          {isLoading && <Preloader />}

          <Input
            label="Username"
            name="username"
            value={userEditingData.username || ''}
            onChange={this.handleInputChange}
          />

          <Input
            label="Balance"
            name="balance"
            value={userEditingData.balance || ''}
            onChange={this.handleInputChange}
          />

          <label className={style.chebox}>
            <p>Admin</p>
            <input
              label="Admin"
              className={style.css_checkbox}
              name="isAdmin"
              type="checkbox"
              defaultChecked={userEditingData.isAdmin}
              onChange={this.handleInputChange}
            />
          </label>
        </Modal>
      }
    </div>;
  }
}

export default Users;