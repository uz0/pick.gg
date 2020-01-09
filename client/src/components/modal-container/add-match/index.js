import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import omit from 'lodash/omit';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import pick from 'lodash/pick';
import uuid from 'uuid';
import { actions as tournamentsActions } from 'pages/tournaments';

import modalActions from 'components/modal-container/actions';
import Input from 'components/form/input';
import Modal from 'components/modal';
import Button from 'components/button';

// Import { http } from 'helpers';

import i18n from 'i18n';

import Roster from './roster';
import style from './style.module.css';

const Match = props => {
  const [rosters, setRosters] = useState({});

  // Const isSubmitButtonDisabled = !props.dirty || !isEmpty(props.errors) || isEmpty(firstTeamPlayers) || isEmpty(secondTeamPlayers) || props.isSubmitting;

  const addRoster = () => {
    const rosterId = uuid();
    openChoosePlayersModal(rosterId);
  };

  const updateRosters = (rosterId, rosterPlayers) => {
    const updatedRosters = {
      ...rosters,
      [rosterId]: rosterPlayers,
    };

    setRosters(updatedRosters);
  };

  const deleteRoster = rosterId => {
    const updatedRosters = omit(rosters, rosterId);

    setRosters(updatedRosters);
  };

  const openChoosePlayersModal = rosterId => {
    const disabledPlayers = flatten(values(omit(rosters, rosterId)));
    const selectedPlayers = get(pick(rosters, rosterId), rosterId, []);

    props.toggleModal({
      id: 'add-summoners-modal',

      options: {
        tournamentId: props.tournament._id,
        disabledPlayers,
        selectedPlayers,
        action: rosterPlayers => updateRosters(rosterId, rosterPlayers),
      },
    });
  };

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
          disabled: false,
        },
      ]}
    >
      <Input
        name="name"
        placeholder="Enter match name"
        label={i18n.t('match_name')}
        className={style.field}
      />

      {props.tournament.game === 'LOL' && props.tournament.teams.length === 1 && (
        <div className={style.rosters}>
          <div className={style.title}>Играют:</div>

          <div className={style.list}>
            {Object.entries(rosters).map(([key, value], index) => (
              <Roster
                key={key}
                rosterId={key}
                title={`Team ${index + 1}`}
                game={props.tournament.game}
                players={value}
                onDelete={deleteRoster}
                onEdit={openChoosePlayersModal}
              />
            ))}
          </div>

          <Button
            appearance="_small-accent"
            text="Add roster"
            className={style.button}
            onClick={addRoster}
          />
        </div>
      )}
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
      toggleModal: modalActions.toggleModal,
    }
  ),
  // WithFormik({
  //   validationSchema: genericSchema,
  //   mapPropsToValues: () => ({
  //     name: '',
  //     rosters: {},
  //     teams: [],
  //   }),
  //   handleSubmit: async (values, { props }) => {
  //     const { tournamentId } = props.options;

  //     try {
  //       const matchRequest = await http(`/api/tournaments/${tournamentId}/matches`, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         method: 'POST',
  //         body: JSON.stringify({
  //           tournamentId,
  //           ...values,
  //         }),
  //       });

  //       const newMatch = await matchRequest.json();
  //       const matches = [...props.tournament.matches, newMatch];

  //       props.updateTournament({
  //         ...props.tournament,
  //         matches,
  //       });

  //       props.close();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  // })
);

export default enhance(Match);
