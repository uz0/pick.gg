import React from 'react';
import { GoogleLogout } from 'react-google-login';
import ym from 'react-yandex-metrika';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { actions as storeActions } from 'store';

import config from 'config';

import DropDown from 'components/dropdown';
import UserBox from './userbox';

import style from './style.module.css';
import i18n from 'i18n';

const Header = ({ setCurrentUser, currentUser, history }) => {
  const handleLogout = () => {
    localStorage.removeItem('JWS_TOKEN');

    history.push('/');

    setCurrentUser(null);

    ym('reachGoal', 'user_logged_out');
  };

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

        {currentUser && (
          <>
            <DropDown
              className={style.mobile_hidden}
              placeholder={(
                <UserBox
                  userpic={currentUser.imageUrl}
                  username={currentUser.username}
                  isAdmin={currentUser.isAdmin}
                  canProvideTournaments={currentUser.canProvideTournaments}
                />
              )}
            >
              {currentUser.isAdmin && (
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

              <NavLink to={`/user/${currentUser._id}`}>
                <i className="material-icons">person</i>
                {i18n.t('public_profile')}
              </NavLink>

              <NavLink to="/profile">
                <i className="material-icons">settings</i>
                {i18n.t('setting_profile')}
              </NavLink>

              <GoogleLogout
                clientId={config.googleClientId}
                render={({ onClick }) => (
                  <button type="button" className={style.btn_logout} onClick={onClick}>
                    <i className="material-icons">exit_to_app</i>
                    {i18n.t('log_out')}
                  </button>
                )}
                onLogoutSuccess={handleLogout}
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

              <NavLink to={`/user/${currentUser._id}`}>
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
                onLogoutSuccess={handleLogout}
              />
            </DropDown>
          </>
        )
        }

      </div>
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    state => ({
      currentUser: state.currentUser,
    }),

    {
      setCurrentUser: storeActions.setCurrentUser,
    }
  ),
)(Header);
