import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import style from './style.module.css';

import ym from 'react-yandex-metrika';
import i18n from 'i18next';
import config from 'config';

import NotificationContainer from 'components/old-notification/notification-container';
import Footer from 'components/footer';

import NotificationService from 'services/notificationService';

import { actions as notificationActions } from 'components/notification';
import { actions as storeActions } from 'store';
import { http, isLogged } from 'helpers';

import Lpl from 'assets/start/lpl.png';
import Lolchamp from 'assets/start/lolchamp.png';
import Lck from 'assets/start/lck.png';
import { ReactComponent as GoogleIcon } from 'assets/google-icon.svg';
import zed from 'assets/zed.mp4';

class Start extends Component {
  constructor(properties) {
    super(properties);
    this.tournamentId = new URLSearchParams(properties.location.search).get('tournamentId');
    this.notificationService = new NotificationService();
  }

  onSuccessGoogleLogin = async data => {
    const profile = data.getBasicProfile();

    const body = {
      email: profile.getEmail(),
      name: profile.getName(),
      photo: profile.getImageUrl(),
    };

    let response = await http('/api/authentication/oauth', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    response = await response.json();

    if (!response.success) {
      this.props.showNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: response.message,
      });

      return;
    }

    if (response.user) {
      this.props.setCurrentUser(response.user);
    }

    localStorage.setItem('JWS_TOKEN', response.token);
    ym('reachGoal', 'user_signed_in');
    const url = this.tournamentId ? `/tournaments/${this.tournamentId}` : '/tournaments';
    this.props.history.push(url);

    this.props.showNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: response.message,
    });
  };

  onFailureGoogleLogin = () => {
    this.props.showNotification({
      type: 'error',
      shouldBeAddedToSidebar: false,
      message: i18n.t('notifications.errors.closed_window'),
    });
  };

  render() {
    const isUserAuthenticated = isLogged();

    return (
      <div className="container">
        <div className={style.login_page}>

          <NotificationContainer/>

          <section className={style.login_section}>
            <div className={style.start_content}>
              <div className={style.wrap_layout}>
                <div className={style.front_layout}>
                  <h1>Fantasy league</h1>

                  <div className={style.start_btns}>
                    {isUserAuthenticated ? (
                      <Link to="/tournaments">
                        <span>{i18n.t('go_to_tournaments')}</span>
                      </Link>
                    ) : (
                      <GoogleLogin
                        icon
                        autoLoad={Boolean(this.tournamentId)}
                        render={renderProperties => (
                          <button type="button" onClick={renderProperties.onClick}>
                            <span>{i18n.t('start_with')} <GoogleIcon className={style.google_icon} /></span>
                          </button>
                        )}
                        clientId={config.google_client_id}
                        onSuccess={this.onSuccessGoogleLogin}
                        onFailure={this.onFailureGoogleLogin}
                      />
                    )}
                  </div>
                </div>
              </div>

              <video loop autoPlay>
                <source src={zed}/>
              </video>
            </div>
          </section>

          <section className={style.guide}>
            <div className={style.wrap_guide}>
              <h2>{i18n.t('what_is_fantasy')}</h2>

              <p>{i18n.t('fantasy_is')}</p>

              <h3>{i18n.t('how_to_play')}</h3>

              <div className={style.step}>
                <h4>1. {i18n.t('guade_choose')}</h4>

                <p>{i18n.t('guade_choose_content')}</p>
              </div>

              <div className={style.step}>
                <h4>2. {i18n.t('guade_create')}</h4>

                <p>{i18n.t('guade_create_content')}</p>
              </div>

              <div className={style.step}>
                <h4>3. {i18n.t('guade_win')}</h4>
                <p>{i18n.t('guade_win_content')}</p>
              </div>
            </div>
          </section>

          <section className={style.tournament_players}>
            <div className={style.wrap_tournament_players}>
              <h2>{i18n.t('tournaments_players')}</h2>

              <p>{i18n.t('tournament_players_content_1')}</p>

              <p>{i18n.t('tournament_players_content_2')}</p>

              <div className={style.tournaments}>

                <div className={style.item_tournament}>
                  <img src={Lpl} alt="lpl"/>
                </div>

                <div className={style.item_tournament}>
                  <img src={Lck} alt="lck"/>
                </div>

                <div className={style.item_tournament}>
                  <img src={Lolchamp} alt="lolchamp"/>
                </div>
              </div>
            </div>
          </section>

          <section className={style.play_fantasy}>
            {isUserAuthenticated ? (
              <GoogleLogin
                icon
                render={renderProperties => (
                  <button type="button" onClick={renderProperties.onClick}>
                    <span>{i18n.t('start_with')} <GoogleIcon className={style.google_icon}/></span>
                  </button>
                )}
                clientId={config.google_client_id}
                onSuccess={this.onSuccessGoogleLogin}
                onFailure={this.onFailureGoogleLogin}
              />
            ) : (
              <Link to="/tournaments">{i18n.t('play_fantasy')}</Link>
            )}
          </section>

          <Footer/>
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      currentUser: state.currentUser,
    }),

    {
      setCurrentUser: storeActions.setCurrentUser,
      showNotification: notificationActions.showNotification,
    },
  ),
)(Start);
