import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import GeneralStep from '../general';
import PlayersStep from '../players';
import MatchesStep from '../matches';
import Preloader from 'components/preloader';

import NotificationService from 'services/notification-service';
import StreamerService from 'services/streamer-service';
import UserService from 'services/user-service';

import classnames from 'classnames';
import style from './style.module.css';

const cx = classnames.bind(style);

class MultiStepForm extends Component {
  constructor() {
    super();

    this.notificationService = new NotificationService();
    this.streamerService = new StreamerService();
    this.userService = new UserService();
  }

  async componentDidMount() {
    const { user } = await this.userService.getMyProfile();

    this.setState({
      userId: user._id,
    });
  }

  state = {
    stepIndex: 1,
    name: '',
    thumbnail: '',
    players: [],
    rulesValues: {},
    isLoading: false,
  }

  nextStep = payload => {
    if (this.state.stepIndex === 3) {
      return;
    }

    this.setState(prevState => ({
      ...payload,
      stepIndex: prevState.stepIndex + 1,
    }));
  }

  prevStep = () => {
    if (this.state.stepIndex === 1) {
      return;
    }

    this.setState(prevState => ({ stepIndex: prevState.stepIndex - 1 }));
  }

  createTournament = async tournamentMatches => {
    this.setState({ isLoading: true });

    const { name, userId, thumbnail, players, rulesValues } = this.state;

    const playersIds = players.map(player => player._id);

    this.setState({ isLoading: false });
  }

  render() {
    const { stepIndex } = this.state;

    return (
      <div className={style.form}>

        {this.state.isLoading &&
          <Preloader isFullScreen={false}/>
        }

        <div className={style.content}>
          <div className={cx(style.step, { [style.isActive]: stepIndex === 1 })}>
            <GeneralStep
              nextStep={this.nextStep}
            />
          </div>

          <div className={cx(style.step, { [style.isActive]: stepIndex === 2 })}>
            <PlayersStep
              nextStep={this.nextStep}
              prevStep={this.prevStep}
            />
          </div>

          <div className={cx(style.step, { [style.isActive]: stepIndex === 3 })}>
            <MatchesStep
              prevStep={this.prevStep}
              createTournament={this.createTournament}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MultiStepForm);
