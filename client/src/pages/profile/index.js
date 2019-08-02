import React from 'react';
import { http, getChangedFormFields } from 'helpers';

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Form, withFormik, Field } from 'formik';
import * as Yup from 'yup';
import { actions as storeActions } from 'store';
import { FormInput } from 'components/form/input';
import PositionSelect from 'components/form/selects/select';
import RegionSelect from 'components/form/selects/region-select';
import Button from 'components/button';
import notificationActions from 'components/notification/actions';

import classnames from 'classnames/bind';
import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

const normalizeSelectField = obj => {
  if (obj.preferredPosition) {
    obj = {
      ...obj,
      preferredPosition: obj.preferredPosition.value,
    };
  }

  if (obj.regionId) {
    obj = {
      ...obj,
      regionId: obj.regionId.value,
    };
  }

  return obj;
};

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

const Profile = () => {
  return (
    <div className={cx('container', 'profile')}>
      <Form className={style.form}>
        <Field
          component={FormInput}
          label={i18n.t('username')}
          name="username"
          className={style.field}
        />

        <Field
          component={FormInput}
          label={i18n.t('summoner_name')}
          name="summonerName"
          className={style.field}
        />

        <Field
          component={PositionSelect}
          label={i18n.t('Position')}
          name="preferredPosition"
          className={style.field}
        />

        <Field
          component={RegionSelect}
          label={i18n.t('region')}
          name="regionId"
          className={style.field}
        />

        <Field
          disabled
          component={FormInput}
          label={i18n.t('email')}
          name="email"
          className={cx('email', 'field')}
        />

        <Field
          component={FormInput}
          label={i18n.t('profile_photo')}
          name="imageUrl"
          className={style.field}
        />

        <Field
          component={FormInput}
          type="textarea"
          label={i18n.t('about')}
          name="about"
          className={style.field}
        />

        <Field
          component={FormInput}
          type="textarea"
          label={i18n.t('twich_account')}
          name="twitchAccount"
          className={style.field}
        />

        <Button
          appearance="_basic-accent"
          type="submit"
          text={i18n.t('save_changes')}
          className={style.save}
        />
      </Form>
    </div>
  );
};

const enhance = compose(
  connect(
    store => ({
      currentUser: store.currentUser,
    }),

    {
      setCurrentUser: storeActions.setCurrentUser,
      showNotification: notificationActions.showNotification,
    }
  ),
  withFormik({
    validationSchema,
    mapPropsToValues: ({ currentUser }) => {
      const {
        _id,
        username,
        email,
        summonerName,
        imageUrl,
        about,
        twitchAccount,
        preferredPosition,
        regionId,
      } = currentUser;

      return {
        _id,
        username,
        email,
        summonerName,
        imageUrl,
        about,
        twitchAccount,
        preferredPosition,
        regionId,
      };
    },
    handleSubmit: async (values, formikBag) => {
      const defaultState = formikBag.props.currentUser;

      const requestBody = getChangedFormFields(defaultState, values);

      const editUserRequest = async body => {
        try {
          const request = await http('/api/users/me', {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(normalizeSelectField(body)),
          });

          return request.json();
        } catch (error) {
          console.log(error);
        }
      };

      formikBag.props.showNotification({
        type: 'success',
        shouldBeAddedToSidebar: false,
        message: i18n.t('notifications.success.profile_edited'),
      });

      editUserRequest(requestBody);
      formikBag.props.setCurrentUser({ ...values });
    },
  }),
);

export default enhance(Profile);
