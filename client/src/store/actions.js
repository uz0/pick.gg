import { createAction } from 'redux-starter-kit';

const types = {
  test: 'test',
};

const test = createAction(types.test);

export default {
  test,
  types,
};
