import React from 'react';
import { connect } from 'react-redux';
import pick from 'lodash/pick';
import Modal from 'components/modal';
import { compose, withProps } from 'recompose';
import { Field, withFormik } from 'formik';
import { FormInput } from 'components/form/input';
import { actions as tournamentsActions } from 'pages/tournaments';
import style from './style.module.css';
import { http } from 'helpers';

const EditMatch = ({ close, summoners }) => {
  const actions = [
    { text: 'Edit', appearance: '_basic-accent', type: 'submit' },
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
    mapPropsToValues: props => ({
      name: props.match.name,
      summoners: [...props.summoners],
    }),
    handleSubmit: async (values, { props }) => {
      const { tournamentId, matchId } = props.options;

      const results = values.summoners.map(summoner => ({
        userId: summoner._id,
        results: summoner.results,
      }));

      try {
        const match = await http(`/api/tournaments/${tournamentId}/matches/${matchId}/results`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify(results),
        });

        const { matches } = props.tournament;

        for (const item of matches) {
          if (item._id === match._id) {
            item.name = match.name;
            item.playersResults = match.playersResults;
          }
        }

        props.updateTournament({
          _id: tournamentId,
          matches,
        });

        props.close();
      } catch (error) {
        console.log(error);
      }
    },
  }),
)(EditMatch);
