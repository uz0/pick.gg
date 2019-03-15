import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import AuthService from '../../services/authService';
import UserService from '../../services/userService';
import TransactionService from '../../services/transactionService';

import { ReactComponent as AvatarPlaceholder } from '../../assets/avatar-placeholder.svg';
import AuthWrapper from '../authWrapper';
import DropDown from '../dropdown';
import style from './style.module.css';
import i18n from 'i18n';

class TopMenuComponent extends Component {
  constructor() {
    super();

    this.authService = new AuthService();
    this.userService = new UserService({
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
    this.authService.logout();
    this.props.history.replace('/');
  }

  updateProfile = async() => {
    let profile = await this.userService.getMyProfile();
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

            <NavLink to="/rating">{i18n.t('rating')}</NavLink>
          </div>

          <DropDown placeholder={<BalancePlaceholder />}>
            <NavLink to="/transactions">{i18n.t('transactions')}</NavLink>

            <a href="/" onClick={event => this.deposit(event)}>{i18n.t('deposit')}</a>
            <a href="/" onClick={event => this.withdraw(event)}>{i18n.t('withdraw')}</a>
          </DropDown>

          <DropDown placeholder={<UserPlaceholder />}>
            <NavLink to="/mytournaments">{i18n.t('my_tournaments')}</NavLink>
            <NavLink to={`/user/${this.props.user._id}`}>{i18n.t('public_profile')}</NavLink>
            <NavLink to="/profile">{i18n.t('setting_profile')}</NavLink>
            <a href="/" onClick={this.handleLogout}>{i18n.t('log_out')}</a>
          </DropDown>
        </div>
      </div>
    );
  }
}

export default AuthWrapper(TopMenuComponent);
