import modalActions from 'components/modal-container/actions';

import store from 'store';

export const check = (actionWithReg = () => {}, modalOptions) => function (...args) {
  const { currentUser } = store.getState();

  if (currentUser && currentUser.summonerName) {
    return actionWithReg.apply(this, args);
  }

  store.dispatch(modalActions.toggleModal({
    id: 'dropin-auth',

    options: {
      ...modalOptions,
    },
  }));
};
