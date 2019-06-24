import React from 'react';
import { Form } from 'formik';
import compact from 'lodash/compact';
import FormikWizard from 'formik-wizard';

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import Modal from 'components/modal';
import Button from 'components/button';

import style from './style.module.css';
import { steps } from './steps';

import modalActions from '../actions';

const withActions = withProps(
  ({ isLastStep, canGoBack, goToPreviousStep, submitForm }) => ({
    actions: compact([
      canGoBack && {
        text: 'Prev',
        appearance: '_basic-accent',
        className: style.prev_slide,
        disable: !canGoBack,
        onClick: goToPreviousStep,
      },
      isLastStep ?
        {
          text: 'Create',
          appearance: '_basic-accent',
          className: style.next_slide,
          onClick: submitForm,
          disabled: false,
        } :
        {
          text: 'Next',
          type: 'submit',
          appearance: '_basic-accent',
          className: style.next_slide,
          disabled: false,
        },
    ]),
  })
);

const withStepName = withProps(({ currentStep }) => ({
  stepName: ['New tournament', 'Tournament players', 'Tournament matches'][
    currentStep - 1
  ],
}));

const withModal = connect(
  null,
  {
    toggleModal: modalActions.toggleModal,
  }
);

const withModalButtonProps = withProps(
  ({ currentStep, toggleModal, values, setValues }) => ({
    modalButtonProps: ({
      1: null,
      2: {
        type: 'button',
        appearance: '_icon-accent',
        icon: values[2].players.length === 10 ? 'edit' : 'plus',
        className: style.choose,
        onClick: () =>
          toggleModal({
            id: 'choose-players-modal',

            options: {
              onChoose: players =>
                setValues({ ...values, 2: { players } }),
              values: values[2].players,
            },
          }),
      },
      3: {
        type: 'button',
        appearance: '_icon-accent',
        icon: values[3].matches.length > 0 ? 'edit' : 'plus',
        className: style.choose,
        onClick: () =>
          toggleModal({
            id: 'add-match-modal',

            options: {
              onAdd: matches => setValues({ ...values, 3: { matches } }),
              matches: values[3].matches,
            },
          }),
      },
    }[Number(currentStep)]) })
);

const enhance = compose(
  withModal,
  withActions,
  withStepName,
  withModalButtonProps
);

const FormWrapper = enhance(props => (
  <Modal
    title="New Tournament"
    close={props.close}
    className={style.modal_content}
    actions={props.actions}
  >
    <div className={style.header}>
      <h3 className={style.step_title}>
        Step {Number(props.currentStep)} of 3: {props.stepName}
      </h3>

      {props.modalButtonProps && <Button {...props.modalButtonProps}/>}
    </div>
    <Form className={style.form}>{props.children}</Form>
  </Modal>
));

export default withProps(({
  steps,
  render: FormWrapper,
  onSubmit: (values, actions) => {
    console.log('i am submitting');
    console.log(values);
    console.log(actions);
  },
}))(FormikWizard);
