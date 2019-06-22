import React from 'react';

import Modal from 'components/dashboard-modal';
import MultiStepForm from './multi-step-form';
import style from './style.module.css';
import i18n from 'i18n';

const NewStreamerTournament = ({ closeModal }) => (
  <Modal
    title={i18n.t('create_new_tournament')}
    wrapClassName={style.tournament_modal}
    close={closeModal}
  >
    <MultiStepForm/>
  </Modal>
);

export default NewStreamerTournament;
