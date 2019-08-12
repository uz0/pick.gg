import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, withFormik } from 'formik';
import moment from 'moment';
import compose from 'recompose/compose';
import { http } from 'helpers';
import Modal from 'components/modal';
import { FormInput } from 'components/form/input';
import { actions as tournamentsActions } from 'pages/tournaments';
import style from './style.module.css';

class EditTournament extends Component {
  render() {
    const actions = [
      { text: 'Edit', appearance: '_basic-accent', type: 'submit' },
    ];

    return (
      <Modal
        isForm
        title="Edit tournament"
        close={this.props.close}
        actions={actions}
        wrapClassName={style.modal}
        className={style.modal_content}
      >
        <Field
          label="Name"
          name="name"
          component={FormInput}
          className={style.field}
        />

        <Field
          label="Description"
          name="description"
          component={FormInput}
          className={style.field}
        />

        <Field
          label="Tournament image"
          name="imageUrl"
          component={FormInput}
          className={style.field}
        />

        <Field
          label="Price"
          name="price"
          component={FormInput}
          className={style.field}
        />

        <Field
          label="Date"
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
