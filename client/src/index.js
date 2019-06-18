import ReactDOM from 'react-dom';
import store, { actions as storeActions } from 'store';
import { isLogged, http } from 'helpers';

import 'typeface-roboto';
import './index.css';

import routes from './routes';

const init = async () => {
  if (isLogged()) {
    let response = await http('/api/users/me');
    response = await response.json();
    store.dispatch(storeActions.setCurrentUser(response.user));
  }

  ReactDOM.render(
    routes(),
    document.querySelector('#root'),
  );
};

init();

