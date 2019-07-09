import React from 'react';
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

const ClaimFilter = props => {
  return (
    <Select
      isClearable
      options={options}
      placeholder="Filter by claim"
      styles={props.styles}
      onChange={props.onChange}
    />
  );
};

export default enhance(ClaimFilter);
