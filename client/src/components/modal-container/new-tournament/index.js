import React, { Component } from 'react';
import Modal from 'components/modal';
import style from './style.module.css';

class NewTournament extends Component {
  render() {
    return <Modal
      title="New Tournament"
      close={this.props.close}
    >
      content
    </Modal>;
  }
}

export default NewTournament;
