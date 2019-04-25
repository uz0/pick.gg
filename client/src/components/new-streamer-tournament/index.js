import React, { Component } from 'react';

import Modal from 'components/dashboard-modal';
import MultiStepForm from './multi-step-form';
import style from './style.module.css';


class NewStreamerTournament extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Modal
        title={'Create new tournament'}
        wrapClassName={style.tournament_modal}
      >
        <MultiStepForm />
      </Modal>
    );
  }
}

export default NewStreamerTournament;