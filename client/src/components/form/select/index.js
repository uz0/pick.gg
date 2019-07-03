import React from 'react';
import Select from 'react-select/async';
import classnames from 'classnames';

import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

const customStyles = {
  control: styles => ({ ...styles, backgroundColor: 'var(--primary-color)', border: 0 }),
  singleValue: styles => ({ ...styles, color: '#fff', fontSize: '15px', textTransform: 'capitalize' }),
  placeholder: styles => ({ ...styles, color: '#fff', fontSize: '15px' }),
  input: styles => ({ ...styles, color: '#fff', fontSize: '15px', textTransform: 'capitalize' }),
  indicatorSeparator: styles => ({ ...styles, width: 0 }),
  menu: styles => ({ ...styles, color: 'var(--primary-color)', fontSize: '15px', textTransform: 'capitalize' }),
};

const POSITIONS = ['adc', 'mid', 'top', 'jungle', 'support'];

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
        styles={customStyles}
        defaultOptions={positionsSelectConfig}
        defaultInputValue={props.field.value}
        className={style.select}
        placeholder={i18n.t('choose_position')}
        onChange={setField}
      />
    </div>
  );
};

export default PositionSelect;
