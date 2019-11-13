import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import isEmpty from 'lodash/isEmpty';
import { withFormik } from 'formik';
import { actions as tournamentsActions } from 'pages/tournaments';

import Modal from 'components/modal';

import { http } from 'helpers';

import i18n from 'i18n';

import style from './style.module.css';
import * as LolRules from './lol';
import * as PubgRules from './pubg';

const AddRules = props => {
  const { RulesForm } = props;
  return (
    <Modal
      title={props.options.isEditing ? i18n.t('modal.edit_rules') : i18n.t('modal.add_rules')}
      close={props.close}
      className={style.modal_content}
      wrapClassName={style.wrapper}
      actions={[
        {
          text: props.options.isEditing ? i18n.t('edit') : i18n.t('add'),
          type: 'button',
          appearance: '_basic-accent',
          onClick: props.submitForm,
          disabled: props.isSubmitting,
        },
      ]}
    >
      <RulesForm/>
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
  withProps(props => {
    if (props.tournament.game === 'LOL') {
      return ({
        RulesForm: LolRules.RulesForm,
        validationSchema: LolRules.validationSchema,
        defaultRules: LolRules.defaultRules,
      });
    }

    if (props.tournament.game === 'PUBG') {
      return ({
        RulesForm: PubgRules.RulesForm,
        validationSchema: PubgRules.validationSchema,
        defaultRules: PubgRules.defaultRules,
      });
    }
  }),
  withFormik({
    validationSchema: props => {
      return props.validationSchema;
    },
    mapPropsToValues: props => {
      if (isEmpty(props.tournament.rules)) {
        return props.defaultRules;
      }

      return props.tournament.rules;
    },
    handleSubmit: async (values, { props }) => {
      const { tournamentId } = props.options;
      const { game } = props.tournament;

      try {
        await http(`/api/tournaments/${tournamentId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ rules: values, game }),
        });

        props.updateTournament({
          _id: props.tournament._id,
          rules: values,
        });

        props.close();
      } catch (error) {
        console.log(error);
      }
    },
  })
);

export default enhance(AddRules);
