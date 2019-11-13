import React from 'react';
import { Form, Field } from 'formik';
import * as Yup from 'yup';

import { FormInput } from 'components/form/input';

import style from './style.module.css';

export const validationSchema = Yup.object().shape({
  kills: Yup.number()
    .min(0)
    .max(50)
    .required('Required'),
  place: Yup.number()
    .min(1)
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
        max="50"
      />
      <Field
        component={FormInput}
        className={style.field}
        label="Place"
        name="place"
        type="number"
        min="1"
        max="10"
      />
    </Form>
  );
};

export const defaultRules = {
  kills: 0,
  place: 1,
};
