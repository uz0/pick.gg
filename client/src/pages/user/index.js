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
import i18n from '../../i18n';

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
      loader: true,
      zeroTournaments: true,
    };
  }

  preloader = () => {
    this.setState({
      loader: false,
    });
  }

  async componentDidMount() {

    let userId = this.props.match.params.id;

    let tournaments = await this.TournamentService.getUserTournamentsById(userId);
    let winnings = await this.TransactionService.getTotalWinnings(userId);
    let user = await this.UserService.getUserDataById(userId);
    let userRating = await this.UserService.getUsersRating();
    const userPlace = userRating.rating.findIndex(x => x._id === userId) + 1;

    let totalWinnings = winnings.winnings.reduce((acc, current) => { return acc + current.amount; }, 0);

    this.setState({
      tournaments: tournaments.tournaments,
      userData: user.user,
      totalWinnings,
      totalUsers: userRating.rating.length,
      userPlace,
    });
    this.preloader();
    console.log(tournaments.tournaments.length === 0);
    this.zeroTournaments = () => {
      if (tournaments.tournaments.length === 0){
        this.setState({
          zeroTournaments: true,
        });
      }
    };

  }

  render() {

    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />

        {this.state.loader && <Preloader />}

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
                
                {this.state.zeroTournaments && <div className={style.zero_info}>{i18n.t('zero_tournaments')}</div>}
                <div className={style.tournaments_block}>
                  {!this.state.zeroTournaments && <div className={style.header_tournaments}>
                    <p>{i18n.t('tournaments_name')}</p>
                    <p>{i18n.t('date')}</p>
                    <p>{i18n.t('users')}</p>
                    <p>{i18n.t('entry')}</p>
                  
                  </div>}
                  {this.state.tournaments.map(item => (
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
