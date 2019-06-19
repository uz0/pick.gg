import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import Modal from 'components/modal';
import { Formik, Form } from 'formik';
import Input from 'components/form/input';
import * as Yup from 'yup';
import uuid from 'uuid';
import style from './style.module.css';

const formSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required'),

  startTime: Yup.string()
    .required('Required'),
});

class ChoosePlayers extends Component {
  submit = values => {
    const matches = [...this.props.options.formProps.values.matches];

    if (this.props.options.editUid) {
      const index = findIndex(matches, { uid: this.props.options.editUid });
      matches[index] = { ...values };

      this.props.options.onAdd({
        data: matches,
        formProps: this.props.options.formProps,
      });

      this.props.close();
      return;
    }

    this.props.options.onAdd({
      data: [...matches, { uid: uuid(), ...values }],
      formProps: this.props.options.formProps,
    });

    this.props.close();
  };

  render() {
    const matchIndex = this.props.options.editUid && findIndex(this.props.options.formProps.values.matches, { uid: this.props.options.editUid });

    const initialValues = this.props.options.editUid ? {
      name: this.props.options.formProps.values.matches[matchIndex].name,
      startTime: this.props.options.formProps.values.matches[matchIndex].startTime,
    } : {};

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={this.submit}
      >
        {props => {
          const button = {
            text: 'Create',
            appearance: '_basic-accent',
            onClick: props.submitForm,
          };

          if (!props.isValid) {
            button.disabled = true;
          }

          const actions = [button];

          return (
            <Modal
              title="Add match"
              close={this.props.close}
              className={style.modal_content}
              wrapClassName={style.wrapper}
              actions={actions}
            >
              <Form>
                <Input
                  label="Match name"
                  name="name"
                  formProps={props}
                  className={style.field}
                />

                <Input
                  label="Start time"
                  name="startTime"
                  type="time"
                  formProps={props}
                  className={style.field}
                />
              </Form>
            </Modal>
          );
        }}
      </Formik>
    );
  }
}

export default ChoosePlayers;
