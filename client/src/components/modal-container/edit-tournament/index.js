import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import moment from 'moment';
import Modal from 'components/modal';
import { Field, withFormik } from 'formik';
import { FormInput } from 'components/form/input';
import style from './style.module.css';

class EditTournament extends Component {
  render() {
    console.log(this.props)
    const actions = [
      { text: 'Edit', appearance: '_basic-accent', type: 'submit' },
    ];

    return <Modal
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
        label="Date"
        name="startAt"
        type="date"
        component={FormInput}
        className={style.field}
      />
    </Modal>;
  }
}

export default compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.options.tournamentId],
    }),
  ),

  withFormik({
    mapPropsToValues: ({ tournament }) => {
      const startAt = moment(tournament.startAt).format('YYYY-DD-MM');
      const name = tournament.name;
      const description = tournament.description;

      return {
        name,
        startAt,
        description,
      };
    },

    handleSubmit: async (values, props) => {
      console.log(values);
      console.log(props);
    },
  }),
)(EditTournament);
