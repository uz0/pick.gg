import React from 'react';
import Modal from 'components/modal';
import compose from 'recompose/compose';
import { Field, withFormik } from 'formik';
import { FormInput } from 'components/form/input';
import style from './style.module.css';

const EditMatch = ({ close }) => {
  const actions = [
    { text: 'Edit', appearance: '_basic-accent', type: 'submit' },
  ];

  return (
    <Modal
      isForm
      title="Edit match"
      close={close}
      actions={actions}
      wrapClassName={style.wrapper}
      className={style.content}
    >
      <Field
        label="Match name"
        name="name"
        component={FormInput}
        className={style.field}
      />

      <Field
        label="Start time"
        name="time"
        type="time"
        component={FormInput}
        className={style.field}
      />

      {[1, 2, 3, 4, 5].map(id => (
        <div key={id} className={style.player}>
          <h3 className={style.name}>JackeyLove</h3>

          <Field
            label="Kills"
            name={`${id}-kills`}
            type="number"
            component={FormInput}
            className={style.kda}
          />

          <Field
            label="Deaths"
            name={`${id}-deaths`}
            type="number"
            component={FormInput}
            className={style.kda}
          />

          <Field
            label="Assists"
            name={`${id}-assists`}
            type="number"
            component={FormInput}
            className={style.kda}
          />
        </div>
      ))}
    </Modal>
  );
};

export default compose(
  withFormik({
    handleSubmit: async (qwe, asd) => {
      console.log(qwe);
      console.log(asd);
    },
  }),
)(EditMatch);
