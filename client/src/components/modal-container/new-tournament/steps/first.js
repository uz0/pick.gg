import React from 'react';
import { Field } from 'formik';
import { FormInput } from 'components/form/input';
import style from '../style.module.css';

export default () => (
  <div className={style.main_info}>
    <Field
      component={FormInput}
      label="Tournament name"
      name="name"
      className={style.field}
    />

    <Field
      label="Tournament image link"
      name="image"
      component={FormInput}
      className={style.field}
    />

    <p className={style.subtitle}>Rules</p>

    <div className={style.rules_list}>
      <Field
        label="Kills"
        name="rule-kills"
        type="number"
        component={FormInput}
        className={style.rule}
      />

      <Field
        label="Deaths"
        name="rule-deaths"
        type="number"
        component={FormInput}
        className={style.rule}
      />

      <Field
        label="Assists"
        name="rule-assists"
        type="number"
        component={FormInput}
        className={style.rule}
      />
    </div>
  </div>
);
