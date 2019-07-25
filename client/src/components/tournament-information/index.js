import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import compose from 'recompose/compose';
import get from 'lodash/get';
import Icon from 'components/icon';
import style from './style.module.css';

const cx = classnames.bind(style);

const Information = props => {
  const creator = get(props, 'tournament.creator');
  const createdAt = moment(get(props, 'tournament.createdAt', '')).format('MMM DD, h:mm');
  const description = get(props, 'tournament.description');
  const price = get(props, 'tournament.price');
  const url = get(props, 'tournament.url');

  return (
    <div className={cx(style.information, className)}>
      <div className={style.header}>
        <h3 className={style.subtitle}>Information</h3>
        <button
          type="button"
          className={style.button}
          onClick={props.editTournament}
        >
          Edit
        </button>
      </div>

      <div className={style.content}>
        <div className={style.info}>
          <div className={style.item}>
            <div className={style.key}>Created at:</div>
            <div className={style.value}>{createdAt}</div>
          </div>

          <div className={style.item}>
            <div className={style.key}>Creator: </div>
            <div className={style.value}>
              <Link className={style.creator} to={`/user/${creator._id}`}>
                {creator.username}<Icon name="star"/>
              </Link>
            </div>
          </div>

          <div className={style.item}>
            <div className={style.key}>Stream link:</div>
            <div className={style.value}>
              <a target="blank" href={url}>link</a>
            </div>
          </div>

          <div className={style.item}>
            <div className={style.key}>Price:</div>
            <div className={style.value}>{`$ ${price}`}</div>
          </div>
        </div>

        <div className={style.description}>
          <p className={style.text}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.id],
    }),
  ),
)(Information);
