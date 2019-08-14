import React from 'react';
import { connect } from 'react-redux';
import pick from 'lodash/pick';
import Modal from 'components/modal';
import { compose, withProps } from 'recompose';
import { Field, withFormik } from 'formik';
import * as Yup from 'yup';
import { FormInput } from 'components/form/input';
import FileInput from 'components/form/input-file';
import notificationActions from 'components/notification/actions';
import { actions as tournamentsActions } from 'pages/tournaments';
import style from './style.module.css';
import { http } from 'helpers';

const validationSchema = Yup.object().shape({
  resultsFile: Yup.mixed()
    .test('fileType', 'Unsupported File Format', value => {
      if (!value) {
        return true;
      }

      return value.type === 'text/html';
    }),
});

const EditMatch = ({
  close,
  summoners,
  setFieldValue,
  isSubmitting,
  errors,
  touched,
  values,
}) => {
  const actions = [
    { text: 'Edit', appearance: '_basic-accent', type: 'submit', disabled: isSubmitting },
  ];

  return (
    <Modal
      isForm
      title="Edit match"
      close={close}
      actions={actions}
      wrapClassName={style.wrapper}
      className={style.content}
    >
      <Field
        label="Match name"
        name="name"
        component={FormInput}
        className={style.field}
      />

      <FileInput
        label="Results file"
        name="resultsFile"
        file={values.resultsFile}
        error={errors.resultsFile}
        isTouched={touched.resultsFile}
        className={style.field}
        onChange={event => {
          setFieldValue('resultsFile', event.currentTarget.files[0]);
        }}
      />

      {summoners.map((summoner, index) => (
        <div key={summoner._id} className={style.summoner}>
          <h3 className={style.name}>{summoner.summonerName}</h3>

          <Field
            label="Kills"
            name={`summoners[${index}].results.kills`}
            type="number"
            component={FormInput}
            className={style.kda}
          />

          <Field
            label="Deaths"
            name={`summoners[${index}].results.deaths`}
            type="number"
            component={FormInput}
            className={style.kda}
          />

          <Field
            label="Assists"
            name={`summoners[${index}].results.assists`}
            type="number"
            component={FormInput}
            className={style.kda}
          />
        </div>
      ))}
    </Modal>
  );
};

export default compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.options.tournamentId],
      users: state.users.list,
    }),

    {
      showNotification: notificationActions.showNotification,
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withProps(props => {
    const { matchId } = props.options;

    const match = props.tournament.matches.find(match => match._id === matchId);

    const summoners = props.tournament.summoners.map(summonerId => {
      const summoner = Object.values(props.users).find(item => item._id === summonerId);
      const summonerResults = match.playersResults.find(item => item.userId === summonerId);

      const results = {
        kills: summonerResults ? summonerResults.results.kills : 0,
        deaths: summonerResults ? summonerResults.results.deaths : 0,
        assists: summonerResults ? summonerResults.results.assists : 0,
      };

      return {
        ...pick(summoner, ['_id', 'summonerName']),
        results,
      };
    });

    return {
      match,
      summoners,
    };
  }),
  withFormik({
    validationSchema,
    mapPropsToValues: props => ({
      name: props.match.name,
      summoners: [...props.summoners],
      resultsFile: '',
    }),
    handleSubmit: async (values, formikBag) => {
      const { props } = formikBag;
      const { tournamentId, matchId } = props.options;

      const results = values.summoners.map(summoner => ({
        userId: summoner._id,
        results: summoner.results,
      }));

      const formData = new FormData();
      formData.append('resultFile', values.resultsFile);

      const resultsFileUploadConfig = {
        url: `/api/tournaments/${tournamentId}/matches/${matchId}/results/upload`,
        headers: {
          method: 'PUT',
          body: formData,
        },
      };

      const resultsUploadConfig = {
        url: `/api/tournaments/${tournamentId}/matches/${matchId}/results`,
        headers: {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify(results),
        },
      };

      try {
        const request = values.resultsFile ? resultsFileUploadConfig : resultsUploadConfig;

        const matchRequest = await http(request.url, { ...request.headers });
        const match = await matchRequest.json();

        if(match.error){
          props.showNotification({
            type: 'error',
            message: match.updatedMatch.error,
          });

          formikBag.setFieldValue('resultsFile', '');

          return;
        }

        const { matches } = props.tournament;

        for (let i = 0; i < matches.length; i++) {
          if (match.updatedMatch._id === matches[i]._id) {
            matches[i] = {
              ...match.updatedMatch,
            };
          }
        }

        props.updateTournament({
          _id: tournamentId,
          matches,
        });

        props.showNotification({
          type: 'success',
          shouldBeAddedToSidebar: false,
          message: `Результаты матча успешно обновлены для игроков ${match.users.join(', ')}`,
        });

        props.close();
      } catch (error) {
        console.log(error);
      }
    },
  }),
)(EditMatch);
