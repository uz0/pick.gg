import React from 'react';
import classnames from 'classnames/bind';

import defaultBackground from 'assets/play-with.jpg';

import Icon from 'components/icon';

import style from './style.module.css';

const cx = classnames.bind(style);

const TournamentCard = ({ name, dateDay, dateMonth, people, className, imageUrl, description }) => {
  const isBackground = imageUrl ? imageUrl : defaultBackground;
  return (
    <div style={{ backgroundImage: `url(${isBackground})` }} className={cx('card', className)}>
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

        <div style={style.basic}>
          <h4 className={style.name}>{name}</h4>
          <p className={style.description}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
