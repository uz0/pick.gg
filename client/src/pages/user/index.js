import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { actions as storeActions } from 'store';
import { actions as usersActions } from 'pages/dashboard/users';
import { http } from 'helpers';
import findIndex from 'lodash/findIndex';

import ProfileSidebar from 'components/profile-sidebar';
import Preloader from 'components/preloader';
import thumb from 'assets/tournament_thumbnail.jpg';

import style from './style.module.css';
import i18n from 'i18n';
import classnames from 'classnames/bind';

const cx = classnames.bind(style);

const lastGames = [
  { name: 'Fisrt figth', role: 'Streamer', position: 'Mid', place: '4 of 10' },
  { name: '1vs1', role: 'Streamer', position: 'ADC', place: '1 of 2' },
  { name: 'Super battle', role: 'User', position: 'Jungle', place: '5 of 10' },
  { name: '3vs3', role: 'User', position: 'Mid', place: '2 of 6' },
  { name: 'Super Mario', role: 'Streamer', position: 'Top', place: '8 of 10' },
  { name: 'Super mid battle', role: 'User', position: 'Jungle', place: '2 of 10' },
];

class User extends Component {
  state = {
    isLoading: false,
    applicants: '',
    streamers: '',
    viewers: '',
  };

  loadUser = async () => {
    this.setState({ isLoading: true });
    const userId = this.props.match.params.id;
    const userRequest = await http(`/public/users/${userId}`);
    const { user } = await userRequest.json();
    this.props.loadUser([user]);

    const ratingRequest = await http('/public/rating');
    const { ...allRating } = await ratingRequest.json();
    const applicants = allRating.applicantsRating;
    const streamers = allRating.streamersRating;
    const viewers = allRating.viewersRating;

    this.setState({
      isLoading: false,
      applicants,
      streamers,
      viewers,
    });
  }

  componentDidMount() {
    if (!this.props.isLoaded) {
      this.loadUser();
    }
  }

  render() {
    const userId = this.props.match.params.id;
    const currentUser = this.props.users[userId] || {};

    const { about, imageUrl, summonerName, preferredPosition, username } = currentUser;
    const { applicants, streamers, viewers } = this.state;

    const placeApplicants = findIndex(applicants, item => item.username === username) + 1;
    const placeStreamers = findIndex(streamers, item => item.username === username) + 1;
    const placeViewers = findIndex(viewers, item => item.username === username) + 1;

    const lenghtApplicants = applicants.length;
    const lenghtStreamers = streamers.length;
    const lengthViewers = viewers.length;

    const isGamesStreamers = placeStreamers === 0 ? i18n.t('no_games') : `${placeStreamers} ${i18n.t('of')} ${lenghtStreamers}`;
    const isGamesApplicants = placeApplicants === 0 ? i18n.t('no_games') : `${placeApplicants} ${i18n.t('of')} ${lenghtApplicants}`;
    const isGamesViewers = placeViewers === 0 ? i18n.t('no_games') : `${placeViewers} ${i18n.t('of')} ${lengthViewers}`;

    const isApplicantsGames = placeApplicants === 0;
    const isStreamerGames = placeStreamers === 0;
    const isViewersGames = placeViewers === 0;

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
              <h2>{i18n.t('Statistics')}</h2>

              <div className={style.statistics_masonry}>
                <div className={cx(style.item, { [style.no_games]: isStreamerGames })}>
                  <div className={style.key}>{i18n.t('streamer')}</div>
                  <div className={style.value}>{isGamesStreamers}</div>
                </div>

                <div className={cx(style.item, { [style.no_games]: isApplicantsGames })}>
                  <div className={style.key}>{i18n.t('summoner')}</div>
                  <div className={style.value}>{isGamesApplicants}</div>
                </div>

                <div className={cx(style.item, { [style.no_games]: isViewersGames })}>
                  <div className={style.key}>{i18n.t('viewer')}</div>
                  <div className={style.value}>{isGamesViewers}</div>
                </div>
              </div>
            </div>
            <div className={style.last_games_wrap}>
              <h2>{i18n.t('Last games')}</h2>

              <div className={style.last_games}>
                {lastGames && lastGames.map(item => (
                  <div key={item.name} className={style.card}>
                    <div className={style.img}>
                      <img src={thumb}/>
                    </div>

                    <div className={style.content}>
                      <div className={style.name}>{item.name}</div>
                      <div className={style.role}>{item.role}</div>
                      <div className={style.position}>{item.position}</div>
                      <div className={style.place}>#{item.place}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {this.state.isLoading &&
          <Preloader/>
        }
      </div>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      users: state.users.list,
      isLoaded: state.tournaments.isLoaded,
    }),

    {
      loadUser: usersActions.loadUsers,
    }
  ),
);

export default enhance(User);
