import React from 'react';
import { http, getChangedFormFields } from 'helpers';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Modal from 'components/modal';
import { Form, withFormik, Field } from 'formik';
import { FormInput } from 'components/form/input';
import Select from 'components/form/user-select';
import Button from 'components/button';
import * as Yup from 'yup';
import style from './style.module.css';
import notificationActions from 'components/notification/actions';
import actions from 'pages/dashboard/users/actions';
import i18n from 'i18n';

const POSITIONS = [
  { value: 'adc', label: 'ADC'},
  { value: 'mid', label: 'Mid'},
  { value: 'top', label: 'Top'},
  { value: 'jungle', label: 'Jungle'},
  { value: 'support', label: 'Support'}
];

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

const User = props => {
  const deleteUser = async userId => {
    try {
      await http(`/api/admin/user/${userId}`, {
        method: 'DELETE',
      });

      props.close();

      props.deleteUser(userId);

      props.showNotification({
        type: 'success',
        shouldBeAddedToSidebar: false,
        message: i18n.t('notifications.success.user_deleted'),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title={i18n.t('edit_user')}
      close={props.close}
      className={style.modal_content}
    >
      <Form>
        <Field
          component={FormInput}
          label={i18n.t('username')}
          name="username"
          className={style.field}
        />

        <Field
          component={FormInput}
          label={i18n.t('summonername')}
          name="summonerName"
          className={style.field}
        />

        <Field
          component={Select}
          label={i18n.t('Position')}
          name="preferredPosition"
          className={style.field}
        />
        <div className={style.wrap_checkbox}>
          <Field
            component={FormInput}
            label={i18n.t('Admin')}
            type="checkbox"
            name="isAdmin"
            className={style.field}
          />
          <Field
            component={FormInput}
            label={i18n.t('canProvideTournaments')}
            type="checkbox"
            name="canProvideTournaments"
            className={style.field}
          />
        </div>


        <div className={style.footer_button}>
          <Button
            text={i18n.t('button.delete_user')}
            appearance="_basic-danger"
            className={style.delete}
            onClick={() => deleteUser(props.options.user._id)}
          />
          <button
            type="submit"
            className={style.submit}
          >{i18n.t('button.submit')}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

const enhance = compose(
  connect(
    null,
    {
      showNotification: notificationActions.showNotification,
      updateUser: actions.updateUser,
      deleteUser: actions.deleteUser,
    }
  ),
  withFormik({
    validationSchema,
    mapPropsToValues: ({ options }) => {
      const { _id, username, summonerName, preferredPosition, canProvideTournaments, isAdmin } = options.user;
      return { _id, username, summonerName, preferredPosition, canProvideTournaments, isAdmin };
    },
    handleSubmit: async (values, formikBag) => {

      const { isEditing } = formikBag.props.options;
      const defaultState = formikBag.props.options.user;

      const editUserRequest = async body => {
        try {
          const request = await http(`/api/admin/user/${defaultState._id}`, {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(body),
          });

          return request.json();
        } catch (error) {
          console.log(error);
        }
      };

      if (isEditing) {
        const changedFields = getChangedFormFields(defaultState, values);
        const editRequest = await editUserRequest(changedFields);

        formikBag.props.close();

        formikBag.props.showNotification({
          type: 'success',
          shouldBeAddedToSidebar: false,
          message: i18n.t('notifications.success.user_edited'),
        });

        formikBag.props.updateUser(editRequest);
      }
    },
  }),
);

export default enhance(User);
