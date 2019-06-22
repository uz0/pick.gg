import React, { Component } from 'react';
import RewardCard from 'components/reward-card';
import Preloader from 'components/preloader';

import UserService from 'services/user-service';

import style from './style.module.css';
import i18n from 'i18next';

class Rewards extends Component {
  constructor() {
    super();
    this.userService = new UserService();
  }

  state = {
    rewards: [],
    isLoading: true,
  }

  async componentDidMount() {
    const { rewards } = await this.userService.getUserRewards();

    this.setState({
      rewards,
      isLoading: false,
    });
  }

  render() {
    return (
      <div className="container">
        <div className={style.rewards}>
          {this.state.isLoading && <Preloader/>}

          {this.state.rewards.length === 0 ? (
            <p className={style.no_rewards}>
              {i18n.t('no_rewards')}
            </p>
          ) : (
            this.state.rewards.map(({ key, description, isClaimed }) => (
              <RewardCard
                key={key}
                rewardKey={key}
                description={description}
                isClaimed={isClaimed}
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Rewards;
