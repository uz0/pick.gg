import React from 'react';
import { Link } from 'react-router-dom';

import style from './style.module.css';

import thumbDefault from '../../assets/tournament_thumbnail.jpg';

import moment from 'moment';
import i18n from 'i18next';

const TournamentCard = ({ _id, name, thumbnail, tournament, rules, users }) => {
  const tournamentDate = moment(tournament.date).format('DD MMM YYYY');

  let thumb = thumbDefault;

  if (thumbnail) {
    thumb = thumbnail;
  }

  const usersLength = users.length === 0 ? i18n.t('no_players') : users.length;

  const onError = item => {
    item.target.src = thumbDefault;
  };

  return (
    <Link key={_id} to={`/tournaments/${_id}`} className={style.card}>
      <div className={style.thumbnail}>
        <img src={thumb} alt="tournament thumbnail" onError={onError}/>
      </div>

      <div className={style.content}>
        <h3>{name}</h3>

        <div className={style.info}>
          <div className={style.label}>Rules</div>
          <div className={style.rules}>
          K<span>x</span>{rules[0].score}
          /D<span>x</span>{rules[1].score}
          /A<span>x</span>{rules[2].score}
          </div>
        </div>

        <div className={style.info}>
          <i className="material-icons">people</i>
          <div>{usersLength}</div>
        </div>

        <div className={style.info}>
          <i className="material-icons">access_alarms</i>
          <div>{tournamentDate}</div>
        </div>
      </div>
    </Link>
  );
};

export default TournamentCard;
