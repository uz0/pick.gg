import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

import { http } from 'helpers';

import Modal from 'components/modal';
import { FormInput } from 'components/form/input';
import Button from 'components/button';

import modalActions from '../actions';
import i18n from 'i18n';

import style from './style.module.css';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(40)
    .required('Required'),
  description: Yup.string()
    .max(120)
    .required('Required'),
  url: Yup.string()
    .max(200)
    .required('Required')
    .url(i18n.t('new_tournament.enter_valid_url')),
  price: Yup.string()
    .min(0)
    .required(),
  startAt: Yup.date()
    .required('Required'),
});

const NewTournament = props => {
  return (
    <Modal
      title="Create new tournament"
      close={props.close}
      wrapClassName="align-modal-center"
      className={style.modal_content}
    >
      <Form className={style.form}>
        <Field
          component={FormInput}
          label="Name"
          name="name"
          className={style.field}
        />

        <Field
          component={FormInput}
          label="Description"
          name="description"
          className={style.field}
        />

        <Field
          component={FormInput}
          label="Stream link"
          name="url"
          className={style.field}
        />

        <Field
          component={FormInput}
          label="Price"
          name="price"
          className={style.field}
        />

        <Field
          component={FormInput}
          type="date"
          label="Date"
          name="startAt"
          className={style.field}
        />
        <Button
          type="submit"
          text="Create tournament"
          appearance="_basic-accent"
        />
      </Form>
    </Modal>
  );
};

const enhance = compose(
  withRouter,
  connect(
    null,

    {
      toggleModal: modalActions.toggleModal,
    }
  ),
  withFormik({
    validationSchema,
    mapPropsToValues: () => ({
      name: '',
      description: '',
      url: '',
      price: 0,
      startAt: '',
    }),
    handleSubmit: async (values, formikBag) => {
      const createTournamentRequest = async () => {
        try {
          const request = await http('/api/tournaments', {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(values),
          });

          return request.json();
        } catch (error) {
          console.log(error);
        }
      };

      const { newTournament } = await createTournamentRequest();

      formikBag.props.history.push(`/tournaments/${newTournament._id}`);

      formikBag.props.close();
    },
  }),
);

export default enhance(NewTournament);

