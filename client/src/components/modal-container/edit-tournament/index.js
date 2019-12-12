import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, withFormik } from 'formik';
import moment from 'moment';
import compose from 'recompose/compose';
import { actions as tournamentsActions } from 'pages/tournaments';

import Modal from 'components/modal';
import { FormInput } from 'components/form/input';

import { http } from 'helpers';

import i18n from 'i18n';

import style from './style.module.css';

class EditTournament extends Component {
  render() {
    const actions = [
      {
        text: i18n.t('edit'),
        type: 'submit',
        appearance: '_basic-accent',
        disabled: this.props.isSubmitting,
        onClick: this.props.submitForm,
      },
    ];

    return (
      <Modal
        isForm
        title={i18n.t('modal.edit_tournament')}
        close={this.props.close}
        actions={actions}
        wrapClassName={style.modal}
        className={style.modal_content}
      >
        <Field
          label={i18n.t('name')}
          name="name"
          component={FormInput}
          className={style.field}
        />

        <Field
          label={i18n.t('modal.description')}
          name="description"
          component={FormInput}
          className={style.field}
        />

        <Field
          label={i18n.t('modal.tournament_image')}
          name="imageUrl"
          component={FormInput}
          className={style.field}
        />

        <Field
          label={i18n.t('date')}
          name="startAt"
          type="date"
          component={FormInput}
          className={style.field}
        />
      </Modal>
    );
  }
}

export default compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.options.tournamentId],
    }),

    {
      updateTournament: tournamentsActions.updateTournament,
    }
  ),

  withFormik({
    mapPropsToValues: ({ tournament }) => {
      const startAt = moment(tournament.startAt).format('YYYY-MM-DD');
      const { name, description, price, imageUrl } = tournament;

      return {
        name,
        price,
        imageUrl,
        startAt,
        description,
      };
    },

    handleSubmit: async (values, { props }) => {
      const { tournamentId } = props.options;

      try {
        await http(`/api/tournaments/${tournamentId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify(values),
        });

        props.updateTournament({
          _id: props.tournament._id,
          ...values,
        });

        props.close();
      } catch (error) {
        console.log(error);
      }
    },
  }),
)(EditTournament);
