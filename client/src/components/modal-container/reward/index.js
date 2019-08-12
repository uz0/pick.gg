import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';
import pick from 'lodash/pick';
import { http, getChangedFormFields } from 'helpers';

import { actions as notificationActions } from 'components/notification';
import { actions as rewardsActions } from 'pages/dashboard/rewards';

import Modal from 'components/modal';
import Button from 'components/button';
import Select from 'components/form/selects/user-select';
import { FormInput } from 'components/form/input';

import i18n from 'i18n';
import style from './style.module.css';

const validationSchema = Yup.object().shape({
  key: Yup.string().required('Key field is required!'),
});

const normalizeUserField = obj => {
  if (obj.userId) {
    return {
      ...obj,
      userId: obj.userId.value,
    };
  }

  return obj;
};

const Reward = props => {
  const modalTitle = props.options.isEditing ? 'Edit reward' : 'Add new reward';

  const deleteReward = async rewardId => {
    try {
      await http(`/api/admin/reward/${rewardId}`, {
        method: 'DELETE',
      });

      props.close();

      props.deleteReward(rewardId);

      props.showNotification({
        type: 'success',
        shouldBeAddedToSidebar: false,
        message: i18n.t('notifications.success.entity_is_deleted', { name: rewardId }),
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
          component={Select}
          label="User"
          name="userId"
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
        <div className={style.wrap_buttons}>
          <Button
            text="Delete"
            appearance="_basic-danger"
            onClick={() => deleteReward(props.options.reward._id)}
          />
          <Button
            className={style.submit}
            type="submit"
            text="Submit"
            appearance="_basic-accent"
          />
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
      createReward: rewardsActions.createReward,
      updateReward: rewardsActions.updateReward,
      deleteReward: rewardsActions.deleteReward,
    }
  ),
  withFormik({
    validationSchema,
    mapPropsToValues: ({ options }) => {
      if (!options.isEditing) {
        return {
          key: '',
          userId: '',
          isClaimed: false,
          description: '',
          image: '',
        };
      }

      return options.isEditing ? pick(options.reward, ['_id', 'key', 'userId', 'isClaimed', 'description', 'image']) : {
        key: '',
        userId: '',
        isClaimed: false,
        description: '',
        image: '',
      };
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
        const editRequest = await editRewardRequest(normalizeUserField(changedFields));

        formikBag.props.close();

        formikBag.props.showNotification({
          type: 'success',
          shouldBeAddedToSidebar: false,
          message: i18n.t('notifications.success.entity_is_edited', { name: values.description }),
        });

        formikBag.props.updateReward(editRequest);

        return;
      }

      const request = await createRewardRequest(normalizeUserField(values));

      if (request.errors) {
        formikBag.props.showNotification({
          type: 'error',
          shouldBeAddedToSidebar: false,
          message: request.errors[0].msg,
        });

        return;
      }

      formikBag.props.createReward(request);

      formikBag.props.close();

      formikBag.props.showNotification({
        type: 'success',
        shouldBeAddedToSidebar: false,
        message: i18n.t('notifications.success.entity_is_created', { name: values.description }),
      });
    },
  }),
);

export default enhance(Reward);
