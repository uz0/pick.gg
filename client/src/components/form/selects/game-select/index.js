import classnames from 'classnames';
import React from 'react';
import Select from 'react-select/async';
import compose from 'recompose/compose';

import { GAMES } from 'constants/index';

import i18n from 'i18n';

import withStyles from '../hoc/with-styles';
import style from './style.module.css';

const cx = classnames.bind(style);

const enhance = compose(
  withStyles,
);

const positionsSelectConfig = GAMES.map(game => ({
  value: game,
  label: game,
}));

const GameSelect = props => {
  const setField = ({ label, value }) => {
    props.form.setFieldValue('game', { label, value });
  };

  const errorGame = props.form.errors.game;

  return (
    <div className={cx('wrapper', props.className)}>
      <label className={style.caption}>Game</label>
      <Select
        {...props}
        {...props.field}
        defaultOptions={positionsSelectConfig}
        defaultInputValue={props.field.value}
        className={style.select}
        placeholder={i18n.t('choose_game')}
        onChange={setField}
      />
      {errorGame &&
        <p className={style.error}>{errorGame}</p>
      }
    </div>
  );
};

export default enhance(GameSelect);
