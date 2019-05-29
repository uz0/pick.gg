import React, { Component } from 'react';
import RewardCard from 'components/reward-card';
import Preloader from 'components/preloader';

import UserService from 'services/userService';

import style from './style.module.css';

class Rewards extends Component {
  constructor(){
    super();
    this.userService = new UserService();
  }

  state = {
    rewards: [],
    isLoading: true,
  }

  async componentDidMount(){
    const { rewards } = await this.userService.getUserRewards();

    this.setState({
      rewards,
      isLoading: false,
    });
  }

  render() {
    return <div className={style.rewards}>
      {this.state.isLoading && <Preloader />}

      {this.state.rewards.length === 0 && <p className={style.no_rewards}>
        You haven't received any rewards yet
      </p>}

      {this.state.rewards.length > 0 && this.state.rewards.map(({ key, description, isClaimed }) => <RewardCard
        key={key}
        rewardKey={key}
        description={description}
        isClaimed={isClaimed}
      />)}
    </div>;
  }
}

export default Rewards;