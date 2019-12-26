import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import classnames from 'classnames/bind';
import withHandlers from 'recompose/withHandlers';
import * as Yup from 'yup';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { Form, Field, withFormik } from 'formik';

import Modal from 'components/modal';
import { FormInput } from 'components/form/input';

import { http } from 'helpers';

import teamActions from './actions';
import style from './style.module.css';

const cx = classnames.bind(style);

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required'),

  color: Yup.string()
    .required('Required'),
});

const COLORS = [
  '#000',
  '#00f',
  '#f00',
  '#0f002b',
  '#060216',
  '#9696b0',
  '#1a275f',
  '#3e6ef8',
  '#4ccc4c',
  '#3eb4f8',
  '#e88c00',
  '#7e8082',
];

const EditTeam = ({
  close,
  isSubmitting,
  submitForm,
  setColor,
  values,
  teamsColors,
  options,
}) => {
  const filteredColors = filter(COLORS, color => values.color === color || !teamsColors.includes(color));
  const title = options.team ? 'Edit team' : 'Create new team';
  const submitTitle = options.team ? 'Edit' : 'Create';

  const actions = [
    {
      type: 'submit',
      text: submitTitle,
      appearance: '_basic-accent',
      disabled: isSubmitting,
      onClick: submitForm,
    },
  ];

  return (
    <Modal
      title={title}
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
          {filteredColors.map(color => (
            <button
              key={color}
              type="button"
              style={{ '--color': color }}
              className={cx({ '_is-active': values.color === color })}
              onClick={() => setColor(color)}
            />
          ))}
        </div>
      </Form>
    </Modal>
  );
};

export default compose(
  connect(
    (state, props) => {
      let teams = [...state.tournaments.list[props.options.tournamentId].teams];

      if (props.options.team) {
        teams = filter(teams, team => team._id !== props.options.team._id);
      }

      return {
        teamsColors: map(teams, 'color'),
      };
    },

    {
      addTeamToTournament: teamActions.addTeamToTournament,
      updateTournamentTeam: teamActions.updateTournamentTeam,
    },
  ),

  withHandlers({
    create: props => async values => {
      try {
        const response = await http(`/api/tournaments/${props.options.tournamentId}/teams`, {
          headers: {
            'Content-Type': 'application/json',
          },

          method: 'POST',
          body: JSON.stringify(values),
        });

        const { team, error } = await response.json();

        if (error) {
          throw error;
        }

        if (team) {
          props.addTeamToTournament({
            id: props.options.tournamentId,
            team,
          });
        }

        props.close();
      } catch (error) {
        console.log(error);
      }
    },

    edit: props => async values => {
      try {
        const response = await http(`/api/tournaments/${props.options.tournamentId}/teams/${props.options.team._id}`, {
          headers: {
            'Content-Type': 'application/json',
          },

          method: 'PATCH',
          body: JSON.stringify(values),
        });

        const { team, error } = await response.json();

        if (error) {
          throw error;
        }

        if (team) {
          props.updateTournamentTeam({
            id: props.options.tournamentId,
            team,
          });
        }

        props.close();
      } catch (error) {
        console.log(error);
      }
    },
  }),

  withFormik({
    validationSchema,

    mapPropsToValues: props => {
      if (!props.options.team) {
        return {
          name: '',
          color: 'red',
        };
      }

      return {
        name: props.options.team.name,
        color: props.options.team.color,
      };
    },

    handleSubmit: async (values, { props }) => {
      if (props.options.team) {
        props.edit(values, props);
        return;
      }

      props.create(values, props);
    },
  }),

  withHandlers({
    setColor: props => color => props.setFieldValue('color', color),
  }),
)(EditTeam);
