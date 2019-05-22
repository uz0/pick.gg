import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import io from 'socket.io-client';
import { GoogleLogout } from 'react-google-login';
import config from 'config';

import AuthService from 'services/authService';
import NotificationService from 'services/notificationService';
import UserService from 'services/userService';
import StreamerService from 'services/streamerService';

import DropDown from 'components/dropdown';
import UserBox from './userbox';
import NotificationBell from 'components/notification/notification-bell';

import style from './style.module.css';
import classnames from 'classnames/bind';

import i18n from 'i18n';
import ym from 'react-yandex-metrika';

const cx = classnames.bind(style);

class TopMenuComponent extends Component {
  constructor() {
    super();

    this.authService = new AuthService();
    this.notificationService = new NotificationService();
    this.userService = new UserService({
      onUpdate: () => this.updateProfile(),
    });
    this.streamerService = new StreamerService({
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

      ym('reachGoal', 'user_logged_out');
    } catch (error) {
      console.log(error);
    }
  }

  updateProfile = async () => {
    let profile = await this.userService.getMyProfile();

    if(profile.success === false){
      profile = null;
    }

    this.setState({
      profile,
      isLoading: false,
    });
  }

  componentDidMount = () => {
    this.updateProfile();

    this.socket = io();

    this.socket.on('fantasyTournamentCreated', ({ newTournamentPopulated }) => {
      this.notificationService.showSingleNotification({
        type: 'match',
        shouldBeAddedToSidebar: false,
        link: `tournaments/${newTournamentPopulated._id}`,
        message: `New fantasy tournament with name ${newTournamentPopulated.name} was created`,
      });
    });

    this.socket.on('fantasyTournamentFinalized', ({ tournamentId, participants, winner, prize }) => {
      const currentUser = this.state.profile.user.username;

      if (!participants.includes(currentUser)) {
        return;
      }

      if (winner === currentUser) {
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

  //   this.socket.on('matchUpdated', ({ updatedMatch }) => {
  //     if (!this.state.profile) {
  //       return;
  //     }

  //     this.notificationService.showSingleNotification({
  //       type: 'match',
  //       link: `/tournaments/${updatedMatch.tournament_id}`,
  //       shouldBeAddedToSidebar: true,
  //       message: i18n.t('match_status_changed'),
  //     });
  //   });
  }

  render() {
    const { profile } = this.state;

    const isStreamer = profile && profile.user && profile.user.isStreamer;
    const userpic = profile && profile.user && profile.user.photo;
    const username = profile && profile.user && profile.user.username;
    const role = isStreamer && 'userbox_role_streamer';

    return (
      <div className={style.top_menu}>
        <div className={style.menu_wrap}>
          <div className={style.links}>
            <NavLink to="/">
              <h2 className={style.logo}>Pick.gg</h2>
            </NavLink>

            <NavLink className={style.mobile_hidden} to="/tournaments">{i18n.t('tournaments')}</NavLink>
          </div>

          {profile && profile.user && <Fragment>

            <NotificationBell />

            <DropDown
              className={style.mobile_hidden}
              placeholder={<UserBox
                userpic={userpic}
                username={username}
                role={role}
                isLoading={this.state.isLoading}
              />}
            >
              {profile && profile.user && profile.user.isAdmin &&
                <NavLink to="/dashboard/tournaments">
                  <i className="material-icons">dashboard</i>
                  {i18n.t('dashboard')}
                </NavLink>
              }

              <NavLink to="/rewards">
                <i className="material-icons">attach_money</i>
                {i18n.t('my_awards')}
              </NavLink>

              <NavLink to="/mytournaments">
                <i className="material-icons">assignment</i>
                {i18n.t('my_tournaments')}
              </NavLink>

              <NavLink to={`/user/${profile.user && profile.user._id}`}>
                <i className="material-icons">person</i>
                {i18n.t('public_profile')}
              </NavLink>

              <NavLink to="/profile">
                <i className="material-icons">settings</i>
                {i18n.t('setting_profile')}
              </NavLink>

              <GoogleLogout
                clientId={config.google_client_id}
                onLogoutSuccess={this.handleLogout}
                render={renderProps => (
                  <button className={style.btn_logout} onClick={renderProps.onClick}>
                    <i className="material-icons">exit_to_app</i>
                    {i18n.t('log_out')}
                  </button>
                )}
              />
            </DropDown>

            <DropDown className={style.desktop_hidden} placeholder={<i className="material-icons">menu</i>}>
              <NavLink to="/tournaments">
                <i className="material-icons">whatshot</i>
                {i18n.t('tournaments')}
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