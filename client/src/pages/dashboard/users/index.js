import React, { Component } from 'react';

import http from 'services/httpService';
import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import ModalAsk from 'components/modal'
import Input from 'components/input';
import Preloader from 'components/preloader';
import Button from 'components/button';

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
    users: [],
    isUserCreating: false,
    isUserEditing: false,
    isUserDelete: false,
    isLoading: false,
  };

  addUserInit = () => {
    this.setState({ isUserCreating: true });
  }

  addUserSubmit = async () => {
    const { userEditingData } = this.state;

    if (!userEditingData.username) {
      await this.notificationService.show('Please, write user name')

      return;
    }

    this.setState({ isLoading: true });

    await http('/api/admin/users', {
      method: 'POST',
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
      users,
      isLoading: false,
      isUserCreating: false,
      userEditingData: {
        username: '',
        balance: '',
        isAdmin: '',
      }
    }, () => this.notificationService.show('User was successfully created!'));
  }

  editUserInit = (userId) => {
    const user = this.state.users.filter(user => user._id === userId)[0];
    const isAdmin = this.state.userEditingData.isAdmin
    console.log(isAdmin)
    this.setState({
      isUserEditing: true,
      userEditingData: {
        ...this.state.userEditingData,
        ...user,
      }
    });
  }

  editUserSubmit = async () => {
    this.setState({ isLoading: true });
    console.log(this.state.userEditingData)
    const userId = this.state.userEditingData._id;

    await http(`/api/admin/users/${userId}`, {
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

  resetUser = () => this.setState({
    isUserEditing: false,
    isUserCreating: false,
    userEditingData: {}
  });

  deleteUser = async () => {
    this.setState({ isLoading: true });
    console.log(this.state.userEditingData)
    const editedUserId = this.state.userEditingData._id;

    await http(`/api/admin/user/${editedUserId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const { users } = await this.adminService.getAllUsers();

    this.setState({
      users,
      isLoading: false,
      isUsersEditing: false,
      isUsersDelete: false,
      userEditingData: {
        username: '',
        balance: '',
        isAdmin: '',
      }
    }, () => this.notificationService.show('User was successfully deleted!'));
  }

  closeDeleteUser = () => this.setState({ isUserDelete: false });

  delUser = () => this.setState({ isUserDelete: true })

  handleInputChange = (event) => {
    this.setState({
      userEditingData: {
        ...this.state.userEditingData,
        [event.target.name]: event.target.value,
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
      isUserCreating,
      isUserEditing,
      isUserDelete,
      isLoading,
    } = this.state;

    console.log(this.state)
    const modalTitle = isUserEditing ? `Editing ${userEditingData.username}` : `Add new user`;
    const isUserModalActive = isUserEditing || isUserCreating;

    const modalActions = isUserEditing
      ? [{
        text: 'Update user',
        onClick: this.editUserSubmit,
        isDanger: false,
      },
      {
        text: 'Delete user',
        onClick: this.delUser,
        isDanger: true,
      },]
      : [{
        text: 'Add user',
        onClick: this.addUserSubmit,
        isDanger: false,
      },];

    return <div className={style.tournaments}>

      <div className={style.user_controls}>
        <Button
          appearance="_basic-accent"
          text="Add user"
          onClick={this.addUserInit}
          className={style.button}
        />
      </div>

      <Table
        captions={tournamentsTableCaptions}
        items={users}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={isLoading}
        emptyMessage={i18n.t('there_is_no_tournaments_yet')}
      />

      {isUserModalActive &&
        <Modal
          title={modalTitle}
          close={this.resetUser}
          actions={modalActions}
        >

          {isLoading && <Preloader />}

          {isUserDelete && <ModalAsk
            textModal={'Do you really want to remove the user?'}
            submitClick={this.deleteUser}
            closeModal={this.closeDeleteUser} />}

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

          <Input
            label="Admin"
            name="isAdmin"
            defaultValue={userEditingData.isAdmin || ''}
            onChange={this.handleInputChange}
          />
        </Modal>
      }
    </div>;
  }
}

export default Users;