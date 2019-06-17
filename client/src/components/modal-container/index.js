import React, { Component, Fragment } from 'react';
import { Portal } from 'react-portal';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import NewTournament from './new-tournament';
import modalActions from './actions';

const modals = {
  'new-tournament-modal': NewTournament,
};

class ModalContainer extends Component {
  render() {
    return <Portal>
      {this.props.modal_ids.map(id => {
        const Modal = modals[id];

        return <Modal
          key={id}
          options={this.props.modal_list[id]}
          close={() => this.props.toggleModal({ id })}
        />;
      })}
    </Portal>;
  }
}

export default compose(
  connect(
    state => ({
      modal_ids: state.modal.ids,
      modal_list: state.modal.list,
    }),

    {
      toggleModal: modalActions.toggleModal,
    },
  ),
)(ModalContainer);

export { default as actions } from './actions';
export { default as reducers } from './reducers';
