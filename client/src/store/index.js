import { configureStore } from 'redux-starter-kit';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

export { default as actions } from './actions';
export { default as reducers } from './reducers';

const logger = createLogger({
  collapsed: true,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk, logger],
});

export default store;
