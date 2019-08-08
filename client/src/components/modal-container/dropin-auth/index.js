import React from 'react';
import GoogleLogin from 'react-google-login';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import ym from 'react-yandex-metrika';
import i18n from 'i18next';

import { http } from 'helpers';
import config from 'config';
import { actions as storeActions } from 'store';

import { actions as notificationActions } from 'components/notification';
import Select from 'components/form/selects/select';
import Modal from 'components/modal';

const enhance = compose(
  withState('summonerName', 'setSummonerName', ''),
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

    this.props.showNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: response.message,
    });
  };

  return (
    <Modal
      title="Choose tournament summoners"
      close={props.close}
      // ClassName={style.modal_content}
      // wrapClassName={style.wrapper}
      actions={props.actions}
    >
      <Select value={props.summonerName} onChange={e => props.setSummonerName(e.target.value)}/>
      <GoogleLogin
        autoLoad={Boolean(this.tournamentId)}
        render={renderProperties => (
          <button
            type="button"
            disabled={!props.summonerName.trim()}
            // ClassName={style.button}
            onClick={renderProperties.onClick}
          >
            <span>{i18n.t('Jump in!')}</span>
          </button>
        )}
        clientId={config.googleClientId}
        onSuccess={auth}
        onFailure={this.onFailureGoogleLogin}
      />
    </Modal>
  );
});
