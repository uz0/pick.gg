import React from 'react';
import classnames from 'classnames/bind';
import Icon from 'components/icon';
import style from './style.module.css';

const cx = classnames.bind(style);

const TournamentCard = ({ name, dateDay, dateMonth, people, price, className }) => {
  return (
    <div className={cx('card', className)}>
      <div className={style.content}>
        <div className={style.date}>
          <span className={style.month}>{dateMonth}</span>

          <span className={style.day}>{dateDay}</span>
        </div>

        <div style={style.basic}>
          <h4 className={style.name}>{name}</h4>

          <div className={style.info}>
            <Icon name="people"/>
            <p className={style.value}>{people}</p>
          </div>

          <div className={style.info}>
            <Icon name="coin"/>
            <p className={style.value}>{price}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TournamentCard;
