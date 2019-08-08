import store from 'store';
import modalActions from 'components/modal-container/actions';

export const check = (actionWithReg = () => {}) => function (...args) {
  const isRegistered = store.get('currentUser');

  if (isRegistered) {
    return actionWithReg.apply(this, args);
  }

  store.dispatch(modalActions.toggleModal({
    id: 'express-reg',

    options: {},
  }));
};
