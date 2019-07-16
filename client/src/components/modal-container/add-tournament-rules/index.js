import React from 'react';
import { connect } from 'react-redux';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

import { FormInput } from 'components/form/input';
import Modal from 'components/modal';

import style from './style.module.css';
import { compose } from 'recompose';
import { actions as tournamentsActions } from 'pages/tournaments';

const validationSchema = Yup.object().shape({
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

const AddRules = props => {
  return (
    <Modal
      title="Add tournament rules"
      close={props.close}
      className={style.modal_content}
      wrapClassName={style.wrapper}
      actions={[
        {
          text: 'Add',
          type: 'button',
          appearance: '_basic-accent',
          onClick: props.submitForm,
        },
      ]}
    >
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
    </Modal>
  );
};

const enhance = compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.options.tournamentId],
    }),

    {
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withFormik({
    validationSchema,
    mapPropsToValues: () => ({
      kills: 0,
      deaths: 0,
      assists: 0,
    }),
    handleSubmit: (values, { props }) => {
      props.updateTournament({
        _id: props.options.tournamentId,
        rules: values,
      });

      props.close();
    },
  })
);

export default enhance(AddRules);
