import React from 'react';
import { connect } from 'react-redux';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

import { FormInput } from 'components/form/input';
import Modal from 'components/modal';

import { http } from 'helpers';

import style from './style.module.css';
import { compose } from 'recompose';
import { actions as tournamentsActions } from 'pages/tournaments';
import i18n from 'i18n';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
});

const Match = props => {
  return (
    <Modal
      title={i18n.t('add_match')}
      close={props.close}
      className={style.modal_content}
      wrapClassName={style.wrapper}
      actions={[
        {
          text: i18n.t('add'),
          type: 'submit',
          appearance: '_basic-accent',
          onClick: props.submitForm,
          disabled: props.isSubmitting,
        },
      ]}
    >
      <Form>
        <Field
          component={FormInput}
          label={i18n.t('match_name')}
          name="name"
          className={style.field}
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
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (values, { props }) => {
      const { tournamentId } = props.options;

      try {
        const matchRequest = await http(`/api/tournaments/${tournamentId}/matches`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ ...values, tournamentId }),
        });

        const newMatch = await matchRequest.json();
        const matches = [...props.tournament.matches, newMatch];

        props.updateTournament({
          ...props.tournament,
          matches,
        });

        props.close();
      } catch (error) {
        console.log(error);
      }
    },
  })
);

export default enhance(Match);
