import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Trophy } from 'assets/trophy.svg';

import style from './style.module.css';

const RewardCard = ({ description }) => {
  return <div className={style.card}>
    <div className={style.content}>
      <Trophy className={style.reward}/>
      <h3 className={style.name}>{description}</h3>

      <Link to='#' className={style.claim}>Claim</Link>
    </div>
  </div>;
};

export default RewardCard;
