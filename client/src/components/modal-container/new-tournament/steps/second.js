import React from 'react';
import { useFormikContext } from 'formik';

import DefaultAvatar from 'assets/avatar-placeholder.svg';

import style from '../style.module.css';

const _players = [
  { _id: '1dsfdsfffwee', name: 'ADD', position: 'Top' },
  { _id: '2dsfdsfffwee', name: 'Aiming', position: 'Top' },
  { _id: '3dsfdsfffwee', name: 'Alphari', position: 'Top' },
  { _id: '4dsfdsfffwee', name: 'AmazingJ', position: 'Top' },
  { _id: '5dsfdsfffwee', name: 'Bang', position: 'Top' },
  { _id: '6dsfdsfffwee', name: 'Biubiu', position: 'Top' },
  { _id: '7dsfdsfffwee', name: 'Bjergsen', position: 'Top' },
  { _id: '8dsfdsfffwee', name: 'Broken', position: 'Top' },
  { _id: 'd11sfdsfffwee', name: 'Sangyoon', position: 'Top' },
  { _id: '22dsfdsfffwee', name: 'Selfmade', position: 'Top' },
  { _id: 'dsfdfdsfffwee', name: 'ShowMaker', position: 'Top' },
  { _id: 'dssdfdsfffwee', name: 'Santorin', position: 'Top' },
  { _id: 'ddfdsdsfdsfffwee', name: '369', position: 'Top' },
  { _id: 'dddfdsdsfdsfffwee', name: '169', position: 'Top' },
  { _id: 'dfdfdsdsfdsfffwee', name: '669', position: 'Top' },
];

export default () => {
  const { values } = useFormikContext();
  const { players } = values;
  return (
    <div className={style.main_players}>
      {
        players.length > 0 &&
        players.map(id => {
          const player = _players.find(({ _id }) => _id === id) || {};

          return (
            <div key={player._id} className={style.player}>
              <div className={style.image}>
                <img src={player.image || DefaultAvatar} alt="Avatar"/>
              </div>

              <p className={style.name}>{player.name}</p>
              <span className={style.position}>{player.position}</span>
            </div>
          );
        })
      }
    </div>
  );
};
