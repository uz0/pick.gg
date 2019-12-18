import React from 'react';
import classnames from 'classnames/bind';

import SwordIcon from 'assets/icons/battle_flat.svg';

import Icon from 'components/icon';

import style from './style.module.css';

const cx = classnames.bind(style);

const TournamentCard = ({ name, dateDay, dateMonth, people, className, imageUrl, description, status }) => {

  return (
    <div style={{ backgroundImage: `url(${imageUrl})` }} className={cx('card', className)}>
      <div className={style.content}>
        <div>
          <div className={style.date}>
            <span className={style.month}>{dateMonth}</span>
            <span className={style.day}>{dateDay}</span>
          </div>

          <div className={style.info}>
            <Icon name="people"/>
            <p className={style.value}>{people}</p>
          </div>
        </div>

        <div className={style.basic}>
          <div className={style.header}>
            <div className={style.icon} aria-label={status}>
              <img src={SwordIcon}/>
            </div>
            <h4 className={style.name}>{name}</h4>
          </div>

          <p className={style.description}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
