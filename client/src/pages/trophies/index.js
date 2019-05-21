import React, { Component } from 'react';

import io from 'socket.io-client';

import TrophiesCard from 'components/card-trophies';

import NotificationService from 'services/notificationService';

import style from './style.module.css';
// import classnames from 'classnames/bind';

// const cx = classnames.bind(style);

class Trophies extends Component {
  constructor() {
    super();
    this.socket = io();

    this.notificationService = new NotificationService();
  }

  state = {
    isLoading: false,


  };

  async componentDidMount() {

  }



  render() {
    return <div className={style.trophies}>
      <TrophiesCard />
      <TrophiesCard />
      <TrophiesCard />
    </div>;
  }
}

export default Trophies;