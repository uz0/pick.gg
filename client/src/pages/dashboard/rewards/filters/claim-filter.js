import React, { Component } from 'react';
import Select from 'react-select';
import compose from 'recompose/compose';

import withStyles from 'components/form/selects/hoc/with-styles';

const options = [{
  label: 'Claimed',
  value: true,
}, {
  label: 'Is not claimed',
  value: false,
}];

const enhance = compose(
  withStyles,
);

class ClaimFilter extends Component {
  render() {
    return (
      <Select
        isClearable
        options={options}
        placeholder="Filter by claim"
        styles={this.props.styles}
        onChange={this.props.onChange}
      />
    );
  }
}

export default enhance(ClaimFilter);
