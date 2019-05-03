import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { Link } from 'react-router-dom';
import style from './style.module.css';
import i18n from "i18next";
import config from 'config';

import NotificationContainer from 'components/notification/notification-container';
import Footer from 'components/footer';

import AuthService from 'services/authService';
import NotificationService from 'services/notificationService';

import Lpl from 'assets/start/lpl.png';
import Lolchamp from 'assets/start/lolchamp.png';
import Lck from 'assets/start/lck.png';
import { ReactComponent as GoogleIcon } from 'assets/google-icon.svg';
import zed from 'assets/zed.mp4';

class Start extends Component {
  constructor() {
    super();
    this.auth = new AuthService();
    this.notificationService = new NotificationService();
  }

  componentDidMount() {
    if (this.props.history.action === 'REPLACE') {
      this.notificationService.showSingleNotification({
        type: 'warning',
        shouldBeAddedToSidebar: false,
        message: i18n.t('login_message_on_redirect'),
      });
    }
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  onSuccessGoogleLogin = async data => {
    const profile = data.getBasicProfile();
    const email = profile.getEmail();
    const name = profile.getName();
    const photo = profile.getImageUrl();

    const authRequest = await this.auth.oauthLogin(email, name, photo);

    if (authRequest.success) {
      this.props.history.replace('/tournaments');
    } else {
      this.props.history.replace('/register');

      this.notificationService.showSingleNotification({
        type: 'success',
        shouldBeAddedToSidebar: false,
        message: authRequest.message,
      });
    }
  };

  onFailureGoogleLogin = async data => {
    this.notificationService.showSingleNotification({
      type: 'error',
      shouldBeAddedToSidebar: false,
      message: i18n.t(data.error),
    });
  };

  componentWillMount() {
    // if (this.auth.isLoggedIn()) this.props.history.replace('/');
  }

  render() {
    const isUserAuthenticated = this.auth.isLoggedIn();

    return (
      <div className={style.login_page}>

        <NotificationContainer />

        <section className={style.login_section}>
          <div className={style.start_content}>
            <div className={style.wrap_layout}>
              <div className={style.front_layout}>
                <h1>Fantasy league</h1>

                <div className={style.start_btns}>
                  {isUserAuthenticated && <Link to="/tournaments">
                    <span>{i18n.t('go_to_tournaments')}</span>
                  </Link>
                  }

                  {!isUserAuthenticated && <GoogleLogin
                    icon={true}
                    render={renderProps => (
                      <button onClick={renderProps.onClick}>
                        <span>{i18n.t('start_with')} <GoogleIcon className={style.google_icon} /></span>
                      </button>
                    )}
                    clientId={config.google_client_id}
                    onSuccess={this.onSuccessGoogleLogin}
                    onFailure={this.onFailureGoogleLogin}
                  />
                  }
                </div>
              </div>
            </div>

            <video loop autoPlay>
              <source src={zed} />
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
                <img src={Lpl} alt="lpl" />
              </div>

              <div className={style.item_tournament}>
                <img src={Lck} alt="lck" />
              </div>

              <div className={style.item_tournament}>
                <img src={Lolchamp} alt="lolchamp" />
              </div>
            </div>
          </div>
        </section>

        <section className={style.play_fantasy}>
          {!isUserAuthenticated && <GoogleLogin
            icon={true}
            render={renderProps => (
              <button onClick={renderProps.onClick}>
                <span>{i18n.t('start_with')} <GoogleIcon className={style.google_icon} /></span>
              </button>
            )}
            clientId={config.google_client_id}
            onSuccess={this.onSuccessGoogleLogin}
            onFailure={this.onFailureGoogleLogin}
          />}
          {isUserAuthenticated && <Link to="/tournaments">{i18n.t('play_fantasy')}</Link>}
        </section>

        <Footer />
      </div>
    );
  }
}

export default Start;
