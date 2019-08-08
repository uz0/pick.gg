import React from 'react';
import { http } from 'helpers';
import debounce from 'lodash/debounce';
import compose from 'recompose/compose';

import AsyncSelect from 'react-select/async';
import withStyles from 'components/form/selects/hoc/with-styles';

const enhance = compose(
  withStyles,
);

const normalizeUsers = users => users.map(({ username, _id }) => ({
  label: username,
  value: _id,
}));

const getSuggestions = debounce(async inputValue => {
  if (!inputValue) {
    return;
  }

  const usersSuggestions = await http(`/api/admin/user/name/${inputValue}`);
  const { users } = await usersSuggestions.json();

  return normalizeUsers(users);
}, 300);

const UserFilter = props => {
  const debouncedOnChange = option => {
    if (option) {
      props.onChange(option.value);
      return;
    }

    props.onChange(option);
  };

  return (
    <AsyncSelect
      isClearable
      placeholder="Filter by user"
      loadOptions={getSuggestions}
      styles={props.styles}
      onChange={debouncedOnChange}
    />
  );
};

export default enhance(UserFilter);
