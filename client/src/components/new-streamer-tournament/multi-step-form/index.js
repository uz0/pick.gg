import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import Button from '../../button';

import GeneralStep from '../general';
import PlayersStep from '../players';
import MatchesStep from '../matches';

import NotificationService from 'services/notificationService';
import StreamerService from 'services/streamerService';
import UserService from 'services/userService';

import classnames from 'classnames';
import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

class MultiStepForm extends Component {
  constructor() {
    super();

    this.notificationService = new NotificationService();
    this.streamerService = new StreamerService();
    this.userService =  new UserService();
  }

  async componentDidMount() {
    const { user } = await this.userService.getMyProfile();

    this.setState({
      userId: user._id,
    })
  }

  state = {
    stepIndex: 1,
    name: '',
    thumbnail: '',
    entry: '',
    players: [],
    matches: [],
    rules: [],
    rulesValues: {},
  }

  nextStep = (payload) => {
    if(this.state.stepIndex === 3 ){
      return;
    }

    this.setState({
      ...payload,
      stepIndex: this.state.stepIndex + 1
    }, () => console.log(this.state));

  }

  prevStep = () => {
    if(this.state.stepIndex === 1){
      return;
    }

    this.setState({ stepIndex: this.state.stepIndex - 1 });
  }

  createTournament = async (tournamentMatches) => {
    const { name, userId, thumbnail, entry, players, rulesValues } = this.state;

    const playersIds = players.map(player => player._id);

    const payload = {
      name,
      entry,
      playersIds,
      matches: tournamentMatches,
      thumbnail,
      rulesValues,
      userId
    };

    const { fantasyTournament } = await this.streamerService.createTournament(payload);

    this.props.history.replace(`/tournaments/${fantasyTournament._id}`);
  }

  render() {
    const { stepIndex } = this.state;

    return <div className={style.form}>
      <div className={style.steps}>
        {`Step ${stepIndex} of 3`}
      </div>

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
    </div>;
  }
}

export default withRouter(MultiStepForm);