import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { GoogleLogout } from 'react-google-login';
import config from 'config';

import DropDown from 'components/dropdown';
import UserBox from './userbox';

import style from './style.module.css';

import i18n from 'i18n';
import ym from 'react-yandex-metrika';

class TopMenuComponent extends Component {
  state = {
    profile: null,
    isLoading: true,
  };

  handleLogout = async () => {
    try {
      this.props.history.push('/');

      ym('reachGoal', 'user_logged_out');
    } catch (error) {
      console.log(error);
    }
  }

  updateProfile = async () => {
    this.setState({
      isLoading: false,
    });
  }

  componentDidMount = () => {
    this.updateProfile();
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
            <NavLink to="/home">
              <h2 className={style.logo}>Pick.gg</h2>
            </NavLink>

            <NavLink className={style.mobile_hidden} to="/tournaments">{i18n.t('tournaments')}</NavLink>
            <NavLink className={style.mobile_hidden} to="/rating">{i18n.t('rating')}</NavLink>
          </div>

          {profile && profile.user && (
            <>
              <DropDown
                className={style.mobile_hidden}
                placeholder={(
                  <UserBox
                    userpic={userpic}
                    username={username}
                    role={role}
                    isLoading={this.state.isLoading}
                  />
                )}
              >
                {profile && profile.user && profile.user.isAdmin && (
                  <NavLink to="/dashboard/tournaments">
                    <i className="material-icons">dashboard</i>
                    {i18n.t('dashboard')}
                  </NavLink>
                )}

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
                  clientId={config.googleClientId}
                  render={renderProperties => (
                    <button type="button" className={style.btn_logout} onClick={renderProperties.onClick}>
                      <i className="material-icons">exit_to_app</i>
                      {i18n.t('log_out')}
                    </button>
                  )}
                  onLogoutSuccess={this.handleLogout}
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
                  clientId={config.googleClientId}
                  render={renderProperties => (
                    <button type="button" className={style.btn_logout} {...renderProperties}>
                      <i className="material-icons">exit_to_app</i>
                      {i18n.t('log_out')}
                    </button>
                  )}
                  onLogoutSuccess={this.handleLogout}
                />
              </DropDown>
            </>
          )
          }

        </div>
      </div>
    );
  }
}

export default TopMenuComponent;
