import React, { Component } from 'react';
import Modal from 'components/modal';
import { Formik, Form } from 'formik';
import Input from 'components/form/input';
import * as Yup from 'yup';
import style from './style.module.css';

const formSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),

  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

class NewTournament extends Component {
  submit = (values, actions) => {
    console.log(values);
    console.log(actions);
  };

  render() {
    return (
      <Modal
        title="New Tournament"
        close={this.props.close}
        className={style.modal_content}
      >
        <Formik
          validationSchema={formSchema}
          onSubmit={this.submit}
        >
          {props => (
            <Form>
              <Input
                label="Email"
                name="email"
                formProps={props}
                className={style.field}
              />

              <Input
                label="Username"
                name="username"
                formProps={props}
                className={style.field}
              />

              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default NewTournament;