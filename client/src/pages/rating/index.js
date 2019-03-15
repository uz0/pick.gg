import React, { Component } from 'react';
import { ReactComponent as AvatarPlaceholder } from '../../assets/avatar-placeholder.svg';

import Preloader from '../../components/preloader';

import AuthService from '../../services/authService';
import TournamentService from '../../services/tournamentService';
import UserService from '../../services/userService';

import { NavLink } from 'react-router-dom';
import uuid from 'uuid';
import style from './style.module.css';
import i18n from 'i18n';

class Rating extends Component {
  constructor() {
    super();
    this.AuthService = new AuthService();
    this.UserService = new UserService();
    this.TournamentService = new TournamentService();
    this.state = {
      playersList: [],
      loader: true,
    };
  }

  preloader = () =>
    this.setState({
      loader: false,
    })

  componentDidMount = async() => {
    let rating = await this.UserService.getUsersRating();
    rating.rating.forEach((item, index) => item.place = index + 1);

    this.setState({ playersList: rating.rating });
    this.preloader();
  }
  
  render() {
    let Avatar = () => this.props.avatar ? <img src={this.props.avatar} alt="userpic"/> : <AvatarPlaceholder />;
    return (
      <div className={style.home_page}>
        {this.state.loader && <Preloader />}

        <main className={style.main_block}>
          <h1>{i18n.t('best_players')}</h1>
          
          <div className={style.content}>
            <div className={style.header_table}>
              <div className={style.number_header}>#</div>
              <div className={style.name_header}>{i18n.t('name')}</div>
              <div className={style.percent_header}>$</div>
            </div>

            {this.state.playersList.map(item => (
              <NavLink key={uuid()} className={style.item_table} to={`/user/${item._id}`}>
                <div>{item.place}.</div>
                
                <div className={style.avatar_table}>
                  <Avatar avatar=""/>
                </div>
                
                <div className={style.name_table}>{item.username}</div>
                <div className={style.name_table}>${item.winning}</div>
              </NavLink>
            ))}
          </div>
        </main>
      </div>
    );
  }
}

export default Rating;