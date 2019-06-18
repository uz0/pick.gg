import React, { Component } from 'react';

import http from 'services/httpService';
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
    width: window.innerWidth < 480 ? 100 : 350,
  },

  isAdmin: {
    text: i18n.t('admin'),
    width: 80,
  },
};

class Users extends Component {
  constructor(props) {
    super(props);
    this.notificationService = new NotificationService();
    this.adminService = new AdminService();
  }

  state = {
    userEditingData: {
      username: '',
      isAdmin: '',
      isStreamer: '',
    },
    users: [],
    isUserEditing: false,
    isLoading: false,
  };

  editUserInit = userId => {
    const user = this.state.users.filter(user => user._id === userId)[0];

    this.setState({
      isUserEditing: true,
      userEditingData: {
        ...user,
      },
    });
  }

  editUserSubmit = async () => {
    this.setState({ isLoading: true });

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
    }, () => this.notificationService.showSingleNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: i18n.t('user_updated'),
    }),
    );
  }

  resetUser = () => this.setState({
    isUserEditing: false,
    userEditingData: {},
  });

  handleInputChange = event => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      userEditingData: {
        [target.name]: value,
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
    const isAdmin = item.isAdmin ? i18n.t('yes') : i18n.t('no');
    const userId = item._id;

    return (
      <div key={item._id} className={cx(className, style.tournament_row)} onClick={() => this.editUserInit(userId)}>
        <div className={itemClass} style={{ '--width': usersTableCaptions.username.width }}>
          <span className={textClass}>{item.username}</span>
        </div>

        <div className={itemClass} style={{ '--width': usersTableCaptions.isAdmin.width }}>
          <span className={textClass}>{isAdmin}</span>
        </div>
      </div>
    );
  }

  render() {
    const {
      users,
      userEditingData,
      isUserEditing,
      isLoading,
    } = this.state;

    return (
      <div className={style.users}>

        <Table
          captions={usersTableCaptions}
          items={users}
          className={style.table}
          renderRow={this.renderRow}
          isLoading={isLoading}
          emptyMessage={i18n.t('there_is_no_tournaments_yet')}
        />

        {isUserEditing && (
          <Modal
            title={`Editing ${userEditingData.username}`}
            actions={[{
              text: i18n.t('update_user'),
              onClick: this.editUserSubmit,
              isDanger: false,
            }]}
            close={this.resetUser}
          >

            {isLoading && (
              <Preloader
                isFullScreen
              />
            )}

            <Input
              label={i18n.t('username')}
              name="username"
              value={userEditingData.username || ''}
              onChange={this.handleInputChange}
            />

            <label className={style.checkbox}>
              <p>{i18n.t('admin')}</p>
              <input
                className={style.input}
                name="isAdmin"
                type="checkbox"
                defaultChecked={userEditingData.isAdmin}
                onChange={this.handleInputChange}
              />
            </label>

            <label className={style.checkbox}>
              <p>{i18n.t('streamer')}</p>
              <input
                className={style.input}
                name="isStreamer"
                type="checkbox"
                defaultChecked={userEditingData.isStreamer}
                onChange={this.handleInputChange}
              />
            </label>
          </Modal>
        )}
      </div>
    );
  }
}

export default Users;