import React from 'react';
import { Form, Field, withFormik } from 'formik';
import findIndex from 'lodash/findIndex';
import * as Yup from 'yup';
import uuid from 'uuid';

import { FormInput } from 'components/form/input';
import Modal from 'components/modal';

import style from './style.module.css';
import { withHandlers, compose } from 'recompose';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),

  startTime: Yup.string().required('Required'),
});

const ChoosePlayers = props => {
  console.log('in third', props);
  return (
    <Modal
      title="Add match"
      close={props.close}
      className={style.modal_content}
      wrapClassName={style.wrapper}
      actions={[
        {
          text: 'Create',
          type: 'button',
          appearance: '_basic-accent',
          onClick: props.handleAdd,
          disabled: !props.isValid,
        },
      ]}
    >
      <Form>
        <Field
          component={FormInput}
          label="Match name"
          name="name"
          className={style.field}
        />

        <Field
          component={FormInput}
          label="Start time"
          name="startTime"
          type="time"
          className={style.field}
        />
      </Form>
    </Modal>
  );
};

const enhance = compose(
  withFormik({
    validationSchema,
    mapPropsToValues: ({ options }) => {
      const { matches, editUid } = options;
      const matchIndex = editUid && findIndex(matches, { uid: editUid });

      return options.editUid ?
        {
          name: matches[matchIndex].name,
          startTime: matches[matchIndex].startTime,
        } :
        {};
    },
  }),
  withHandlers({
    handleAdd: props => () => {
      const { options, close, values } = props;
      const matches = [...options.matches];

      if (options.editUid) {
        const index = findIndex(matches, { uid: options.editUid });
        matches[index] = { ...values };

        options.onAdd(matches);

        close();
        return;
      }

      options.onAdd([...matches, { uid: uuid(), ...values }]);

      close();
    },
  })
);

export default enhance(ChoosePlayers);
