import React from 'react';
import { Link } from 'react-router-dom';

import style from './style.module.css';

import thumb_default from '../../assets/tournament_thumbnail.jpg';

import lck_thumb from '../../assets/tournaments-thumbnails/lck-thumb.jpg';
import lcs_thumb from '../../assets/tournaments-thumbnails/lcs-thumb.jpg';
import lpl_thumb from '../../assets/tournaments-thumbnails/lpl-thumb.jpg';

import moment from 'moment';
import i18n from 'i18next';

const TournamentCard = ({ _id, name, thumbnail, tournament, rules, users }) => {
  const tournamentDate = moment(tournament.date).format('DD MMM YYYY');
  const tournamentName = tournament.name.split(' ')[0];

  let thumb = thumb_default;

  if (thumbnail) {
    thumb = thumbnail;
  }

  if (!thumbnail) {
    switch (tournamentName) {
      case 'LCK':
        thumb = lck_thumb;
        break;
      case 'LCS':
        thumb = lcs_thumb;
        break;
      case 'LPL':
        thumb = lpl_thumb;
        break;
      default:
        break;
    }
  }

  const usersLength = users.length === 0 ? i18n.t('no_players') : users.length;

  const onError = item => {
    item.target.src = thumb_default;
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
