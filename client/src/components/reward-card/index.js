import React from 'react';
import { Link } from 'react-router-dom';

import trophie from 'assets/trophie2.png';

import style from './style.module.css';

const RewardCard = ({ description, key }) => {
  return <div className={style.card}>
    <div className={style.content}>
      <img src={trophie} alt='reward' />
      <h3 className={style.name}>{description}</h3>

      <Link to="#" className={style.claim}>Claim</Link>
    </div>
  </div>;
};

export default RewardCard;
