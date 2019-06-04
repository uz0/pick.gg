import React, { Component } from 'react';

import TournamentService from '../../services/tournamentService';
import UserService from '../../services/userService';

import io from "socket.io-client";

import { NavLink } from 'react-router-dom';

import ProfileSidebar from '../../components/profile-sidebar';
import Preloader from '../../components/preloader';
import Table from 'components/table';

import style from './style.module.css';
import i18n from 'i18n';

const tournamentsTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: window.innerWidth < 480 ? 150 : 250,
  },

  users: {
    text: i18n.t('users'),
    width: window.innerWidth < 480 ? 75 : 100,
  },

  entry: {
    text: i18n.t('entry'),
    width: window.innerWidth < 480 ? 75 : 100,
  },
};

class User extends Component {
  constructor() {
    super();
    this.userService = new UserService();
    this.tournamentService = new TournamentService();
    this.state = {
      tournaments: [],
      rewards: [],
      userData: {},
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

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.users.width }}>
        <span className={textClass}>{item.users.length}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.entry.width }}>
        <span className={textClass}>{entry}$</span>
      </div>
    </NavLink>;
  }

  componentDidMount() {
    this.loadData();

    this.socket = io();
    this.socket.on('fantasyTournamentFinalized', () => this.loadData());
  }

  loadData = async () => {
    const userId = this.props.match.params.id;

    const { tournaments } = await this.tournamentService.getUserTournamentsById(userId);
    const { user } = await this.userService.getUserDataById(userId);
    const rewards = user.rewards;
    console.log(user);
    this.setState({
      tournaments,
      rewards,
      userData: user,
      loading: false,
    });
  }

  render() {
    const { tournaments, rewards, loading } = this.state;

    return (
      <div className={style.user_page}>
        {loading && <Preloader
          isFullScreen={true}
        />}
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
                  <div className={style.value}>{rewards && rewards.length}</div>
                  <div className={style.key}>{i18n.t('rewards')}</div>
                </div>
                <div className={style.item}>
                  <div className={style.value}>{tournaments && tournaments.length}</div>
                  <div className={style.key}>{i18n.t('tournaments')}</div>
                </div>

              </div>
            </div>
            <div>
              <h2>{i18n.t('recent_tournaments')}</h2>
              <div className={style.section}>
                {tournaments && <Table
                  captions={tournamentsTableCaptions}
                  items={tournaments}
                  className={style.table}
                  renderRow={this.renderRow}
                  isLoading={this.state.isLoading}
                  emptyMessage={i18n.t('there_is_no_tournaments_yet')}
                />
                }
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default User;
