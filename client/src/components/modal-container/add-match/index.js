import React from 'react';
import { connect } from 'react-redux';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';
import isEmpty from 'lodash/isEmpty';
import { compose } from 'recompose';
import { actions as tournamentsActions } from 'pages/tournaments';

import Select from 'components/form/selects/team-select';
import { FormInput } from 'components/form/input';
import Modal from 'components/modal';

import { http } from 'helpers';

import i18n from 'i18n';

import style from './style.module.css';

const genericSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
});

const lolSchema = genericSchema.shape({
  teams: Yup.object().shape({
    red: Yup.string()
      .required('Required')
      .notOneOf([Yup.ref('blue')], 'You can\'t choose same teams'),
    blue: Yup.string()
      .required('Required')
      .notOneOf([Yup.ref('red')], 'You can\'t choose same teams'),
  }),
});

const setValidationSchema = game => game === 'LOL' ? lolSchema : genericSchema;

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
          disabled: !props.dirty || !isEmpty(props.errors) || props.isSubmitting,
        },
      ]}
    >
      <Form>
        <Field
          name="name"
          placeholder="Enter match name"
          component={FormInput}
          label={i18n.t('match_name')}
          className={style.field}
        />

        {props.tournament.game === 'LOL' && (
          <>
            <Field
              name="teams.red"
              label="Blue team"
              placeholder="Choose blue team"
              component={Select}
              options={props.teams}
              className={style.field}
            />

            <Field
              name="teams.blue"
              label="Red team"
              placeholder="Choose red team"
              component={Select}
              options={props.teams}
              className={style.field}
            />
          </>
        )}
      </Form>
    </Modal>
  );
};

const enhance = compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.options.tournamentId],
      teams: state.tournaments.list[props.options.tournamentId].teams,
    }),
    {
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withFormik({
    validationSchema: props => setValidationSchema(props.tournament.game),
    mapPropsToValues: props => {
      const values = {
        LOL: {
          name: '',
          teams: {
            red: '',
            blue: '',
          },
        },
        PUBG: {
          name: '',
        },
      };

      return values[props.tournament.game];
    },
    handleSubmit: async (values, { props }) => {
      const { tournamentId } = props.options;
      const { rules, rewards, isForecastingActive, game, isStarted } = props.tournament;

      try {
        const matchRequest = await http(`/api/tournaments/${tournamentId}/matches`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            game,
            tournamentId,
            ...values,
          }),
        });

        const newMatch = await matchRequest.json();
        const matches = [...props.tournament.matches, newMatch];

        const isTournamentEmpty = isEmpty(rules) || isEmpty(rewards) || matches.length === 0;
        const isApplicationsAvailable = !isTournamentEmpty && !isForecastingActive && !isStarted;

        props.updateTournament({
          ...props.tournament,
          isApplicationsAvailable,
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
