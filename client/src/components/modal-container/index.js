import React, { Component } from 'react';
import { Portal } from 'react-portal';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import NewTournament from './new-tournament';
import MatchResults from './match-results';
import ChoosePlayers from './choose-players';
import AddMatch from './add-match';
import JoinTournamentPlayers from './join-tournament-players';
import EditMatch from './edit-match';
import modalActions from './actions';

const modals = {
  'new-tournament-modal': NewTournament,
  'match-results-modal': MatchResults,
  'choose-players-modal': ChoosePlayers,
  'add-match-modal': AddMatch,
  'join-tournament-players-modal': JoinTournamentPlayers,
  'edit-match-modal': EditMatch,
};

class ModalContainer extends Component {
  render() {
    return (
      <Portal>
        {this.props.modalIds.map(id => {
          const Modal = modals[id];

          return (
            <Modal
              key={id}
              options={this.props.modalList[id]}
              close={() => this.props.toggleModal({ id })}
            />
          );
        })}
      </Portal>
    );
  }
}

export default compose(
  connect(
    state => ({
      modalIds: state.modal.ids,
      modalList: state.modal.list,
    }),

    {
      toggleModal: modalActions.toggleModal,
    },
  ),
)(ModalContainer);

export { default as actions } from './actions';
export { default as reducers } from './reducers';
