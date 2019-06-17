import React, { Component, Fragment } from 'react';
import { Portal } from 'react-portal';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import NewTournament from './new-tournament';
import modalActions from './actions';

export { default as actions } from './actions';
export { default as reducers } from './reducers';

class ModalContainer extends Component {
  render() {
    return <Portal>
      {this.props.modal_ids.map(id => <Fragment key={id}>
        {id === 'new-tournament-modal' && <NewTournament options={this.props.modal_list[id]} close={() => this.props.closeModal(id)} />}
      </Fragment>)}
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
      closeModal: modalActions.closeModal,
    },
  ),
)(ModalContainer);
