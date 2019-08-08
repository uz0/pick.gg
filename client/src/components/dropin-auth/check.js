import store from 'store';
import modalActions from 'components/modal-container/actions';

export const check = (actionWithReg = () => {}, modalOptions) => function (...args) {
  const isRegistered = store.getState().currentUser;

  if (isRegistered) {
    return actionWithReg.apply(this, args);
  }

  store.dispatch(modalActions.toggleModal({
    id: 'express-reg',

    options: {
      ...modalOptions,
    },
  }));
};
