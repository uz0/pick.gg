import React, { Component } from 'react';
import RewardCard from 'components/reward-card';

import style from './style.module.css';

class Rewards extends Component {
  render() {
    return <div className={style.rewards}>
      <RewardCard />
      <RewardCard />
      <RewardCard />
    </div>;
  }
}

export default Rewards;