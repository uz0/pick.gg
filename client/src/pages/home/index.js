import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import ym from 'react-yandex-metrika';
import config from 'config';

import { ReactComponent as LogoIcon } from 'assets/home/p-logo.svg';
import wasd from 'assets/home/wasd.svg';
import twitch from 'assets/home/twitch.svg';
import youtube from 'assets/home/youtube.svg';
import mixer from 'assets/home/mixer.svg';
import lolLogo from 'assets/home/Lol_logo.svg';
import pubgLogo from 'assets/home/pubg-logo.svg';
import gunIcon from 'assets/home/rare-item.svg';
import chestIcon from 'assets/home/Treasure_chest.svg';
import cupIcon from 'assets/home/weekly-cup.svg';
import dotaIcon from 'assets/home/dota-icon.svg';
import lolIcon from 'assets/home/lol-icon.svg';
import froggen from 'assets/home/froggen.svg';
import sain from 'assets/home/sain.svg';
import yuvonnie from 'assets/home/yvonnie.svg';
import zven from 'assets/home/zven.svg';
import facebook from 'assets/home/facebook.svg';
import linkedin from 'assets/home/linkedin.svg';
import email from 'assets/home/email.svg';

import { actions as notificationActions } from 'components/notification';

import { isLogged, http } from 'helpers';

import i18n from 'i18next';

import { actions as storeActions } from 'store';

import style from './style.module.css';

class Start extends Component {
  constructor(properties) {
    super(properties);
    this.tournamentId = new URLSearchParams(properties.location.search).get(
      'tournamentId'
    );
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
  };

  onFailureGoogleLogin = () => {
    this.props.showNotification({
      type: 'error',
      shouldBeAddedToSidebar: false,
      message: i18n.t('notifications.errors.closed_window'),
    });
  };

  changeLocale = event => {
    localStorage.setItem('_pgg_locale', event.target.name);
    i18n.changeLanguage(event.target.name);

    ym('reachGoal', `choosed_${event.target.name}_locale`);
    window.location.reload();
  };

  redirectToTournaments = () => {
    const url = this.tournamentId ? `/tournaments/${this.tournamentId}` : '/tournaments';
    this.props.history.push(url);
  };

  render() {
    const locale = localStorage.getItem('_pgg_locale');
    const linkOffer = locale === 'ru' ?
      'https://nikitamurashov.typeform.com/to/gwzWNv' : // Ru form
      'https://nikitamurashov.typeform.com/to/MJeHcA'; // En form

    return (
      <>
        <section className={style.main}>
          <div className={style.wrap}>
            <header className={style.header}>
              <div className={style.logo}>
                <LogoIcon/>
                Pick.gg
              </div>

              <div className={style.lang_settings}>
                <button type="button" name="ru" onClick={this.changeLocale}>
                  RU
                </button>
                <button type="button" name="en" onClick={this.changeLocale}>
                  EN
                </button>
              </div>
            </header>

            <div className={style.main_content}>
              <h2>{i18n.t('home.under_title')}<span className={style.orange}>{i18n.t('home.under_title_2')}</span></h2>

              <div className={style.logos}>
                <img src={wasd} alt="logo wasd"/>
                <img src={twitch} alt="logo twitch"/>
                <img src={youtube} alt="logo youtube"/>
                <img src={mixer} alt="logo mixer"/>
              </div>

              <div className={style.buttons}>
                <GoogleLogin
                  autoLoad={Boolean(this.tournamentId)}
                  render={renderProperties => (
                    <button
                      type="button"
                      className={style.button}
                      onClick={() =>
                        isLogged() ? this.redirectToTournaments() : renderProperties.onClick()
                      }
                    >
                      <span>{i18n.t('home.button_1')}</span>
                    </button>
                  )}
                  clientId={config.googleClientId}
                  onSuccess={this.onSuccessGoogleLogin}
                  onFailure={this.onFailureGoogleLogin}
                />

                <a target="_blank" rel="noopener noreferrer" href={linkOffer} className={style.streamer}>
                  {i18n.t('home.link_1')}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={style.work}>
          <div className={style.wrap}>
            <h2><span className={style.orange}>{i18n.t('home.how_it_work')}</span> {i18n.t('home.how_it_work_2')}</h2>
            <div className={style.games}>
              <img src={pubgLogo} alt="logo pubg"/>
              <img src={lolLogo} alt="logo lol"/>
            </div>
            <div className={style.cards}>
              <div className={style.card}>
                <div className={style.num}>01.</div>

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
                <div className={style.num}>02.</div>

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
                <div className={style.num}>03.</div>

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

        <section className={style.tournaments}>
          <div className={style.wrap}>
            <h2>{i18n.t('home.predictions')}</h2>
            <p>{i18n.t('home.text_predictions')}</p>

            <div className={style.tournament_items}>
              <div className={style.tournament_item}>
                <div className={style.img}>
                  <img src={chestIcon} alt="chest"/>
                </div>
                <div className={style.title_item}>$20 000</div>
                <div className={style.undertitle_item}>{i18n.t('home.prize_pool')}</div>
              </div>

              <div className={style.tournament_item}>
                <div className={style.img}>
                  <img src={gunIcon} alt="gun"/>
                </div>
                <div className={style.title_item}>10</div>
                <div className={style.undertitle_item}>
                  {i18n.t('home.hottest_items')}
                </div>
              </div>

              <div className={style.tournament_item}>
                <div className={style.img}>
                  <img src={cupIcon} alt="cup"/>
                </div>
                <div className={style.title_item}>ARCANA</div>
                <div className={style.undertitle_item}>{i18n.t('home.every_week')}</div>
              </div>
            </div>
          </div>
        </section>

        <section className={style.jump_section}>
          <div className={style.wrap}>
            <h2>{i18n.t('home.jump_in_action')} <span className={style.orange}>{i18n.t('home.jump_in_action_2')}</span></h2>

            <div className={style.players}>
              <div className={style.player}>
                <div className={style.avatar}>
                  <div className={style.img}>
                    <img src={froggen} alt="avatar froggen"/>
                  </div>
                  <div className={style.logo_game}>
                    <img src={dotaIcon} alt="dota icon"/>
                  </div>
                </div>

                <div className={style.name}>FROGGEN</div>

                <div className={style.status_on}>online</div>

                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" className={style.join_link}>{i18n.t('home.join_matchup')}</a>
              </div>

              <div className={style.player}>
                <div className={style.avatar}>
                  <div className={style.img}>
                    <img src={sain} alt="avatar sainvicious"/>
                  </div>
                  <div className={style.logo_game}>
                    <img src={lolIcon} alt="lol icon"/>
                  </div>
                </div>

                <div className={style.name}>SAINTVICIOUS</div>

                <div className={style.status_off}>offline</div>

                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" className={style.join_link}>{i18n.t('home.join_matchup')}</a>
              </div>

              <div className={style.player}>
                <div className={style.avatar}>
                  <div className={style.img}>
                    <img src={yuvonnie} alt="avatar yuvonnie"/>
                  </div>
                  <div className={style.logo_game}>
                    <img src={dotaIcon} alt="dota icon"/>
                  </div>
                </div>

                <div className={style.name}>YVONNIE</div>

                <div className={style.status_on}>online</div>

                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" className={style.join_link}>{i18n.t('home.join_matchup')}</a>
              </div>

              <div className={style.player}>
                <div className={style.avatar}>
                  <div className={style.img}>
                    <img src={zven} alt="avatar zven"/>
                  </div>
                  <div className={style.logo_game}>
                    <img src={lolIcon} alt="icon lol"/>
                  </div>
                </div>

                <div className={style.name}>TSM_ZVEN</div>

                <div className={style.status_off}>offline</div>

                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" className={style.join_link}>{i18n.t('home.join_matchup')}</a>
              </div>
            </div>
          </div>
        </section>

        <section className={style.team_goals}>
          <div className={style.wrap}>
            <h2>{i18n.t('home.footer_title')} <span className={style.orange}>{i18n.t('home.footer_title_2')}</span></h2>

            <p>{i18n.t('home.footer_undertitle_1')}</p>

            <p>{i18n.t('home.footer_undertitle_2')}</p>

            <div className={style.buttons}>
              <GoogleLogin
                autoLoad={Boolean(this.tournamentId)}
                render={renderProperties => (
                  <button
                    type="button"
                    className={style.button}
                    onClick={() =>
                      isLogged() ? this.redirectToTournaments() : renderProperties.onClick()
                    }
                  >
                    <span>{i18n.t('home.button_2')}</span>
                  </button>
                )}
                clientId={config.googleClientId}
                onSuccess={this.onSuccessGoogleLogin}
                onFailure={this.onFailureGoogleLogin}
              />

              <a target="_blank" rel="noopener noreferrer" href={linkOffer} className={style.streamer}>
                {i18n.t('home.link_2')}
              </a>
            </div>
          </div>
        </section>

        <section className={style.contact}>
          <div className={style.wrap}>
            <h2>{i18n.t('home.contact_us')}</h2>

            <div className={style.contacts}>
              <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/pickforgg/">
                <div className={style.icon}>
                  <img src={facebook} alt="facebook icon"/>
                </div>
                FACEBOOK
              </a>

              <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/pick-gg/about/">
                <div className={style.icon}>
                  <img src={linkedin} alt="linkedin icon"/>
                </div>
                LINKEDIN
              </a>

              <a href="mailto:nick@pick.gg">
                <div className={style.icon}>
                  <img src={email} alt="email icon"/>
                </div>
                NICK@PICK.GG
              </a>
            </div>
          </div>
        </section>

        <footer className={style.footer}>
          <div className={style.wrap}>
            <div className={style.info}>
              <div className={style.copyright}>
                <div className={style.logo}>PICK.GG</div>
                <p>© {new Date().getFullYear()} {i18n.t('home.all_rights')}</p>
              </div>

              <div className={style.adress}>
                <p>s.r.o. Kodaňská 572/47</p>
              </div>
            </div>
          </div>
        </footer>
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
    }
  )
)(Start);
