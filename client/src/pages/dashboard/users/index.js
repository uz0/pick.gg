import React, { Component } from 'react';

import http from 'helpers/http';
import Table from 'components/table';

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
  state = {
    userEditingData: {
      username: '',
      isAdmin: '',
      isStreamer: '',
    },
    users: [],
    isLoading: false,
  };

  editUserInit = userId => {
    const user = this.state.users.find(({ _id }) => _id === userId);

    this.setState({
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

    this.setState({
      isLoading: false,
    });
  }

  resetUser = () => this.setState({
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

    this.setState({
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
      </div>
    );
  }
}

export default Users;
