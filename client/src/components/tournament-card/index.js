import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as TrophyIcon } from '../../assets/trophy-cup.svg';

import classnames from 'classnames';
import style from './style.module.css';

import thumb_default from '../../assets/tournament_thumbnail.jpg';

import lck_thumb from '../../assets/tournaments-thumbnails/lck-thumb.jpg';
import lcs_thumb from '../../assets/tournaments-thumbnails/lcs-thumb.jpg';
import lpl_thumb from '../../assets/tournaments-thumbnails/lpl-thumb.jpg';

import moment from 'moment';

const cx = classnames.bind(style);

const TournamentCard = ({ _id, entry, name, thumbnail, tournament, rules, users  }) => {
  const tournamentPrize = users.length * entry;
  const tournamentDate = moment(tournament.date).format('DD MMM YYYY');
  const tournamentName = tournament.name.split(' ')[0];

  let thumb = thumb_default;

  if(thumbnail){
    thumb = thumbnail;
  }

  if(!thumbnail){
    switch(tournamentName){
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

  return (
    <Link to={`/tournaments/${_id}`} className={style.card}>
      <div className={style.thumbnail}>
        <img src={thumb} />
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
          <div>{users.length}</div>
        </div>
        <div className={style.info}>
          <i className="material-icons">attach_money</i>
          <div>${entry}</div>
        </div>
        <div className={style.info}>
          <TrophyIcon />
          <div>${tournamentPrize}</div>
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
