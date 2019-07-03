import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import i18n from 'i18n';

import { ReactComponent as AvatarPlaceholder } from 'assets/avatar-placeholder.svg';
import Table from 'components/table';
import Card from 'components/card-user';

import style from './style.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(style);

const ratingTableCaptions = {
  place: {
    text: '#',
    width: window.innerWidth < 480 ? 50 : 80,
  },

  avatar: {
    text: '',
    width: window.innerWidth < 480 ? 55 : 80,
  },

  username: {
    text: i18n.t('name'),
    width: window.innerWidth < 480 ? 110 : 350,
  },

  winning: {
    text: i18n.t('amount'),
    width: window.innerWidth < 480 ? 80 : 150,
  },
};

class Rating extends Component {
  state = {
    playersList: [],
    isLoading: true,
  };

  renderRow = ({ className, itemClass, textClass, item }) => {
    const Avatar = () => item.photo ? <img src={item.photo} alt="userpic"/> : <AvatarPlaceholder/>;
    const currentUserRow = this.state.currentUser.user && this.state.currentUser.user._id === item._id;

    return (
      <NavLink key={item._id} to={`/user/${item._id}`} className={cx(className, { [style.current_user]: currentUserRow })}>
        <div className={itemClass} style={{ '--width': ratingTableCaptions.place.width }}>
          <span className={textClass}>{item.place}</span>
        </div>

        <div className={itemClass} style={{ '--width': ratingTableCaptions.avatar.width }}>
          <span className={cx(textClass, style.avatar_table)}><Avatar/></span>
        </div>

        <div className={itemClass} style={{ '--width': ratingTableCaptions.username.width }}>
          <span className={textClass}>{item.username}</span>
        </div>

        <div className={itemClass} style={{ '--width': ratingTableCaptions.winning.width }}>
          <span className={textClass}>{item.rewards.length}</span>
        </div>
      </NavLink>
    );
  }

  renderTopUsers = ({ className, avatarClass, nameClass, winningsClass, item }) => {
    const Avatar = () => item.photo ? <img src={item.photo} alt="userpic"/> : <AvatarPlaceholder/>;

    return (
      <NavLink key={item._id} to={`/user/${item._id}`} className={className}>
        <div className={avatarClass}>
          <Avatar/>
        </div>
        <div className={nameClass}>{item.username} #{item.place}</div>
        <div className={winningsClass}>{item.rewards}</div>
      </NavLink>
    );
  }

  render() {
    const topUsers = this.state.playersList.slice(0, 3);
    const sliceUsers = this.state.playersList.slice(3);

    return (
      <div className="container">
        <div className={style.home_page}>

          <main className={style.main_block}>
            <h1>{i18n.t('best_players')}</h1>

            <div className={cx(style.top_users, { [style.is_preloader_card]: this.state.isLoading })}>
              <Card
                defaultSorting={this.tournamentsDefaultSorting}
                items={topUsers}
                className={style.card}
                renderCard={this.renderTopUsers}
              />
            </div>

            <div className={cx(style.section, { [style.is_preloader_table]: this.state.isLoading })}>

              <Table
                captions={ratingTableCaptions}
                defaultSorting={this.tournamentsDefaultSorting}
                items={sliceUsers}
                className={style.card}
                renderRow={this.renderRow}
                isLoading={this.state.isLoading}
              />
            </div>

          </main>
        </div>
      </div>
    );
  }
}

export default Rating;
