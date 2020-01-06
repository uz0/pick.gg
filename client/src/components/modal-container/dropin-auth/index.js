import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import ym from 'react-yandex-metrika';
import config from 'config';

import Button from 'components/button';
import { actions as notificationActions } from 'components/notification';
import Input from 'components/form/input';
import Modal from 'components/modal';

import { http } from 'helpers';

import i18n from 'i18n';

import storeActions from 'store/actions';

import style from './style.module.css';

const enhance = compose(
  connect(
    null,

    {
      setCurrentUser: storeActions.setCurrentUser,
      showNotification: notificationActions.showNotification,
    },
  ),
);

export default enhance(props => {
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');

  const usernameInputLabel = props.options.game === 'LOL' ? 'Display name (LOL)' : 'Nickname (PUBG)';

  const auth = async data => {
    const profile = data.getBasicProfile();

    const body = {
      email: profile.getEmail(),
      name: profile.getName(),
      photo: profile.getImageUrl(),
      gameSpecificFields: {
        [props.options.game]: {
          displayName: username,
        },
      },
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
        label={usernameInputLabel}
        value={username}
        onChange={event => setUsername(event.target.value)}
      />
      <Input
        label={i18n.t('modal.contacts')}
        value={contact}
        onChange={event => setContact(event.target.value)}
      />
      <GoogleLogin
        render={renderProperties => (
          <Button
            text={i18n.t('home.button_1')}
            type="button"
            appearance="_basic-accent"
            className={style.button}
            disabled={!username.trim()}
            onClick={renderProperties.onClick}
          />
        )}
        clientId={config.googleClientId}
        onSuccess={auth}
      />
    </Modal>
  );
});
