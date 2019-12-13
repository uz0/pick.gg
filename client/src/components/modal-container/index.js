import React, { Component } from 'react';
import { Portal } from 'react-portal';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import NewTournament from './new-tournament';
import MatchResults from './match-results';
import ChoosePlayers from './choose-players';
import AddMatch from './add-match';
import AddRules from './tournament-rules';
import AddRewards from './tournament-rewards';
import EditTournament from './edit-tournament';
import DropinAuth from './dropin-auth';
import JoinTournamentPlayers from './join-tournament-players';
import EditUser from './dashboard-edit-user-modal';
import EditMatch from './edit-match';
import NewTeam from './new-team';
import Reward from './reward';
import modalActions from './actions';

const modals = {
  'new-tournament-modal': NewTournament,
  'match-results-modal': MatchResults,
  'add-summoners-modal': ChoosePlayers,
  'reward-modal': Reward,
  'add-match-modal': AddMatch,
  'tournament-rules-modal': AddRules,
  'tournament-rewards': AddRewards,
  'join-tournament-players-modal': JoinTournamentPlayers,
  'edit-match-modal': EditMatch,
  'edit-tournament-modal': EditTournament,
  'new-team-modal': NewTeam,
  'user-modal': EditUser,
  'dropin-auth': DropinAuth,
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
