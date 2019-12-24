import classnames from 'classnames';
import React from 'react';
import Select from 'react-select/async';
import compose from 'recompose/compose';

import { POSITIONS } from 'constants/index';

import i18n from 'i18n';

import withStyles from '../hoc/with-styles';
import style from './style.module.css';

const cx = classnames.bind(style);

const enhance = compose(
  withStyles,
);

const positionsSelectConfig = POSITIONS.map(position => ({
  value: position,
  label: position,
}));

const PositionSelect = props => {
  const setField = ({ label, value }) => {
    props.form.setFieldValue('preferredPosition', { label, value });
  };

  return (
    <div className={cx('wrapper', props.className)}>
      <label className={style.caption}>Position</label>
      <Select
        {...props}
        {...props.field}
        defaultOptions={positionsSelectConfig}
        defaultInputValue={props.field.value}
        className={style.select}
        placeholder={i18n.t('choose_position')}
        onChange={setField}
      />
    </div>
  );
};

export default enhance(PositionSelect);