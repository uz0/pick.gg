import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import pick from 'lodash/pick';
import merge from 'lodash/merge';
import { compose, withProps } from 'recompose';
import { Field, withFormik } from 'formik';
import findIndex from 'lodash/findIndex';
import * as Yup from 'yup';
import { actions as tournamentsActions } from 'pages/tournaments';
import classnames from 'classnames';

import Table from 'components/table';
import FileInput from 'components/form/input-file';
import Button from 'components/button';
import notificationActions from 'components/notification/actions';
import Modal from 'components/modal';
import { FormInput } from 'components/form/input';

import { RULES } from 'constants/index';

import { http } from 'helpers';

import i18n from 'i18n';

import style from './style.module.css';

const cx = classnames.bind(style);

const validationSchema = Yup.object().shape({
  resultsFile: Yup.mixed()
    .test('fileType', 'Unsupported File Format', value => {
      if (!value) {
        return true;
      }

      return value.type === 'text/html';
    }),
});

const mergeByNicknames = (objValue, srcValue) => {
  const summoners = []
  if (objValue && objValue.summoners && srcValue && srcValue.summoners) {
    for (let objSummoner of objValue.summoners) {
      for (let srcSummoner of srcValue.summoners) {
        if (objSummoner.nickname === srcSummoner.nickname) {
          summoners.push(srcSummoner)
        } else {
          summoners.push(objSummoner)
        }
      }
    }
    return merge(objValue, {summoners});
  }
};

const EditMatch = ({
  close,
  summoners,
  game,
  playerRules,
  setFieldValue,
  loadResults,
  loadMatches,
  setValues,
  isSubmitting,
  errors,
  touched,
  teams,
  values,
  lastMatchesCaptions,
}) => {
  const isLol = game === 'LOL';

  const actions = [
    { text: i18n.t('edit'), appearance: '_basic-accent', type: 'submit', disabled: isSubmitting },
  ];

  const [playerLastMatches, setPlayerLastMatches] = useState([]);
  const [isLastMatchesShown, setIsLastMatchesShown] = useState(false);

  const handleResultsLoad = async matchId => {
    const loadedResults = await loadResults(matchId);
    const resolvedNames = values.summoners.map(i => i.nickname);
    const filtered = loadedResults.summoners.filter(summoner => resolvedNames.includes(summoner.nickname));
    setValues(mergeByNicknames(values, { summoners: filtered }));
    setIsLastMatchesShown(false);
  };

  const handleMatchesLoad = async () => {
    const loadedMatches = await loadMatches(values.resultsTargetPlayer);
    setPlayerLastMatches(loadedMatches);
    setIsLastMatchesShown(true);
  };

  const renderRow = ({ className, itemClass, textClass, item, captions }) => {
    const chooseButton = { '--width': captions.chooseButton.width };
    const createdAt = { '--width': captions.createdAt.width };
    const duration = { '--width': captions.duration.width };
    const gameMode = { '--width': captions.gameMode.width };

    return (
      <div key={item.id} className={cx(className, 'row')}>
        <div className={itemClass} style={chooseButton}>
          <Button
            appearance="_basic-accent"
            icon="plus"
            className={style.button}
            onClick={() => handleResultsLoad(item.id)}
          />
        </div>
        <div className={itemClass} style={createdAt}>
          <span className={textClass}>{item.createdAt}</span>
        </div>
        <div className={itemClass} style={duration}>
          <span className={textClass}>{item.duration}</span>
        </div>
        <div className={itemClass} style={gameMode}>
          <span className={textClass}>{item.gameMode}</span>
        </div>
      </div>
    );
  };

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

      {game === 'LOL' && (
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
      )}

      {game === 'PUBG' && (
        <>
          <div className={style.fetch}>
            <Field
              label={i18n.t('result_modal.show_last_matches_of_player')}
              name="resultsTargetPlayer"
              component={FormInput}
              className={style.field}
            />
            <Button
              text={i18n.t('button.load')}
              appearance="_basic-accent"
              className={style.button}
              onClick={() => handleMatchesLoad()}
            />
          </div>
          {isLastMatchesShown && (
            <Table
              captions={lastMatchesCaptions}
              items={playerLastMatches}
              renderRow={renderRow}
              className={style.table}
              emptyMessage={i18n.t('no_matches_results')}
            />
          )}
        </>)
      }

      {isLol && (
        <div className={style.teams}>
          {teams.map((team, index) => {
            if (index === 1) {
              return (
                <Fragment key={team._id}>
                  <p className={style.delimiter}>vs</p>
                  <p className={style.team}>{team.name}</p>
                </Fragment>
              );
            }

            return <p key={team._id} className={style.team}>{team.name}</p>;
          })}
        </div>
      )}

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
      device: state.device,
    }),

    {
      showNotification: notificationActions.showNotification,
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withProps(props => {
    const isMobile = props.device === 'touch';
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

    const loadResults = async matchId => {
      const loadedValues = await http(`/external/pubg/match/${matchId}`);
      const results = await loadedValues.json();

      return results;
    };

    const loadMatches = async name => {
      const loadedValues = await http(`/external/pubg/lastMatches/${name}`);
      const matches = await loadedValues.json();

      return matches;
    };

    const lastMatchesCaptions = {
      chooseButton: {
        text: 'Press to choose',
        width: isMobile ? 75 : 100,
      },
      createdAt: {
        text: 'Created',
        width: isMobile ? 120 : 150,
      },

      duration: {
        text: 'Duration',
        width: isMobile ? 75 : 100,
      },

      gameMode: {
        text: 'Mode',
        width: isMobile ? 75 : 100,
      },
    };

    return {
      match,
      game,
      summoners,
      teams,
      playerRules,
      loadResults,
      loadMatches,
      lastMatchesCaptions,
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
