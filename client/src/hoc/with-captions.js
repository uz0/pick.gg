import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import i18n from 'i18n';

export default getCaptions => WrappedComponent => {
  class Wrapped extends Component {
    render() {
      const captions = getCaptions({ t: i18n.t.bind(this), isMobile: this.props.isMobile });

      return <WrappedComponent captions={captions} {...this.props}/>;
    }
  }

  return compose(
    connect(
      state => ({
        isMobile: state.device === 'touch',
      }),
    ),
  )(Wrapped);
};
