import React from 'react';
import GoogleLogin from 'react-google-login';
import { compose, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import ym from 'react-yandex-metrika';

import { http } from 'helpers';
import config from 'config';
import storeActions from 'store/actions';
import Button from 'components/button';

import { actions as notificationActions } from 'components/notification';
import Input from 'components/form/input';
import Modal from 'components/modal';
import i18n from 'i18n';

import style from './style.module.css';

const enhance = compose(
  withStateHandlers(() => ({
    summonerName: '',
    contact: '',
  }),

  {
    setSummonerName: state => event => ({ ...state, summonerName: event.target.value }),
    setContact: state => event => ({ ...state, contact: event.target.value }),
  }
  ),
  connect(
    state => ({
      currentUser: state.currentUser,
    }),

    {
      setCurrentUser: storeActions.setCurrentUser,
      showNotification: notificationActions.showNotification,
    },
  ),
);

export default enhance(props => {
  const auth = async data => {
    const profile = data.getBasicProfile();

    const body = {
      email: profile.getEmail(),
      name: profile.getName(),
      photo: profile.getImageUrl(),
      summonerName: props.summonerName,
    };

    let response = await http('/authentication/oauth', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    });

    response = await response.json();

    if (!response.success) {
      props.showNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: response.message,
      });

      return;
    }

    if (response.user) {
      props.setCurrentUser(response.user);
    }

    localStorage.setItem('JWS_TOKEN', response.token);
    ym('reachGoal', 'user_signed_in');

    props.options.action();
    props.close();
  };

  return (
    <Modal
      title={props.options.title || 'Auth'}
      close={props.close}
      className={style.modal_content}
      wrapClassName={style.modal}
      actions={props.actions}
    >
      <Input
        label={i18n.t('summonerName')}
        value={props.summonerName}
        onChange={props.setSummonerName}
      />
      <Input
        label={i18n.t('modal.contacts')}
        value={props.contact}
        onChange={props.setContact}
      />
      <GoogleLogin
        render={renderProperties => (
          <Button
            text={i18n.t('home.button_1')}
            type="button"
            appearance="_basic-accent"
            className={style.summonerName}
            disabled={!props.summonerName.trim()}
            onClick={renderProperties.onClick}
          />
        )}
        clientId={config.googleClientId}
        onSuccess={auth}
      />
    </Modal>
  );
});
