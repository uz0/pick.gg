import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import style from './style.module.css';
import i18n from "i18next";
import config from 'config';

import NotificationContainer from '../../components/notification/notification-container';

import AuthService from '../../services/authService';
import NotificationService from '../../services/notificationService';

import tournamentsList from 'assets/faq/tournaments_list.png';
import tournamentsFinished from 'assets/faq/tournament_finished.png';
import championsCards from 'assets/faq/champions.png';
import { ReactComponent as GoogleIcon } from 'assets/google-icon.svg';
import zed from 'assets/zed.mp4'

import classnames from 'classnames';
const cx = classnames.bind(style);

class Start extends Component {
  constructor() {
    super();
    this.auth = new AuthService();
    this.notificationService = new NotificationService();
  }

  componentDidMount(){
    if(this.props.history.action === 'REPLACE'){
      this.notificationService.show(i18n.t('login_message_on_redirect'));
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
      this.notificationService.show(authRequest.message);
    }
  };

  onFailureGoogleLogin = async data => {
    console.log('fail ', data);
    this.notificationService.show(i18n.t(data.error));
  };

  componentWillMount() {
    if (this.auth.isLoggedIn()) this.props.history.replace('/tournaments');
  }

  render() {
    return (
      <div className={style.login_page}>

        <NotificationContainer />

        <section className={style.login_section}>
          <div className={style.start_content}>
            <div className={style.wrap_layout}>
              <div className={style.front_layout}>
                <h1>Fantasy league</h1>

                <div className={style.start_btns}>
                  <GoogleLogin
                    icon={true}
                    render={renderProps => (
                      <button onClick={renderProps.onClick}>

                        <span>{i18n.t('start_with')} <GoogleIcon className={style.google_icon} /></span>

                        {/* <svg width="250" className={style.back_button} height="80">
                          <polygon points="240,30 250,80 0,80 0,10"
                            fill="white" />
                        </svg> */}
                      </button>
                    )}
                    clientId={config.google_client_id}
                    onSuccess={this.onSuccessGoogleLogin}
                    onFailure={this.onFailureGoogleLogin}
                  />
                </div>
              </div>
            </div>
            <video loop autoPlay>
              <source src={zed} />
            </video>
          </div>
        </section>

        <section className={style.guide}>
          <div className={style.step}>
            <div>
              <h2>1. {i18n.t('guade_choose')}</h2>
              <p>{i18n.t('guade_choose_content')}</p>
            </div>
            <div>
              <img src={tournamentsList} alt="Tournaments list" />
            </div>
          </div>
          <div className={cx(style.step, style.align_right)}>
            <div>
              <h2>2. {i18n.t('guade_create')}</h2>
              <p>{i18n.t('guade_create_content')}</p>
            </div>
            <div>
              <img src={championsCards} alt="User team" />
            </div>
          </div>
          <div className={style.step}>
            <div>
              <h2>3. {i18n.t('guade_win')}</h2>
              <p>{i18n.t('guade_win_content')}</p>
            </div>
            <div>
              <img src={tournamentsFinished} alt="Tournament result" />
            </div>
          </div>
        </section>

      </div>
    );
  }
}

export default Start;
