import React from 'react';
import { ReactComponent as Trophy } from 'assets/trophy.svg';
import NotificationService from 'services/notificationService';

import classnames from 'classnames';
import style from './style.module.css';

const cx = classnames.bind(style);

const RewardCard = ({ description, rewardKey, isClaimed }) => {
  const notificationService = new NotificationService();

  const copyRewardCode = async rewardKey => {
    await navigator.clipboard.writeText(rewardKey);

    notificationService.showSingleNotification({
      type: 'success',
      message: 'Reward code is copied',
    });
  };

  return (
    <div className={cx(style.card, { is_claimed: isClaimed })}>
      <div className={style.content}>
        <Trophy className={style.reward}/>
        <h3 className={style.name}>{description}</h3>

        <button className={style.claim} onClick={e => copyRewardCode(rewardKey)}>
          {rewardKey}
        </button>
      </div>
    </div>
  );
};

export default RewardCard;
