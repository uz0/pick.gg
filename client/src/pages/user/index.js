import React, { Component } from 'react';

import TournamentService from '../../services/tournamentService';
import TransactionService from '../../services/transactionService';
import UserService from '../../services/userService';

import { NavLink } from 'react-router-dom';

import ProfileSidebar from '../../components/profile-sidebar';
import Preloader from '../../components/preloader';
import Table from 'components/table';

import style from './style.module.css';
import i18n from 'i18n';

const tournamentsTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: 250,
  },

  // date: {
  //   text: i18n.t('date'),
  //   width: 100,
  // },

  users: {
    text: i18n.t('users'),
    width: 80,
  },

  entry: {
    text: i18n.t('entry'),
    width: 80,
  },
};

class User extends Component {
  constructor() {
    super();
    this.userService = new UserService();
    this.transactionService = new TransactionService();
    this.tournamentService = new TournamentService();
    this.state = {
      tournaments: [],
      userData: {},
      totalWinnings: 0,
      loading: true,
      zeroTournaments: true,
    };
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const entry = item.entry === 0 ? 'Free' : item.entry;
    return <NavLink to={`/tournaments/${item._id}`} className={className} key={item._id}>
      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.name.width }}>
        <span className={textClass}>{item.name}</span>
      </div>

      {/* <div className={itemClass} style={{'--width': tournamentsTableCaptions.date.width}}>
        <span className={textClass}>{formattedDate}</span>
      </div> */}

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.users.width }}>
        <span className={textClass}>{item.users.length}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.entry.width }}>
        <span className={textClass}>{entry}$</span>
      </div>
    </NavLink>;
  }

  async componentDidMount() {

    const userId = this.props.match.params.id;

    const { tournaments } = await this.tournamentService.getMyTournaments();
    const { winnings } = await this.transactionService.getTotalWinnings(userId);
    const { user } = await this.userService.getUserDataById(userId);
    const userRating = await this.userService.getUsersRating();
    const userPlace = userRating.rating.findIndex(x => x._id === userId) + 1;
    const totalWinnings = winnings.reduce((acc, current) => { return acc + current.amount; }, 0);

    this.setState({
      tournaments,
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
      loading,
    } = this.state;

    const winnings = totalWinnings === 0 ? i18n.t('newbie') : `$ ${totalWinnings}`;
    const forTotal = totalWinnings === 0 ? '' : i18n.t('earned');

    return (
      <div className={style.home_page}>
        {loading && <Preloader />}

        <main>
          <div className={style.content}>
            <ProfileSidebar
              source={this.state.userData.photo}
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
                    <div className={style.value}>{winnings}</div>
                    <div className={style.key}>{forTotal}</div>
                  </div>

                  <div className={style.item}>
                    <div className={style.value}>{this.state.userPlace} <span>{i18n.t('of')} {this.state.totalUsers}</span></div>
                    <div className={style.key}>{i18n.t('place')}</div>
                  </div>
                </div>
              </div>
              <div>
                <h2>{i18n.t('recent_tournaments')}</h2>
                <div className={style.section}>
                  <Table
                    captions={tournamentsTableCaptions}
                    items={tournaments}
                    className={style.table}
                    renderRow={this.renderRow}
                    isLoading={this.state.isLoading}
                    emptyMessage={i18n.t('there_is_no_tournaments_yet')}
                  />
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
