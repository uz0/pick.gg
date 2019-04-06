import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { ReactComponent as AvatarPlaceholder } from 'assets/avatar-placeholder.svg';
import Preloader from 'components/preloader';
import Table from 'components/table';

import UserService from 'services/userService';

import style from './style.module.css';
import i18n from 'i18n';

const ratingTableCaptions = {
  place: {
    text: '#',
    width: window.innerWidth < 480 ? 50 : 40,
  },

  // avatar: {
  //   text: '',
  //   width: 100,
  // },

  username: {
    text: i18n.t('name'),
    width: window.innerWidth < 480 ? 150 : 350,
  },

  winning: {
    text: i18n.t('amount'),
    width: window.innerWidth < 480 ? 80 : 150,
  },
};

class Rating extends Component {
  constructor() {
    super();
    this.userService = new UserService();
    this.state = {
      playersList: [],
      loader: true,
    };
  }

  preloader = () =>
    this.setState({
      loader: false,
    })

  componentDidMount = async () => {
    let rating = await this.userService.getUsersRating();
    rating.rating.forEach((item, index) => item.place = index + 1);

    this.setState({ playersList: rating.rating });
    this.preloader();
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    let Avatar = () => this.props.photo ? <img src={this.props.photo} alt="userpic" /> : <AvatarPlaceholder />;
    { console.log(item) }
    return <NavLink to={`/user/${item._id}`} className={className} key={item._id}>
      <div className={itemClass} style={{ '--width': ratingTableCaptions.place.width }}>
        <span className={textClass}>{item.place}</span>
      </div>

      {/* <div className={itemClass} style={{ '--width': ratingTableCaptions.avatar.width }}>
        <span className={textClass}><AvatarPlaceholder/></span>
      </div> */}

      <div className={itemClass} style={{ '--width': ratingTableCaptions.username.width }}>
        <span className={textClass}>{item.username}</span>
      </div>

      <div className={itemClass} style={{ '--width': ratingTableCaptions.winning.width }}>
        <span className={textClass}>${item.winning}</span>
      </div>
    </NavLink>;
  }

  render() {
    let Avatar = () => this.props.photo ? <img src={this.props.photo} alt="userpic" /> : <AvatarPlaceholder />;
    return (
      <div className={style.home_page}>
        {this.state.loader && <Preloader />}

        <main className={style.main_block}>
          <h1>{i18n.t('best_players')}</h1>

          <div className={style.section}>
            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={this.state.playersList}
              className={style.table}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
              emptyMessage={i18n.t('there_is_no_tournaments_yet')}
            />
          </div>

          {this.state.isLoading &&
            <Preloader />
          }
        </main>
      </div >
    );
  }
}

export default Rating;