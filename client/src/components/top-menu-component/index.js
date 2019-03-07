import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import AuthService from '../../services/authService';
import UserService from '../../services/userService';
import TransactionService from '../../services/transactionService';

import { ReactComponent as AvatarPlaceholder } from '../../assets/avatar-placeholder.svg';
import AuthWrapper from '../authWrapper';
import DropDown from '../dropdown';
import style from './style.module.css';

class TopMenuComponent extends Component {
  constructor() {
    super();

    this.Auth = new AuthService();
    this.UserService = new UserService({
      onUpdate: () => this.updateProfile(),
    });

    this.TransactionService = new TransactionService({
      onUpdate: () => this.updateProfile(),
    });

    this.state = {
      profile: {
        user: {},
      },
    };
  }

  handleLogout = () => {
    this.Auth.logout();
    this.props.history.replace('/');
  }

  updateProfile = async() => {
    let profile = await this.UserService.getMyProfile();
    this.setState({ profile });
  }

  deposit = async(event) => {
    event.preventDefault();
    await this.TransactionService.deposit();
  }
  
  withdraw = async(event) => {
    event.preventDefault();
    await this.TransactionService.withdraw();
  }
  
  componentDidMount = () => {
    this.updateProfile();
  }

  render() {
    const Avatar = () => this.props.avatar ?
      <img src={this.props.avatar} alt="userpic"/> :
      <AvatarPlaceholder />;

    const BalancePlaceholder = () => `$${this.state.profile.user.balance}`;
    const UserPlaceholder = () => <Fragment>
      <Avatar />
      {this.state.profile.user.username}
    </Fragment>;

    return (
      <div className={style.top_menu}>
        <div className={style.menu_wrap}>
          <div className={style.links}>
            <NavLink to="/tournaments">
              <h2>Pick.gg</h2>
            </NavLink>

            <NavLink to="/rating">Rating</NavLink>
          </div>

          <DropDown placeholder={<BalancePlaceholder />}>
            <NavLink to="/transactions">Transactions</NavLink>

            <a href="/" onClick={event => this.deposit(event)}>Deposit</a>
            <a href="/" onClick={event => this.withdraw(event)}>Withdraw</a>
          </DropDown>

          <DropDown placeholder={<UserPlaceholder />}>
            <NavLink to="/mytournaments">My tournaments</NavLink>
            <NavLink to={`/user/${this.props.user._id}`}>Public profile</NavLink>
            <NavLink to="/profile">Profile settings</NavLink>
            <a href="/" onClick={this.handleLogout}>Log out</a>
          </DropDown>
        </div>
      </div>
    );
  }
}

export default AuthWrapper(TopMenuComponent);
