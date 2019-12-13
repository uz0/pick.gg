import React from 'react';
import compose from 'recompose/compose';
import classnames from 'classnames/bind';
import withHandlers from 'recompose/withHandlers';
import * as Yup from 'yup';
import { Form, Field, withFormik } from 'formik';

import Modal from 'components/modal';
import { FormInput } from 'components/form/input';

import style from './style.module.css';

const cx = classnames.bind(style);

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required'),

  color: Yup.string()
    .required('Required'),
});

const NewTeam = ({
  close,
  isSubmitting,
  submitForm,
  setColor,
  values,
}) => {
  const actions = [
    {
      type: 'submit',
      text: 'Create',
      appearance: '_basic-accent',
      disabled: isSubmitting,
      onClick: submitForm,
    },
  ];

  return (
    <Modal
      title="Create new team"
      close={close}
      className={style.modal_content}
      actions={actions}
    >
      <Form className={style.form}>
        <Field
          component={FormInput}
          label="Name"
          name="name"
          className={style.field}
        />

        <label className={style.color_label}>Color</label>

        <div className={style.colors_list}>
          <button
            type="button"
            className={cx('red', { '_is-active': values.color === 'red' })}
            onClick={() => setColor('red')}
          />

          <button
            type="button"
            className={cx('blue', { '_is-active': values.color === 'blue' })}
            onClick={() => setColor('blue')}
          />

          <button
            type="button"
            className={cx('grey', { '_is-active': values.color === 'grey' })}
            onClick={() => setColor('grey')}
          />

          <button
            type="button"
            className={cx('black', { '_is-active': values.color === 'black' })}
            onClick={() => setColor('black')}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default compose(
  withFormik({
    validationSchema,

    mapPropsToValues: () => ({
      name: '',
      color: 'red',
    }),

    handleSubmit: async (values, formikBag) => {
      console.log(values);
      console.log(formikBag);
    },
  }),

  withHandlers({
    setColor: props => color => props.setFieldValue('color', color),
  }),
)(NewTeam);
