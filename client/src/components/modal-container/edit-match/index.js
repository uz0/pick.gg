import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Field, withFormik } from 'formik';
import pick from 'lodash/pick';
import findIndex from 'lodash/findIndex';
import * as Yup from 'yup';
import { actions as tournamentsActions } from 'pages/tournaments';

import Select from 'components/form/selects/team-select';
import FileInput from 'components/form/input-file';
import notificationActions from 'components/notification/actions';
import Modal from 'components/modal';
import { FormInput } from 'components/form/input';

import { RULES } from 'constants/index';

import { http } from 'helpers';

import i18n from 'i18n';

import style from './style.module.css';

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
  playerRules,
  setFieldValue,
  isSubmitting,
  errors,
  touched,
  teams,
  values,
  game,
}) => {
  const isLol = game === 'LOL';
  console.log(values);
  console.log(teams);

  const actions = [
    { text: i18n.t('edit'), appearance: '_basic-accent', type: 'submit', disabled: isSubmitting },
  ];

  return (
    <Modal
      isForm
      title={i18n.t('edit_match')}
      close={close}
      actions={actions}
      wrapClassName={style.wrapper}
      className={style.content}
    >
      <Field
        disabled
        label={i18n.t('match_name')}
        name="name"
        component={FormInput}
        className={style.field}
      />

      <FileInput
        label={i18n.t('modal.results_file')}
        name="resultsFile"
        file={values.resultsFile}
        error={errors.resultsFile}
        isTouched={touched.resultsFile}
        className={style.field}
        onChange={event => {
          setFieldValue('resultsFile', event.currentTarget.files[0]);
        }}
      />

      {isLol &&
        teams.map((team, index) => (
          <Field
            key={team._id}
            disabled
            label={index === 0 ? 'Blue team' : 'Red team'}
            placeholder="Choose blue team"
            component={Select}
            defaultInputValue={team.name}
            className={style.field}
          />
        ))
      }

      {isLol &&
        teams.map(team => {
          return (
            <Fragment key={team._id}>
              <div className={style.team_name_wrapper}>
                <p className={style.team_name}>{team.name}</p>
                <div className={style.divider}/>
              </div>

              {team.users.map(userId => {
                const index = findIndex(summoners, { _id: userId });

                if (index === -1) {
                  return null;
                }

                const summoner = summoners[index];

                return (
                  <div key={summoner._id} className={style.summoner}>
                    <h3 className={style.name}>{summoner.nickname}</h3>

                    {playerRules.map(rule => (
                      <Field
                        key={`${summoner.nickname}_${rule}`}
                        label={rule}
                        name={`summoners[${index}].results.${rule}`}
                        type="number"
                        component={FormInput}
                        className={style.result_field}
                      />
                    ))}
                  </div>
                );
              })}
            </Fragment>
          );
        })
      }

      {!isLol && summoners.map((summoner, index) => (
        <div key={summoner._id} className={style.summoner}>
          <h3 className={style.name}>{summoner.nickname}</h3>

          {playerRules.map(rule => (
            <Field
              key={`${summoner.nickname}_${rule}`}
              label={rule}
              name={`summoners[${index}].results.${rule}`}
              type="number"
              component={FormInput}
              className={style.result_field}
            />
          ))}
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
    const { game, teams } = props.tournament;
    const playerRules = RULES[game].player.reduce((rules, rule) => ([...rules, rule.ruleName]), []);

    const match = props.tournament.matches.find(match => match._id === matchId);

    const summoners = props.tournament.summoners.map(summonerId => {
      const summoner = Object.values(props.users).find(item => item._id === summonerId);
      const summonerResults = match.playersResults.find(item => item.userId === summonerId);

      const results = summonerResults ?
        Object.entries(summonerResults.results).reduce((results, [key, val]) => {
          return { ...results, [key]: val };
        }, {}) :
        RULES[game].player.reduce((rules, rule) => ({ ...rules, [rule.ruleName]: 0 }), {});

      const normalizedSummoner = pick(summoner, ['_id', 'gameSpecificName']);
      return {
        _id: normalizedSummoner._id,
        nickname: normalizedSummoner.gameSpecificName[game],
        results,
      };
    });

    return {
      match,
      summoners,
      teams,
      game,
      playerRules,
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

        if (match.error) {
          props.showNotification({
            type: 'error',
            message: match.error,
          });

          formikBag.setFieldValue('resultsFile', '');

          return;
        }

        const { matches } = props.tournament;

        for (const item of matches) {
          if (item._id === matchId) {
            item.playersResults = [...match.playersResults];
            break;
          }
        }

        props.updateTournament({
          _id: tournamentId,
          matches,
        });

        props.showNotification({
          type: 'success',
          shouldBeAddedToSidebar: false,
          message: 'Результаты матча успешно обновлены',
        });

        props.close();
      } catch (error) {
        console.log(error);
      }
    },
  }),
)(EditMatch);
