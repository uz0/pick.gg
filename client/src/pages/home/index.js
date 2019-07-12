import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import style from './style.module.css';

import ym from 'react-yandex-metrika';
import i18n from 'i18next';
import config from 'config';

import { actions as notificationActions } from 'components/notification';
import { actions as storeActions } from 'store';
import { http } from 'helpers';

import cardOne from 'assets/card-1.png';
import cardTwo from 'assets/card-2.png';
import cardThree from 'assets/card-3.png';
import cardFour from 'assets/card-4.png';

class Start extends Component {
  constructor(properties) {
    super(properties);
    this.tournamentId = new URLSearchParams(properties.location.search).get('tournamentId');
  }

  onSuccessGoogleLogin = async data => {
    const profile = data.getBasicProfile();

    const body = {
      email: profile.getEmail(),
      name: profile.getName(),
      photo: profile.getImageUrl(),
    };

    let response = await http('/authentication/oauth', {
      headers: {
        'Content-Type': 'application/json',
      },
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
    return (
      <>
        <section className={style.main}>
          <div className={style.wrap}>
            <h1>Pick.gg</h1>

            <p>{i18n.t('home.under_title')}</p>

            <div className={style.buttons}>
              <GoogleLogin
                autoLoad={Boolean(this.tournamentId)}
                render={renderProperties => (
                  <button
                    type="button"
                    className={style.button}
                    onClick={renderProperties.onClick}
                  >
                    <span>{i18n.t('Jump in!')}</span>
                  </button>
                )}
                clientId={config.googleClientId}
                onSuccess={this.onSuccessGoogleLogin}
                onFailure={this.onFailureGoogleLogin}
              />

              <Link to="#" className={style.streamer}>{i18n.t('home.link_1')}</Link>
            </div>
          </div>
        </section>

        <section className={style.work}>
          <div className={style.wrap}>
            <h2>{i18n.t('home.how_it_work')}</h2>

            <div className={style.cards}>
              <div className={style.card}>
                <img src={cardOne} alt="Image"/>

                <div className={style.text}>
                  <div className={style.first_title}>
                    {i18n.t('home.card_1_title')}
                  </div>
                </div>
              </div>

              <div className={style.card}>
                <img src={cardTwo} alt="Image"/>

                <div className={style.text}>
                  <div className={style.title}>
                    {i18n.t('home.card_2_title')}
                  </div>

                  <div className={style.undertitle}>
                    {i18n.t('home.card_2_undertitle')}
                  </div>
                </div>
              </div>

              <div className={style.card}>
                <img src={cardThree} alt="Image"/>

                <div className={style.text}>
                  <div className={style.title}>
                    {i18n.t('home.card_3_title')}
                  </div>

                  <div className={style.undertitle}>
                    {i18n.t('home.card_3_undertitle')}
                  </div>
                </div>
              </div>

              <div className={style.card}>
                <img src={cardFour} alt="Image"/>

                <div className={style.text}>
                  <div className={style.title}>
                    {i18n.t('home.card_4_title')}
                  </div>

                  <div className={style.undertitle}>
                    {i18n.t('home.card_4_undertitle')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={style.footer}>
          <div className={style.wrap}>
            <h2>{i18n.t('home.footer_title')}</h2>

            <p>{i18n.t('home.footer_undertitle_1')}</p>

            <p>{i18n.t('home.footer_undertitle_2')}</p>

            <div className={style.buttons}>
              <GoogleLogin
                autoLoad={Boolean(this.tournamentId)}
                render={renderProperties => (
                  <button
                    type="button"
                    className={style.button}
                    onClick={renderProperties.onClick}
                  >
                    <span>{i18n.t('home.button_2')}</span>
                  </button>
                )}
                clientId={config.googleClientId}
                onSuccess={this.onSuccessGoogleLogin}
                onFailure={this.onFailureGoogleLogin}
              />

              <Link to="#" className={style.streamer}>{i18n.t('home.link_2')}</Link>
            </div>
          </div>
        </section>
      </>
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
