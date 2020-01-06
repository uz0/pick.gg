import classnames from 'classnames';
import React from 'react';
import Select from 'react-select';
import compose from 'recompose/compose';

import withStyles from '../hoc/with-styles';
import style from './style.module.css';

const cx = classnames.bind(style);

const enhance = compose(
  withStyles,
);

const FormikSelect = props => {
  const selectValue = {
    label: props.field.value,
    value: props.field.value,
  };

  const error = props.form.errors[props.field.name];

  const setField = ({ value }) => {
    props.form.setFieldValue(props.field.name, value);
  };

  return (
    <div className={cx(style.wrapper, props.className)}>
      <label className={style.caption}>{props.label}</label>
      <Select
        {...props}
        {...props.field}
        value={selectValue}
        options={props.defaultOptions}
        className={style.select}
        placeholder={props.placeholder}
        onChange={setField}
      />

      {error &&
        <p className={style.error}>{error}</p>
      }
    </div>
  );
};

export default enhance(FormikSelect);
