import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { actions as tournamentsActions } from 'pages/tournaments';
import classnames from 'classnames/bind';

import Icon from 'components/icon';
import Modal from 'components/modal';

import { http } from 'helpers';

import style from './style.module.css';

const cx = classnames.bind(style);

const ChooseTeam = ({
  close,
  checkedTeamId,
  setTeamId,
  submit,
  options: { teams },
}) => {
  return (
    <Modal
      title="Choose team"
      close={close}
      className={style.content}
      actions={[{
        text: 'Choose',
        appearance: '_basic-accent',
        disabled: !checkedTeamId,
        onClick: submit,
      }]}
    >
      {teams.map(team => (
        <button
          key={team._id}
          type="button"
          className={cx('team', { '_is-active': checkedTeamId === team._id })}
          onClick={setTeamId(team._id)}
        >
          <div className={style.circle}>
            <Icon name="mark"/>
          </div>

          <p className={style.name}>{team.name}</p>
        </button>
      ))}
    </Modal>
  );
};

export default compose(
  connect(
    null,

    {
      updateTournament: tournamentsActions.updateTournament,
    },
  ),

  withState('checkedTeamId', 'setCheckedTeamId', ''),

  withHandlers({
    setTeamId: props => id => () => props.setCheckedTeamId(id),

    submit: props => async () => {
      try {
        const response = await http(`/api/tournaments/${props.options.tournamentId}/teams/${props.checkedTeamId}/choose`, {
          headers: {
            'Content-Type': 'application/json',
          },

          method: 'PATCH',
          body: JSON.stringify({ userId: props.options.userId }),
        });

        const { error, tournament } = await response.json();

        if (error) {
          throw error;
        }

        props.updateTournament(tournament);
        props.close();
      } catch (error) {
        console.error(error);
      }
    },
  }),
)(ChooseTeam);
