import React from 'react';
import classnames from 'classnames/bind';

import Modal from 'components/modal';
import Avatar from 'components/avatar';

import style from './style.module.css';

const cx = classnames.bind(style);

const PlayerInfo = props => {
  const {
    nickname,
    game,
    gameSpecificName,
    position,
    imageUrl,
    about,
    points,
  } = props.options.playerInfo;

  return (
    <Modal
      title="Player info"
      close={props.close}
      className={cx(style.modal_content)}
      wrapClassName={style.wrapper}
    >
      <div className={style.player}>
        <div className={style.meta}>
          <Avatar source={imageUrl} className={style.avatar}/>
          <div className={style.info}>
            <div className={style.name}>
              {nickname || gameSpecificName[game]}
            </div>
            {about && <div className={style.about}>{about}</div>}
          </div>
        </div>

        <div className={style.statistics}>
          {position && (
            <div className={style.item}>
              <div className={style.key}>Позиция в турнире:</div>
              <div className={style.value}>{position}</div>
            </div>
          )}

          {points > 0 && (
            <div className={style.item}>
              <div className={style.key}>Очки за текущий турнир:</div>
              <div className={style.value}>{points}</div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PlayerInfo;
