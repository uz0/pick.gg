import React from 'react';
import classnames from 'classnames/bind';
import Icon from 'components/icon';
import thumb from 'assets/tournament_thumbnail.jpg';
import style from './style.module.css';

const cx = classnames.bind(style);

const TournamentCard = ({ name, date, people, className }) => {
  return (
    <div className={cx('card', className)}>
      <div className={style.image}>
        <img src={thumb} alt="Tournament"/>
      </div>

      <div className={style.content}>
        <h4 className={style.name}>{name}</h4>

        {false && (
          <div className={style.info}>
            <span className={style.name}>Rules</span>
            <p className={style.value}>k1 d0</p>
          </div>
        )}

        <div className={style.info}>
          <Icon name="people"/>
          <p className={style.value}>{people}</p>
        </div>

        <div className={style.info}>
          <Icon name="alarm"/>
          <p className={style.value}>{date}</p>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
