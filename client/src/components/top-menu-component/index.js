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
import NotificationBell from '../notification/notification-bell';
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
      profile: null,
      isLoading: true,
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
    const profile = await this.userService.getMyProfile();
    this.setState({
      profile,
      isLoading: false
    });
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

    this.socket.on("fantasyTournamentCreated", ({ newTournamentPopulated }) => {
      this.notificationService.showSingleNotification({
        type: 'match',
        shouldBeAddedToSidebar: false,
        link: `tournaments/${newTournamentPopulated._id}`,
        message: `New fantasy tournament with name ${newTournamentPopulated.name} was created`,
      });
    });

    this.socket.on("fantasyTournamentFinalized", ({ tournamentId, participants, winner, prize }) => {
      const currentUser = this.state.profile.user.username;

      if (!participants.includes(currentUser)) {
        return;
      }

      if (winner === currentUser) {
        const balance = this.state.profile.user.balance + prize;

        this.setState({
          profile: {
            user: {
              ...this.state.profile.user,
              balance,
            },
          },
        });

        this.notificationService.showSingleNotification({
          type: 'winning',
          shouldBeAddedToSidebar: true,
          link: `tournaments/${tournamentId}`,
          message: i18n.t('fantasy_tournament_is_over_winner'),
        });

        return;
      }

      this.notificationService.showSingleNotification({
        type: 'match',
        shouldBeAddedToSidebar: true,
        link: `tournaments/${tournamentId}`,
        message: i18n.t('fantasy_tournament_is_over'),
      });
    });

    this.socket.on("matchUpdated", () => {
      const path = this.props.history.location.pathname;

      if (path !== '/dashboard/tournaments') {
        this.notificationService.showSingleNotification({
          type: 'match',
          shouldBeAddedToSidebar: true,
          message: i18n.t('match_status_changed'),
        });
      }
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
    const { profile } = this.state;
    console.log(profile);
    const Avatar = () => profile && profile.user && profile.user.photo ?
      <img className={style.avatar_circle} src={profile.user.photo} alt="userpic" /> :
      <AvatarPlaceholder />;
    const isMenuIcon = window.innerWidth < 480 ? <i className={cx('material-icons', style.icon_menu)}>expand_more</i> : <span className={cx({ [style.is_loading]: this.state.isLoading })}>{profile && profile.user && profile.user.username}</span>;
    const BalancePlaceholder = () => <span className={cx(style.balance, { [style.is_loading]: this.state.isLoading })}>${profile && profile.user && profile.user.balance}</span>;
    const UserPlaceholder = () => <Fragment>
      <Avatar />
      <span>{isMenuIcon}</span>
    </Fragment>;

    return (
      <div className={style.top_menu}>
        <div className={style.menu_wrap}>
          <div className={style.links}>
            <NavLink to="/">
              <h2 className={style.logo}>Pick.gg</h2>
            </NavLink>

            <NavLink className={style.mobile_hidden} to="/tournaments">{i18n.t('tournaments')}</NavLink>
            <NavLink className={style.mobile_hidden} to="/rating">{i18n.t('rating')}</NavLink>
          </div>

          {profile && profile.user && <Fragment>

          <DropDown className={style.mobile_hidden} placeholder={<BalancePlaceholder />}>
            <NavLink to="/transactions"><i className="material-icons">swap_horiz</i>{i18n.t('transactions')}</NavLink>

            <a href="/" className={style.disabled} onClick={event => this.deposit(event)}><i className="material-icons">add_circle</i>{i18n.t('deposit')}</a>
            <a href="/" className={style.disabled} onClick={event => this.withdraw(event)}><i className="material-icons">remove_circle</i>{i18n.t('withdraw')}</a>
          </DropDown>

          <NotificationBell />

          <DropDown className={style.mobile_hidden} placeholder={<UserPlaceholder />}>
            {profile && profile.user && profile.user.isAdmin &&
              <NavLink to="/dashboard/tournaments">
                <i className="material-icons">dashboard</i>
                {i18n.t('dashboard')}
              </NavLink>
            }

            <NavLink to="/mytournaments">
              <i className="material-icons">assignment</i>
              {i18n.t('my_tournaments')}
            </NavLink>

            <NavLink to={`/user/${this.props.user && this.props.user._id}`}>
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

          <DropDown className={style.desktop_hidden} placeholder={<i className="material-icons">menu</i>}>
            <div className={style.item}>
              <i className="material-icons">account_balance_wallet</i>
              {`$${profile && profile.user && profile.user.balance}`}
            </div>

            <NavLink to="/tournaments">
              <i className="material-icons">whatshot</i>
              {i18n.t('tournaments')}
            </NavLink>

            <NavLink to="/rating">
              <i className="material-icons">assessment</i>
              {i18n.t('rating')}
            </NavLink>

            <NavLink to="/transactions">
              <i className="material-icons">attach_money</i>
              {i18n.t('transactions')}
            </NavLink>

            <NavLink to="/dashboard/tournaments">
              <i className="material-icons">dashboard</i>
              {i18n.t('dashboard')}
            </NavLink>

            <NavLink to="/mytournaments">
              <i className="material-icons">assignment</i>
              {i18n.t('my_tournaments')}
            </NavLink>

            <NavLink to={`/user/${this.props.user && this.props.user._id}`}>
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
          </Fragment>
          }
        
        </div>
      </div>
    );
  }
}

export default TopMenuComponent;
// export default AuthWrapper(TopMenuComponent);
