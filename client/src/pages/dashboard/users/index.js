import React, { Component } from 'react';
import { http } from 'helpers';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Preloader from 'components/preloader';
import { actions as modalActions } from 'components/modal-container';
import actions from './actions';
import style from './style.module.css';

class Users extends Component {
  state = {
    isLoading: false,
  };

  loadUsers = async () => {
    this.setState({ isLoading: true });
    const response = await http('/api/admin/user');
    const { users } = await response.json();
    this.props.loadUsers(users);
    this.setState({
      isLoading: false,
    });
  };

  async componentDidMount() {
    if (!this.props.isLoading && !this.props.usersList) {
      this.loadUsers();
    }
  }

  openUserModal = (isEditing = false, user = {}) => this.props.toggleModal({
    id: 'user-modal',
    options: {
      isEditing,
      user,
    },
  });

  render() {
    return (
      <div className={style.users}>
        {this.props.usersIds.map(id => {
          const user = this.props.usersList[id];
          const { _id, username, summonerName, preferredPosition, canProvideTournaments, isAdmin } = user;

          return (
            <div
              key={_id}
              className={style.row}
              onClick={() => this.openUserModal(true, { _id, username, summonerName, preferredPosition, canProvideTournaments, isAdmin })}
            >
              {username}
            </div>
          );
        })}
        {this.state.isLoading &&
          <Preloader/>
        }
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      usersIds: state.users.ids,
      usersList: state.users.list,
      isLoaded: state.users.isLoaded,
    }),

    {
      loadUsers: actions.loadUsers,
      toggleModal: modalActions.toggleModal,
    },
  ),
)(Users);

export { default as actions } from './actions';
export { default as reducers } from './reducers';
