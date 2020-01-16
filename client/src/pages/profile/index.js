import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Form, withFormik, Field } from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames/bind';
import pick from 'lodash/pick';

import { FormInput } from 'components/form/input';
import Select from 'components/form/selects/select';
import Button from 'components/button';
import notificationActions from 'components/notification/actions';

import { REGIONS } from 'constants/index';

import { http } from 'helpers';

import i18n from 'i18n';

import { actions as storeActions } from 'store';

import style from './style.module.css';

const cx = classnames.bind(style);

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),

  contact: Yup.string()
    .url('Contact should be a link'),

  twitchAccount: Yup.string()
    .url('Twitch should be a link'),

  imageUrl: Yup.string()
    .url('Avatar should be a link'),

  gameSpecificFields: Yup.object().shape({
    LOL: Yup.object().shape({
      displayName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!'),
    }),

    PUBG: Yup.object().shape({
      displayName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!'),
    }),
  }),
});

const Profile = () => {
  const regionsSelectConfig = REGIONS.map(region => ({
    value: region,
    label: region,
  }));

  return (
    <div className={cx('container', 'profile')}>
      <Form className={style.form}>
        <section className={style.section}>
          <h2 className={style.title}>{i18n.t('forms.user_settings.general_info')}</h2>

          <Field
            name="username"
            label={i18n.t('forms.user_settings.login')}
            labelPosition="left"
            component={FormInput}
            className={style.field}
          />

          <Field
            disabled
            name="email"
            label={i18n.t('forms.user_settings.email')}
            labelPosition="left"
            component={FormInput}
            className={cx('email', style.field)}
          />

          <Field
            name="contact"
            label={i18n.t('forms.user_settings.contact')}
            labelPosition="left"
            component={FormInput}
            className={style.field}
          />

          <Field
            name="twitchAccount"
            label={i18n.t('forms.user_settings.twitch')}
            labelPosition="left"
            component={FormInput}
            className={style.field}
          />

          <Field
            name="imageUrl"
            label={i18n.t('forms.user_settings.userpic')}
            labelPosition="left"
            component={FormInput}
            className={style.field}
          />

          <Field
            name="about"
            label={i18n.t('forms.user_settings.about')}
            labelPosition="left"
            component={FormInput}
            className={style.field}
          />
        </section>

        <section className={style.section}>
          <h2 className={style.title}>LOL</h2>

          <Field
            name="gameSpecificFields.LOL.displayName"
            label={i18n.t('forms.user_settings.lol_name')}
            labelPosition="left"
            component={FormInput}
            className={style.field}
          />

          <Field
            name="gameSpecificFields.LOL.regionId"
            label={i18n.t('forms.user_settings.lol_region')}
            labelPosition="left"
            component={Select}
            defaultOptions={regionsSelectConfig}
            className={style.field}
          />
        </section>

        <section className={style.section}>
          <h2 className={style.title}>PUBG</h2>

          <Field
            name="gameSpecificFields.PUBG.displayName"
            label={i18n.t('forms.user_settings.pubg_name')}
            labelPosition="left"
            component={FormInput}
            className={style.field}
          />
        </section>

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
    mapPropsToValues: ({ currentUser }) => pick(currentUser, [
      '_id',
      'email',
      'username',
      'imageUrl',
      'about',
      'gameSpecificFields',
      'twitchAccount',
      'contact',
    ]),
    handleSubmit: async (values, formikBag) => {
      try {
        const request = await http('/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify(values),
        });

        const updatedProfile = await request.json();

        formikBag.props.showNotification({
          type: 'success',
          shouldBeAddedToSidebar: false,
          message: i18n.t('notifications.success.profile_edited'),
        });

        formikBag.props.setCurrentUser(updatedProfile);
      } catch (error) {
        console.log(error);
      }
    },
  }),
);

export default enhance(Profile);
