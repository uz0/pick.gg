import React from 'react';
import style from './style.module.css';
import { ReactComponent as AddPlayerIcon } from '../../assets/add-player.svg';
import i18n from '../../i18n';

const ChooseChampionCard = ({ onClick }) => {
  return (
    <div className={style.card} onClick={onClick}>
      <AddPlayerIcon/>
      {i18n.t('add_player')}
    </div>
  );
};

export default ChooseChampionCard;
