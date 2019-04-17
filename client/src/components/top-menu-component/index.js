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
import classnames from 'classnames/bind';
import i18n from 'i18n';

const cx = classnames.bind(style);

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

    this.socket.on("fantasyTournamentFinalized", ({ tournamentId, participants, winner, prize }) => {
      const currentUser = this.state.profile.user.username;

      if (!participants.includes(currentUser)){
        return;
      }

      if (winner === currentUser){
        const balance = this.state.profile.user.balance + prize;

        this.setState({
          profile: {
            user: {
              ...this.state.profile.user,
              balance,
            },
          },
        });

        this.notificationService.show(i18n.t('fantasy_tournament_is_over_winner'), `/tournaments/${tournamentId}`, this.props.history);

        return;
      }

      this.notificationService.show(i18n.t('fantasy_tournament_is_over'), `/tournaments/${tournamentId}`, this.props.history);
    });

    this.socket.on("matchUpdated", () => {
      this.notificationService.show(i18n.t('match_status_changed'));
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
    const isMenuIcon = window.innerWidth < 480 ? <i className={cx('material-icons', style.icon_menu)}>expand_more</i> : this.state.profile.user.username;
    const BalancePlaceholder = () => `$${this.state.profile.user.balance}`;
    const UserPlaceholder = () => <Fragment>
      <Avatar />
      <span>{isMenuIcon}</span>
    </Fragment>;

    return (
      <div className={style.top_menu}>
        <div className={style.menu_wrap}>
          <div className={style.links}>
            <NavLink to="/">
              <h2 className={style.desktop_logo}>Pick.gg</h2>
              <h2 className={style.mobile_logo}>P</h2>
            </NavLink>

            <NavLink to="/rating">{i18n.t('tournaments')}</NavLink>
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
