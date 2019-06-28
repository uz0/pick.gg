import React, { Component } from 'react';
import i18n from 'i18n';

export default getCaptions => WrappedComponent => {
  class Wrapped extends Component {
    render() {
      // IsMobile will be passed from store
      const captions = getCaptions({ t: i18n.t.bind(this), isMobile: false });

      return <WrappedComponent captions={captions} {...this.props}/>;
    }
  }

  return Wrapped;
};
