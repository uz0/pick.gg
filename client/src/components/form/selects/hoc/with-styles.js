import React, { Component } from 'react';

const customStyles = {
  control: styles => ({ ...styles, backgroundColor: 'var(--primary-color)', border: 0 }),
  singleValue: styles => ({ ...styles, color: '#fff', fontSize: '15px', textTransform: 'capitalize' }),
  placeholder: styles => ({ ...styles, color: '#fff', fontSize: '15px' }),
  input: styles => ({ ...styles, color: '#fff', fontSize: '15px', textTransform: 'capitalize' }),
  indicatorSeparator: styles => ({ ...styles, width: 0 }),
  menu: styles => ({ ...styles, color: 'var(--primary-color)', fontSize: '15px', textTransform: 'capitalize' }),
};

const withStyles = WrappedComponent => {
  return class extends Component {
    render() {
      return (
        <WrappedComponent
          styles={customStyles}
          {...this.props}
        />
      );
    }
  };
};

export default withStyles;
