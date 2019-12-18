import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { actions as tournamentsActions } from 'pages/tournaments';
import classnames from 'classnames/bind';

import Modal from 'components/modal';

// Import { http } from 'helpers';

import style from './style.module.css';

const cx = classnames.bind(style);

const PlayerInfo = props => {
  return (
    <Modal
      title="Player info"
      close={props.close}
      className={cx(style.modal_content)}
      wrapClassName={style.wrapper}
    >
      <h1>Player modal</h1>
    </Modal>
  );
};

const enhance = compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.options.tournamentId],
    }),

    {
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
);

export default enhance(PlayerInfo);
