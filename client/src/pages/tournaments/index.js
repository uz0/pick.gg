import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import Button from 'components/button';
import { actions as modalActions } from 'components/modal-container';

import style from './style.module.css';

const Tournaments = props => (
  <div className={style.tournaments}>
    <Button appearance="_icon-accent" icon="plus" className={style.button} onClick={props.openNewTournamentModal}/>
  </div>
);

export default compose(
  connect(
    null,

    {
      toggleModal: modalActions.toggleModal,
    },
  ),
  withHandlers({
    openNewTournamentModal: props => () => props.toggleModal({ id: 'new-tournament-modal' }),
  })
)(Tournaments);
