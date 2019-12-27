import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { actions as usersActions } from 'pages/dashboard/users';
import findIndex from 'lodash/findIndex';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classnames from 'classnames/bind';

import defaultBackground from 'assets/play-with.jpg';

import ProfileSidebar from 'components/profile-sidebar';
import Preloader from 'components/preloader';

import { http } from 'helpers';

import i18n from 'i18n';

import style from './style.module.css';

const cx = classnames.bind(style);

class User extends Component {
  state = {
    isLoading: false,
    applicants: '',
    streamers: '',
    viewers: '',
    lastGames: '',
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

    const lastGamesRequest = await http(`/public/tournaments/user/${userId}?quantity=100`);
    const lastGamesJson = await lastGamesRequest.json();
    const lastGames = lastGamesJson.tournaments;
    console.log('last games:', lastGames);

    this.setState({
      isLoading: false,
      applicants,
      streamers,
      viewers,
      lastGames,
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

    const { about, imageUrl, gameSpecificName, username } = currentUser;
    const { applicants, streamers, viewers, lastGames } = this.state;

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
            gameSpecificName={gameSpecificName}
          />

          <div className={style.user_statistics}>
            <div>
              <h2>{i18n.t('statistics')}</h2>

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
              <h2>{i18n.t('last_games')}</h2>

              <div className={style.last_games}>
                {lastGames && lastGames.map(item => {
                  const dateMonth = moment(item.startAt).format('MMM');
                  const dateDay = moment(item.startAt).format('DD');
                  const winner = item.winners.filter(item => item.id === userId)[0];
                  const isWinner = winner ? i18n.t('winner') : i18n.t('tournament_is_end');

                  const isFinal = item.isFinalized ? (
                    <span className={style.final}>{isWinner}</span>
                  ) : <span className={style.final}>{i18n.t('active_tournament')}</span>;

                  const isBackground = item.imageUrl ? item.imageUrl : defaultBackground;

                  return (
                    <Link key={item._id} to={`/tournaments/${item._id}`} className={style.item}>
                      <div key={item.name} className={style.card} style={{ backgroundImage: `url(${isBackground})` }}>
                        <div className={style.content}>
                          <div className={style.date}>
                            <span className={style.month}>{dateMonth}</span>

                            <span className={style.day}>{dateDay}</span>
                          </div>

                          <div className={style.basic}>
                            <div className={style.name}>{item.name}</div>
                            {isFinal}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
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
