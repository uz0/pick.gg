import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as TrophyIcon } from '../../assets/trophy-cup.svg';

import classnames from 'classnames';
import style from './style.module.css';

import thumbnail from '../../assets/tournament_thumbnail.jpg';

import moment from 'moment';

const cx = classnames.bind(style);

const TournamentCard = ({ _id, entry, name, tournament, rules, users  }) => {
  const tournamentPrize = users.length * entry;
  const tournamentDate = moment(tournament.date).format('DD MMM YYYY')

  return (
    <Link to={`/tournaments/${_id}`} className={style.card}>
      <div className={style.thumbnail}>
        <img src={thumbnail} />
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
