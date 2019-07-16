import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { actions as storeActions } from 'store';

import ProfileSidebar from 'components/profile-sidebar';
import Preloader from '../../components/preloader';

import style from './style.module.css';
import i18n from 'i18n';
import classnames from 'classnames/bind';

const cx = classnames.bind(style);

class User extends Component {
  state = {
    loading: false,
  };

  render() {
    const { about, imageUrl, summonerName, preferredPosition, username } = this.props.currentUser;

    return (
      <div className={cx('container', 'user_page')}>
        <div className={style.content}>
          <ProfileSidebar
            withData
            source={imageUrl}
            nickname={username}
            description={about}
            summonerName={summonerName}
            preferredPosition={preferredPosition}
          />

          <div className={style.user_statistics}>
            <div>
              <h2>{i18n.t('scores')}</h2>

              <div className={style.statistics_masonry}>
                <div className={style.item}>
                  <div className={style.value}>0</div>
                  <div className={style.key}>{i18n.t('rewards')}</div>
                </div>

                <div className={style.item}>
                  <div className={style.value}>0</div>
                  <div className={style.key}>{i18n.t('tournaments')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const enhance = compose(
  connect(
    store => ({
      currentUser: store.currentUser,
    }),

    {
      setCurrentUser: storeActions.setCurrentUser,
    }
  ),
);

export default enhance(User);
