import React from 'react';

import Modal from 'components/dashboard-modal';
import MultiStepForm from './multi-step-form';
import style from './style.module.css';

const NewStreamerTournament = ({ closeModal }) => <Modal
  title={'Create new tournament'}
  wrapClassName={style.tournament_modal}
  close={closeModal}
>
  <MultiStepForm />
</Modal>

export default NewStreamerTournament;