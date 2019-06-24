import React from 'react';
import { ReactComponent as Trophy } from 'assets/trophy.svg';

import classnames from 'classnames';
import style from './style.module.css';

const cx = classnames.bind(style);

const RewardCard = ({ description, rewardKey, isClaimed, onClick }) => {
  const copyRewardCode = async rewardKey => {
    await navigator.clipboard.writeText(rewardKey);
  };

  return (
    <div
      className={cx(style.card, { isClaimed })}
      onClick={onClick}
    >
      <div className={style.content}>
        <Trophy className={style.reward}/>
        <h3 className={style.name}>{description}</h3>

        <button
          type="button"
          className={style.claim}
          onClick={() => copyRewardCode(rewardKey)}
        >
          {rewardKey}
        </button>
      </div>
    </div>
  );
};

export default RewardCard;
