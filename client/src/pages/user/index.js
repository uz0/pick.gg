import React, { Component } from 'react';

import AuthService from '../../services/authService';
import TournamentService from '../../services/tournamentService';
import TransactionService from '../../services/transactionService';
import UserService from '../../services/userService';

import { NavLink } from 'react-router-dom';
import moment from 'moment';

import ProfileSidebar from '../../components/profile-sidebar';
import Preloader from '../../components/preloader';

import style from './style.module.css';
import i18n from 'i18n';

class User extends Component {
  constructor() {
    super();
    this.AuthService = new AuthService();
    this.UserService = new UserService();
    this.TransactionService = new TransactionService();
    this.TournamentService = new TournamentService();
    this.state = {
      tournaments: [],
      userData: {},
      totalWinnings: 0,
      loading: true,
      zeroTournaments: true,
    };
  }

  async componentDidMount() {

    const userId = this.props.match.params.id;

    const { tournaments } = await this.TournamentService.getUserTournamentsById(userId);
    const { winnings } = await this.TransactionService.getTotalWinnings(userId);
    const { user } = await this.UserService.getUserDataById(userId);
    const userRating = await this.UserService.getUsersRating();

    const userPlace = userRating.rating.findIndex(x => x._id === userId) + 1;
    const totalWinnings = winnings.reduce((acc, current) => { return acc + current.amount; }, 0);

    this.setState({
      tournaments: tournaments,
      userData: user,
      totalWinnings,
      totalUsers: userRating.rating.length,
      userPlace,
      loading: false,
    });

  }

  render() {

    const {
      totalWinnings,
      tournaments,
      totalUsers,
      userPlace,
      loading
    } = this.state;

    const winnings = totalWinnings === 0 ? 'newbie' : `$ ${totalWinnings}`;

    return (
      <div className={style.home_page}>
        {loading && <Preloader />}

        <main>
          <div className={style.content}>
            <ProfileSidebar
              withData={true}
              nickname={this.state.userData.username}
              description={this.state.userData.about} />

            <div className={style.user_statistics}>
              <div>
                <h2>{i18n.t('scores')}</h2>

                <div className={style.statistics_masonry}>
                  <div className={style.item}>
                    <div className={style.value}>{this.state.tournaments.length}</div>
                    <div className={style.key}>{i18n.t('tournaments')}</div>
                  </div>

                  <div className={style.item}>
                    <div className={style.value}>$ {this.state.totalWinnings}</div>
                    <div className={style.key}>{i18n.t('earned')}</div>
                  </div>

                  <div className={style.item}>
                    <div className={style.value}>{this.state.userPlace} <span>{i18n.t('of')} {this.state.totalUsers}</span></div>
                    <div className={style.key}>{i18n.t('place')}</div>
                  </div>
                </div>
              </div>
              <div>
                <h2>{i18n.t('recent_tournaments')}</h2>

                {tournaments.length === 0 && <div className={style.zero_info}>{i18n.t('not_yet_tournaments')}</div>}
                <div className={style.tournaments_block}>
                  {tournaments.length > 0 && <div className={style.header_tournaments}>
                    <p>{i18n.t('tournaments_name')}</p>
                    <p>{i18n.t('date')}</p>
                    <p>{i18n.t('users')}</p>
                    <p>{i18n.t('entry')}</p>                  </div>}
                  {tournaments.map(item => (
                    <NavLink key={item._id} to={`/tournaments/${item._id}`}>
                      <div className={style.card_tournament}>
                        <p>{item.name}</p>
                        <p>{moment(item.date).format('MMM DD')}</p>
                        <p>{item.users.length}</p>
                        <p>$ {item.entry}</p>
                      </div>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default User;
