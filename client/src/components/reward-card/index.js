import React from 'react';
import { ReactComponent as Trophy } from 'assets/trophy.svg';
<<<<<<< HEAD
=======
import NotificationService from 'services/notification-service';
>>>>>>> 0155d55f5442a8216c23abd95ffc35595b38be0b

import classnames from 'classnames';
import style from './style.module.css';

const cx = classnames.bind(style);

<<<<<<< HEAD
const RewardCard = ({ description, rewardKey, isClaimed, onClick }) => {
=======
const RewardCard = ({ description, rewardKey, isClaimed }) => {
  const notificationService = new NotificationService();

>>>>>>> 0155d55f5442a8216c23abd95ffc35595b38be0b
  const copyRewardCode = async rewardKey => {
    await navigator.clipboard.writeText(rewardKey);
  };

  return (
<<<<<<< HEAD
    <div
      className={cx(style.card, { isClaimed })}
      onClick={onClick}
    >
=======
    <div className={cx(style.card, { isClaimed })}>
>>>>>>> 0155d55f5442a8216c23abd95ffc35595b38be0b
      <div className={style.content}>
        <Trophy className={style.reward}/>
        <h3 className={style.name}>{description}</h3>

<<<<<<< HEAD
        <button
          type="button"
          className={style.claim}
          onClick={() => copyRewardCode(rewardKey)}
        >
=======
        <button type="button" className={style.claim} onClick={() => copyRewardCode(rewardKey)}>
>>>>>>> 0155d55f5442a8216c23abd95ffc35595b38be0b
          {rewardKey}
        </button>
      </div>
    </div>
  );
};

export default RewardCard;
