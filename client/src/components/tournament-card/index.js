/* eslint-disable react/no-danger */
import React from 'react';
import classnames from 'classnames/bind';
import showdown from 'showdown';

import Icon from 'components/icon';

import i18n from 'i18next';

import style from './style.module.css';

const cx = classnames.bind(style);
const converter = new showdown.Converter();

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
            <div className={style.icon} aria-label={i18n.t(status)}>
              <Icon name="battle"/>
            </div>
            <h4 className={style.name}>{name}</h4>
          </div>

          {description &&
            <p className={style.description} dangerouslySetInnerHTML={{ __html: converter.makeHtml(description) }}/>
          }
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
