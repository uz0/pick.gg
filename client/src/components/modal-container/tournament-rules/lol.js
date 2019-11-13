import React from 'react';
import { Form, Field } from 'formik';
import * as Yup from 'yup';

import { FormInput } from 'components/form/input';

import style from './style.module.css';

export const validationSchema = Yup.object().shape({
  kills: Yup.number()
    .min(0)
    .max(10)
    .required('Required'),
  deaths: Yup.number()
    .min(0)
    .max(10)
    .required('Required'),
  assists: Yup.number()
    .min(0)
    .max(10)
    .required('Required'),
});

export const RulesForm = () => {
  return (
    <Form>
      <Field
        component={FormInput}
        className={style.field}
        label="Kills"
        name="kills"
        type="number"
        min="0"
        max="10"
      />

      <Field
        component={FormInput}
        className={style.field}
        label="Deaths"
        name="deaths"
        type="number"
        min="0"
        max="10"
      />

      <Field
        component={FormInput}
        className={style.field}
        label="Assists"
        name="assists"
        type="number"
        min="0"
        max="10"
      />
    </Form>
  );
};

export const defaultRules = {
  kills: 0,
  deaths: 0,
  assists: 0,
};
