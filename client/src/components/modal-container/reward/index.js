import React from 'react';
import Modal from 'components/modal';
import { connect } from 'react-redux';
import { Form, Field, withFormik } from 'formik';
import { FormInput } from 'components/form/input';
import Button from 'components/button';
import { compose } from 'recompose';
import { http, getChangedFormFields } from 'helpers';
import * as Yup from 'yup';
import style from './style.module.css';
import { actions as notificationActions } from 'components/notification';
import { actions as rewardsActions } from 'pages/dashboard/rewards';

import i18n from 'i18n';

const validationSchema = Yup.object().shape({
  key: Yup.string().required('Key field is required!'),
});

const Reward = props => {
  const modalTitle = props.options.isEditing ? 'Edit reward' : 'Add new reward';
  const { reward } = props.options;

  const deleteReward = async reward => {
    const { _id } = reward;

    console.log(reward, 'reward');

    try {
      await http(`/api/admin/reward/${_id}`, {
        method: 'DELETE',
      });

      props.close();

      props.deleteReward(_id);

      props.showNotification({
        type: 'success',
        shouldBeAddedToSidebar: false,
        message: i18n.t('notifications.success.entity_is_deleted', { name: reward.description }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title={modalTitle}
      close={props.close}
      className={style.modal_content}
    >
      <Form>
        <Field
          component={FormInput}
          label="Key"
          name="key"
          className={style.field}
        />

        <Field
          component={FormInput}
          type="checkbox"
          label="Is claimed"
          name="isClaimed"
          className={style.field}
        />

        <Field
          component={FormInput}
          label="Description"
          name="description"
          className={style.field}
        />

        <Field
          component={FormInput}
          label="Image"
          name="image"
          className={style.field}
        />
        <button type="submit">Submit</button>
        <Button
          text="Delete"
          appearance="_basic-danger"
          onClick={() => deleteReward(reward)}
        />
      </Form>
    </Modal>
  );
};

const enhance = compose(
  connect(
    null,

    {
      showNotification: notificationActions.showNotification,
      createReward: rewardsActions.createReward,
      updateReward: rewardsActions.updateReward,
      deleteReward: rewardsActions.deleteReward,
    }
  ),
  withFormik({
    validationSchema,
    mapPropsToValues: ({ options }) => {
      const { key, isClaimed, description, image } = options.reward;
      return { key, isClaimed, description, image };
    },
    handleSubmit: async (values, formikBag) => {
      const { isEditing } = formikBag.props.options;
      const defaultState = formikBag.props.options.reward;

      const editRewardRequest = async body => {
        try {
          const request = await http(`/api/admin/reward/${defaultState._id}`, {
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

      const createRewardRequest = async body => {
        try {
          const request = await http('/api/admin/reward', {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(body),
          });

          return request.json();
        } catch (error) {
          console.log(error);
        }
      };

      if (isEditing) {
        const changedFields = getChangedFormFields(defaultState, values);
        const editRequest = await editRewardRequest(changedFields);

        formikBag.props.close();

        formikBag.props.showNotification({
          type: 'success',
          shouldBeAddedToSidebar: false,
          message: i18n.t('notifications.success.entity_is_edited', { name: values.description }),
        });

        formikBag.props.updateReward(editRequest);
      } else {
        const request = await createRewardRequest(values);

        formikBag.props.close();

        formikBag.props.showNotification({
          type: 'success',
          shouldBeAddedToSidebar: false,
          message: i18n.t('notifications.success.entity_is_created', { name: values.description }),
        });

        formikBag.props.updateReward(request);
      }
    },
  }),
);

export default enhance(Reward);
