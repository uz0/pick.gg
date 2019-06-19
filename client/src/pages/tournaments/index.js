import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Button from 'components/button';
import { actions as modalActions } from 'components/modal-container';
import style from './style.module.css';

class Tournaments extends Component {
  openNewTournamentModal = () => this.props.toggleModal({ id: 'new-tournament-modal' });

  render() {
    return (
      <div className="container">
        <div className={style.tournaments}>
          <Button
            appearance="_icon-accent"
            icon="plus"
            className={style.button}
            onClick={this.openNewTournamentModal}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    null,

    {
      toggleModal: modalActions.toggleModal,
    },
  ),
)(Tournaments);
