import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import AuthService from 'services/authService';
import NotificationService from 'services/notificationService';
import UserService from 'services/userService';
import TransactionService from 'services/transactionService';
import TournamentService from 'services/tournamentService';

import io from "socket.io-client";

import config from 'config';
import { GoogleLogout } from 'react-google-login';

import { ReactComponent as AvatarPlaceholder } from 'assets/avatar-placeholder.svg';
import AuthWrapper from '../authWrapper';
import DropDown from '../dropdown';
import style from './style.module.css';
import i18n from 'i18n';

class TopMenuComponent extends Component {
  constructor() {
    super();

    this.authService = new AuthService();
    this.notificationService = new NotificationService();
    this.userService = new UserService({
      onUpdate: () => this.updateProfile(),
    });

    this.TransactionService = new TransactionService({
      onUpdate: () => this.updateProfile(),
    });
    
    this.TournamentService = new TournamentService({
      onUpdate: () => this.updateProfile(),
    });

    this.state = {
      profile: {
        user: {},
      },
    };
  }

  handleLogout = async () => {
    try {
      await this.authService.logout();
      this.props.history.push('/');
    } catch (error) {
      console.log(error);
    }
  }

  updateProfile = async () => {
    let profile = await this.userService.getMyProfile();
    this.setState({ profile });
  }

  // deposit = async(event) => {
  //   event.preventDefault();
  //   await this.TransactionService.deposit();
  // }

  // withdraw = async(event) => {
  //   event.preventDefault();
  //   await this.TransactionService.withdraw();
  // }

  componentDidMount = () => {
    this.socket = io();

    this.socket.on("fantasyTournamentCreated", ({newTournamentPopulated}) => {
      this.notificationService.show(`New fantasy tournament with name ${newTournamentPopulated.name} was created`);
    });

    // this.socket.on("fantasyTournamentEntryPaid", ({ entry }) => {
    //   const newBalance = this.state.profile.user.balance - entry;

    //   this.setState({
    //     profile: {
    //       user: {
    //         ...this.state.profile.user,
    //         balance: newBalance,
    //       }
    //     }
    //   })
    // });

    this.updateProfile();
  }

  render() {
    const Avatar = () => this.state.profile.user.photo ?
      <img className={style.avatar_circle} src={this.state.profile.user.photo} alt="userpic" /> :
      <AvatarPlaceholder />;

    const BalancePlaceholder = () => `$${this.state.profile.user.balance}`;
    const UserPlaceholder = () => <Fragment>
      <Avatar />
      <span>{this.state.profile.user.username}</span>
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
            <NavLink to="/transactions"><i className="material-icons">swap_horiz</i>{i18n.t('transactions')}</NavLink>

            <a href="/" className={style.disabled} onClick={event => this.deposit(event)}><i className="material-icons">add_circle</i>{i18n.t('deposit')}</a>
            <a href="/" className={style.disabled} onClick={event => this.withdraw(event)}><i className="material-icons">remove_circle</i>{i18n.t('withdraw')}</a>
          </DropDown>

          <DropDown placeholder={<UserPlaceholder />}>
            {this.state.profile.user.isAdmin &&
              <NavLink to="/dashboard/tournaments">
                <i className="material-icons">dashboard</i>
                {i18n.t('dashboard')}
              </NavLink>
            }

            <NavLink to="/mytournaments">
              <i className="material-icons">assignment</i>
              {i18n.t('my_tournaments')}
            </NavLink>

            <NavLink to={`/user/${this.props.user._id}`}>
              <i className="material-icons">person</i>
              {i18n.t('public_profile')}
            </NavLink>

            <NavLink to="/profile">
              <i className="material-icons">settings</i>
              {i18n.t('setting_profile')}
            </NavLink>

            <GoogleLogout
              buttonText="Logout"
              clientId={config.google_client_id}
              onLogoutSuccess={this.handleLogout}
              render={renderProps => (
                <button className={style.btn_logout} {...renderProps}>
                  <i className="material-icons">exit_to_app</i>
                  {i18n.t('log_out')}
                </button>
              )}
            />
          </DropDown>
        </div>
      </div>
    );
  }
}

export default AuthWrapper(TopMenuComponent);
