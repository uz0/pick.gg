/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import get from 'lodash/get';
// import showdown from 'showdown';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';

import Icon from 'components/icon';
import Control from 'components/tournament-information/controls';
import StatusControl from 'components/tournament-information/controls/status-control';

import { getUserPermissions, getTournamentStatus } from 'helpers';

import style from './style.module.css';

// const converter = new showdown.Converter();

const cx = classnames.bind(style);

const Information = props => {
  const [isFullDescriptionShown, toggleDescription] = useState(false);

  const { rules, rewards, description } = get(props, 'tournament');

  const { isCurrentUserCanEdit } = getUserPermissions(props.currentUser, props.tournament);

  const rulesAction = () => rules ? props.editRules(isCurrentUserCanEdit) : props.addRules(isCurrentUserCanEdit);
  const rewardsAction = () => rewards ? props.editRewards(isCurrentUserCanEdit) : props.addRewards(isCurrentUserCanEdit);
  const statusControlAction = () => props.history.push('/faq');

  // const shortDescription = description.substr(0, 255);
  const readMoreText = isFullDescriptionShown ? 'Скрыть' : '...Подробнее';

  const tournamentStatus = getTournamentStatus(props.tournament);

  return (
    <div className={cx(style.information, props.className)}>
      <div className={style.controls}>
        <StatusControl status={tournamentStatus} onClick={statusControlAction}/>
        <Control onClick={rewardsAction}>
          <Icon name="trophy"/>
        </Control>
        <Control onClick={rulesAction}>
          {props.tournament.rulesTitle || 'SET ME'}
        </Control>
      </div>
      <div className={style.description}>
        {/*
          {!isFullDescriptionShown && <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(shortDescription) }}/>}
          {isFullDescriptionShown && <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(description) }}/>}
        */}

        <h1>Привет, это заголовок h1</h1>
        <h2>Привет, это заголовок h2</h2>
        <h3>Привет, это заголовок h3</h3>
        <h4>Привет, это заголовок h4</h4>
        <h5>Привет, это заголовок h5</h5>
        <p>А это текст, предложение и тд. Короче прикинь, это длинное предложение. На несколько строк. Неймоверно. Как это вообще возможно?</p>
        <p>А это короткий абзац</p>
        <p>А это короткий абзац <a href="#">со вложенной ссылкой</a></p>

        <h1>Турнир по LOL</h1>
        <h2>Правила</h2>
        <p>Игра в формате Personal Perfomance</p>
        <p>Что это значит? Будет три игры бла бла бла бла блабла бла бла блабла бла бла блабла бла бла блабла бла бла блабла бла бла бла</p>
        <p>Тот, кто больше набрал - победил</p>
        <h2>Участники</h2>
        <h4>Игроки</h4>

        <p>
          <a href="#">Костя Трембовецкий</a>
        </p>

        <p>
          <a href="#">Валик Михиенко</a>
        </p>

        <p>
          <a href="#">Вова Шумко</a>
        </p>

        <h4>Зрители</h4>

        <p>
          <a href="#">Оксана Марченко</a>
        </p>

        <p>
          <a href="#">Настя</a>
        </p>

        <p>
          <a href="#">Потап</a>
        </p>

        {description.length >= 255 && (
          <div
            className={style.readmore}
            onClick={() => toggleDescription(!isFullDescriptionShown)}
          >
            {readMoreText}
          </div>
        )}
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      currentUser: state.currentUser,
      tournament: state.tournaments.list[props.id],
    }),
  ),

  withRouter,
)(Information);
