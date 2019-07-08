import React, { Component } from 'react';
import { http } from 'helpers';
import debounce from 'lodash/debounce';
import compose from 'recompose/compose';

import AsyncSelect from 'react-select/async';
import withStyles from 'components/form/selects/hoc/with-styles';

const enhance = compose(
  withStyles,
);

class UserFilter extends Component {
  normalizeUsers = users => users.map(({ username, _id }) => ({
    label: username,
    value: _id,
  }));

  getSuggestions = debounce(async inputValue => {
    if (!inputValue) {
      return;
    }

    const usersSuggestions = await http(`/api/admin/user/name/${inputValue}`);
    const { users } = await usersSuggestions.json();

    return this.normalizeUsers(users);
  }, 300);

  debouncedOnChange = option => {
    if (option) {
      this.props.onChange(option.value);
      return;
    }

    this.props.onChange(option);
  };

  render() {
    return (
      <AsyncSelect
        isClearable
        defaultOptions
        placeholder="Filter by user"
        loadOptions={this.getSuggestions}
        styles={this.props.styles}
        onChange={this.debouncedOnChange}
        onInputChange={this.handleInputChange}
      />
    );
  }
}

export default enhance(UserFilter);
