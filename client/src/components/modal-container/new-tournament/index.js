import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ym from 'react-yandex-metrika';
import compose from 'recompose/compose';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

import { http } from 'helpers';

import Modal from 'components/modal';
import { FormInput } from 'components/form/input';

import modalActions from '../actions';
import i18n from 'i18n';
import moment from 'moment';

import style from './style.module.css';

const date = new Date();

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4)
    .max(60)
    .required('Required'),
  description: Yup.string()
    .min(4)
    .max(120)
    .required('Required'),
  url: Yup.string()
    .max(200)
    .required('Required')
    .url(i18n.t('new_tournament.enter_valid_url')),
  imageUrl: Yup.string()
    .required(),
  price: Yup.string()
    .min(0)
    .required(),
  startAt: Yup.date()
    .min(date, `Tournament date should be after: ${moment(date).format('DD MMM')}`)
    .required('Required'),
});

const today = moment().format('YYYY-MM-DD');

const NewTournament = props => {
  return (
    <Modal
      title="Create new tournament"
      close={props.close}
      wrapClassName="align-modal-center"
      className={style.modal_content}
      actions={[{
        type: 'submit',
        text: 'Create tournament',
        appearance: '_basic-accent',
        disabled: props.isSubmitting,
        onClick: props.submitForm,
      }]}
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
          label="Image tournament (500x150)"
          name="imageUrl"
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
          min={today}
          className={style.field}
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
      imageUrl: '',
      price: 0,
      startAt: today,
    }),
    handleSubmit: async (values, formikBag) => {
      const createTournamentRequest = async () => {
        try {
          const request = await http('/api/tournaments', {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': localStorage.getItem('JWS_TOKEN'),
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

      ym('reachGoal', 'tournament_created');

      formikBag.props.history.push(`/tournaments/${newTournament._id}`);

      formikBag.props.close();
    },
  }),
);

export default enhance(NewTournament);

